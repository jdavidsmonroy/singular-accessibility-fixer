/**
 * Singular Accessibility Fixer - Dynamic Content Fixer
 *
 * Soluciona problemas de accesibilidad en elementos cargados o modificados dinámicamente.
 * Versión: 7.0.1
 */
document.addEventListener('DOMContentLoaded', function() {

    /**
     * Función principal que aplica las correcciones de accesibilidad.
     * Está diseñada para ejecutarse varias veces y no duplicar arreglos.
     */
    const applyAccessibilityFixes = () => {

        // Tarea 1: Arreglar "skip links" sin texto.
        // Busca enlaces con la clase 'skip-link' que no tengan texto.
        const skipLinks = document.querySelectorAll('a.skip-link');
        skipLinks.forEach(link => {
            // Si el texto está vacío (después de quitar espacios), le añade el contenido.
            if (!link.textContent.trim()) {
                link.textContent = 'Saltar al contenido';
            }
        });

        // Tarea 2: Arreglar enlaces de íconos sin nombre discernible.
        // Busca el enlace del ícono que apunta a "/mi-cuenta".
        const accountIconLink = document.querySelector('a.elementor-icon[href*="/mi-cuenta"]');
        if (accountIconLink) {
            // Si no tiene ya una 'aria-label', se la añade.
            // 'aria-label' es la forma correcta de dar un nombre accesible a un elemento sin texto visible.
            if (!accountIconLink.getAttribute('aria-label')) {
                accountIconLink.setAttribute('aria-label', 'Mi Cuenta');
            }
        }
    };

    // Ejecuta los arreglos una vez que el contenido inicial de la página ha cargado.
    applyAccessibilityFixes();

    // ---- Observador de Mutaciones (La clave para contenido dinámico) ----
    // Elementor y otros plugins pueden añadir elementos después de que la página cargue.
    // Este observador vigila el 'body' y si detecta cambios (como nuevos elementos),
    // vuelve a ejecutar nuestra función de arreglos para cubrirlos.
    const observer = new MutationObserver(applyAccessibilityFixes);

    // Inicia la observación sobre todo el cuerpo de la página.
    observer.observe(document.body, {
        childList: true, // Observar si se añaden o quitan elementos hijos.
        subtree: true    // Observar también en todos los descendientes.
    });
});