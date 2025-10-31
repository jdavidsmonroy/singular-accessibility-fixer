/**
 * Singular Accessibility Fixer - Dynamic Content Fixer
 * Versión: 7.1.1
 *
 * Se encarga de todas las correcciones del DOM de forma segura en el lado del cliente,
 * asegurando máxima compatibilidad con otros plugins.
 */

document.addEventListener("DOMContentLoaded", function () {
  /**
   * Función principal que aplica todas las correcciones de accesibilidad necesarias.
   * Es idempotente, lo que significa que se puede ejecutar varias veces sin causar problemas.
   */
  const applyAccessibilityFixes = () => {
    // Tarea 1: Arreglar imágenes sin 'alt' o con 'alt' vacío.
    // Esto lo hacía antes PHP, ahora es responsabilidad de JS.
    const images = document.querySelectorAll('img:not([alt]), img[alt=""]');
    images.forEach((image) => {
      // Intenta usar el atributo 'title' si existe, si no, usa un texto genérico.
      const title = image.getAttribute("title");
      image.setAttribute("alt", title ? title.trim() : "Imagen descriptiva");
    });

    // Tarea 2: Arreglar "skip links" sin texto o nombre accesible.
    const skipLinks = document.querySelectorAll("a.skip-link");
    skipLinks.forEach((link) => {
      // Si no tiene texto visible Y no tiene aria-label, lo arreglamos.
      if (!link.textContent.trim() && !link.getAttribute("aria-label")) {
        link.textContent = "Saltar al contenido";
        link.setAttribute("aria-label", "Saltar al contenido");
      }
    });

    // Tarea 3: Arreglar enlaces de íconos sin nombre discernible (ej. Elementor).
    // Buscamos enlaces que contengan un ícono y no tengan texto ni label.
    const iconLinks = document.querySelectorAll(
      'a.elementor-icon:not([aria-label]), a:has(i[class*="fa-"]):not([aria-label])'
    );
    iconLinks.forEach((link) => {
      if (link.textContent.trim() === "") {
        const href = link.getAttribute("href");
        if (href) {
          if (href.includes("/mi-cuenta")) {
            link.setAttribute("aria-label", "Mi Cuenta");
          } else if (href.includes("/carrito")) {
            link.setAttribute("aria-label", "Carrito de compras");
          } else if (href.includes("tel:")) {
            link.setAttribute("aria-label", "Llamar ahora");
          } else if (href.includes("mailto:")) {
            link.setAttribute("aria-label", "Enviar correo electrónico");
          }
        }
      }
    });

    const joinchatButton = document.querySelector(
      ".joinchat__button:not([aria-label])"
    );

    if (joinchatButton) {
      joinchatButton.setAttribute("aria-label", "Contactar por WhatsApp");
    }

    const qlwappButton = document.querySelector(
      "a.qlwapp__button:not([aria-label])"
    );

    if (qlwappButton) {
      qlwappButton.setAttribute("aria-label", "Contactar por WhatsApp");
    }

    const mainSkipLink = document.querySelector("a.skip-link");

    // Solo continuar si el skip-link existe
    if (mainSkipLink) {
      const href = mainSkipLink.getAttribute("href"); // Ej: "#content"

      // Solo continuar si el href es un ancla (empieza con #)
      if (href && href.startsWith("#")) {
        const targetId = href.substring(1); // Ej: "content"

        // Comprobar si el elemento de destino (ej: #content) YA existe
        const targetElement = document.getElementById(targetId);

        // Si el destino NO existe, lo creamos.
        if (!targetElement) {
          // Buscar el contenedor principal de la página de Elementor
          const elementorContainer = document.querySelector(
            '[data-elementor-type="wp-page"]'
          );

          // Si lo encontramos, le asignamos el ID que falta
          if (elementorContainer) {
            elementorContainer.setAttribute("id", targetId);
          }
        }
      }
    }

    // Tarea 4: Añadir 'aria-label' por defecto a elementos interactivos sin él.
    const interactiveSelectors = 'button:not([aria-label]), a:not([aria-label]), [role="menuitem"]:not([aria-label])';
    const elementsToFix = document.querySelectorAll(interactiveSelectors);

    elementsToFix.forEach((el) => {
      // Ignorar elementos que ya tienen su propia lógica de corrección.
      if (el.classList.contains('skip-link') || el.classList.contains('qlwapp__button') || el.classList.contains('joinchat__button') || el.classList.contains('elementor-icon')) {
        return;
      }

      // No sobreescribir si el nombre accesible puede venir de una imagen con alt no vacío.
      if (el.querySelector('img[alt]:not([alt=""])')) {
        return;
      }

      const text = el.textContent.trim();
      const title = el.getAttribute('title');

      let label = '';
      if (text) {
        label = text;
      } else if (title) {
        label = title.trim();
      } else {
        // Como última opción, usar un label genérico según el tipo de elemento.
        if (el.tagName === 'A') {
          label = 'Abrir enlace';
        } else {
          label = 'Botón de acción';
        }
      }
      // Solo añadir el atributo si hemos podido generar un label.
      if (label) {
        el.setAttribute('aria-label', label);
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
    subtree: true, // Observar también en todos los descendientes.
  });
});
