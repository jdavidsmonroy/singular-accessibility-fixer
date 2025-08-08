/**
 * Singularity Accessibility Fixer - Dynamic Script
 * Versión 7.0.0
 *
 * Corrige elementos de accesibilidad que se generan dinámicamente con JavaScript.
 */
(function() {
    
    function sngFixDynamicControls() {
        // Busca enlaces o botones que no tengan ya un aria-label.
        const controls = document.querySelectorAll('a:not([aria-label]), [role="button"]:not([aria-label])');

        controls.forEach(control => {
            // Si el control ya tiene texto visible, es accesible, así que lo ignoramos.
            if (control.textContent.trim().length > 0) {
                return;
            }

            // Buscamos un icono dentro del control para adivinar su función.
            // Esta búsqueda es más genérica para encontrar 'i' o 'span'.
            const icon = control.querySelector('[class*="eicon-"], [class*="fa-"]');
            if (icon) {
                let label = '';
                const iconClass = icon.className;
                const controlHref = control.href || '';

                // Diccionario de iconos y comprobación de URL para el icono de cuenta.
                if (iconClass.includes('user') || iconClass.includes('person') || controlHref.includes('mi-cuenta')) {
                    label = 'Mi Cuenta de Usuario';
                }
                else if (iconClass.includes('search')) { 
                    label = 'Buscar'; 
                }
                else if (iconClass.includes('cart') || iconClass.includes('shopping-bag')) { 
                    label = 'Ver carrito de compra'; 
                }
                else if (iconClass.includes('bars') || iconClass.includes('menu')) { 
                    label = 'Abrir menú de navegación'; 
                }
                else if (iconClass.includes('times') || iconClass.includes('close')) { 
                    label = 'Cerrar ventana'; 
                }
                
                if (label) {
                    control.setAttribute('aria-label', label);
                }
            }
        });
    }

    // Ejecutamos la función repetidamente para cazar los elementos dinámicos.
    // Usar un intervalo es la forma más robusta de asegurar que se apliquen las correcciones.
    setInterval(sngFixDynamicControls, 750);

})();