/**
 * Singular Accessibility Fixer - Dynamic Content Fixer
 * Versión: 7.1.0
 *
 * Se encarga de todas las correcciones del DOM de forma segura en el lado del cliente,
 * asegurando máxima compatibilidad con otros plugins.
 */

document.addEventListener('DOMContentLoaded', function() {

    /**
     * Función principal que aplica todas las correcciones de accesibilidad necesarias.
     * Es idempotente, lo que significa que se puede ejecutar varias veces sin causar problemas.
     */
    const applyAccessibilityFixes = () => {

        // Tarea 1: Arreglar imágenes sin 'alt' o con 'alt' vacío.
        // Esto lo hacía antes PHP, ahora es responsabilidad de JS.
        const images = document.querySelectorAll('img:not([alt]), img[alt=""]');
        images.forEach(image => {
            // Intenta usar el atributo 'title' si existe, si no, usa un texto genérico.
            const title = image.getAttribute('title');
            image.setAttribute('alt', title ? title.trim() : 'Imagen descriptiva');
        });

        // Tarea 2: Arreglar "skip links" sin texto o nombre accesible.
        const skipLinks = document.querySelectorAll('a.skip-link');
        skipLinks.forEach(link => {
            // Si no tiene texto visible Y no tiene aria-label, lo arreglamos.
            if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
                link.textContent = 'Saltar al contenido';
                link.setAttribute('aria-label', 'Saltar al contenido');
            }
        });

        // Tarea 3: Arreglar enlaces de íconos sin nombre discernible (ej. Elementor).
        // Buscamos enlaces que contengan un ícono y no tengan texto ni label.
        const iconLinks = document.querySelectorAll('a.elementor-icon:not([aria-label]), a:has(i[class*="fa-"]):not([aria-label])');
        iconLinks.forEach(link => {
            if (link.textContent.trim() === '') {
                const href = link.getAttribute('href');
                if (href) {
                    if (href.includes('/mi-cuenta')) {
                        link.setAttribute('aria-label', 'Mi Cuenta');
                    } else if (href.includes('/carrito')) {
                        link.setAttribute('aria-label', 'Carrito de compras');
                    } else if (href.includes('tel:')) {
                        link.setAttribute('aria-label', 'Llamar ahora');
                    } else if (href.includes('mailto:')) {
                        link.setAttribute('aria-label', 'Enviar correo electrónico');
                    }
                }
            }
        });
    };

    // --- Ejecución y Observación ---

    // Ejecuta los arreglos tan pronto como el DOM esté listo.
    applyAccessibilityFixes();

    // Configuramos un observador para manejar contenido cargado dinámicamente (AJAX).
    // Esto asegura que los arreglos también se apliquen a elementos que aparecen más tarde.
    const observer = new MutationObserver(() => {
        // Volvemos a aplicar los arreglos si el DOM cambia.
        applyAccessibilityFixes();
    });

    // Inicia la observación sobre todo el cuerpo del documento.
    observer.observe(document.body, {
        childList: true, // Observar si se añaden/quitan elementos.
        subtree: true    // Observar también en todos los descendientes.
    });
});
