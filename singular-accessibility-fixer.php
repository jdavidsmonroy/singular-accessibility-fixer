<?php
/**
 * Plugin Name:      Singularity Accessibility Fixer
 * Plugin URI:       https://github.com/jdavidsmonroy/singular-accessibility-fixer
 * Description:      Solución del lado del cliente (JavaScript) para problemas críticos de accesibilidad, asegurando máxima compatibilidad.
 * Version:          7.1.1
 * Author:           Juan David Suárez (Singularity Edge)
 * Author URI:       https://singularityedge.com
 * License:          GPLv2 or later
 * GitHub Plugin URI: https://github.com/jdavidsmonroy/singular-accessibility-fixer/
 */

if ( ! defined( 'ABSPATH' ) ) die;

// --- Correcciones del Lado del Servidor (PHP) ---
// Mantenemos solo los filtros que son seguros y no reescriben todo el DOM.
// Este filtro para Joinchat es seguro porque solo actúa sobre un fragmento específico de HTML.
add_filter( 'joinchat_html_output', function( $html_output ) {
    // Si el atributo ya existe, no hagas nada para evitar duplicados.
    if ( strpos( $html_output, 'aria-label=' ) !== false ) {
        return $html_output;
    }
    
    $find = '<div class="joinchat__button" role="button" tabindex="0">';
    $replace = '<div class="joinchat__button" role="button" tabindex="0" aria-label="Contactar por WhatsApp">';
    return str_replace( $find, $replace, $html_output );
}, 20, 1 );


// --- Correcciones del Lado del Cliente (JavaScript) ---
// Encolamos nuestro script que ahora se encargará de todas las correcciones en el navegador.
// Esto es mucho más compatible con otros plugins.
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_script(
        'sng-dynamic-fixer',
        plugin_dir_url( __FILE__ ) . 'js/dynamic-fixer.js',
        [], // Sin dependencias
        '7.1.1', // Nueva versión del plugin
        true // Cargar en el footer para asegurar que el DOM esté listo
    );
}, 100); // Usamos una prioridad baja (100) para ejecutarlo después de otros scripts.


// --- Gestor de Actualizaciones ---
// Esto no cambia, se mantiene igual.
require_once __DIR__ . '/plugin-update-checker/plugin-update-checker.php';
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$myUpdateChecker = PucFactory::buildUpdateChecker(
    'https://github.com/jdavidsmonroy/singular-accessibility-fixer/',
    __FILE__,
    'singular-accessibility-fixer'
);
$myUpdateChecker->setBranch('main');
