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

    if (mainSkipLink) {
      const href = mainSkipLink.getAttribute("href");

      if (href && href.startsWith("#")) {
        const targetId = href.substring(1);

        const targetElement = document.getElementById(targetId);

        if (!targetElement) {
          const elementorContainer = document.querySelector(
            '[data-elementor-type="wp-page"]'
          );

          if (elementorContainer) {
            elementorContainer.setAttribute("id", targetId);
          }
        }
      }
    }

    const interactiveSelectors =
      'button:not([aria-label]), a:not([aria-label]), [role="menuitem"]:not([aria-label])';
    const elementsToFix = document.querySelectorAll(interactiveSelectors);

    elementsToFix.forEach((el) => {
      if (
        el.classList.contains("skip-link") ||
        el.classList.contains("qlwapp__button") ||
        el.classList.contains("joinchat__button") ||
        el.classList.contains("elementor-icon")
      ) {
        return;
      }

      if (el.querySelector('img[alt]:not([alt=""])')) {
        return;
      }

      const text = el.textContent.trim();
      const title = el.getAttribute("title");

      let label = "";
      if (text) {
        label = text;
      } else if (title) {
        label = title.trim();
      } else {
        if (el.tagName === "A") {
          label = "Abrir enlace";
        } else {
          label = "Botón de acción";
        }
      }
      if (label) {
        el.setAttribute("aria-label", label);
      }
    });
  };

  applyAccessibilityFixes();

  const observer = new MutationObserver(() => {
    applyAccessibilityFixes();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
