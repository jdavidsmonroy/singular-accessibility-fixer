<?php
/**
 * Plugin Name:       Singularity Accessibility Fixer
 * Plugin URI:        https://github.com/TU_USUARIO_GITHUB/TU_REPOSITORIO
 * Description:       Solución Híbrida (PHP + JS) y segura para problemas críticos de accesibilidad. Actualizable desde GitHub.
 * Version:           7.0.0
 * Author:            Juan David Suárez (Singularity Edge)
 * Author URI:        https://singularityedge.com
 * License:           GPLv2 or later
 * GitHub Plugin URI: https://github.com/TU_USUARIO_GITHUB/TU_REPOSITORIO
 */

// Evita el acceso directo al archivo.
if ( ! defined( 'ABSPATH' ) ) {
    die;
}

/**
 * =================================================================
 * ARREGLOS CON PHP (Para contenido estático y fiable)
 * =================================================================
 */

// 1. Solución verificada para el botón de Joinchat.
add_filter( 'joinchat_html_output', function( $html_output ) {
    $find = '<div class="joinchat__button" role="button" tabindex="0">';
    $replace = '<div class="joinchat__button" role="button" tabindex="0" aria-label="Contactar por WhatsApp">';
    return str_replace( $find, $replace, $html_output );
}, 20, 1 );

// 2. Inicia el búfer de salida para arreglar las imágenes.
add_action('init', function() {
    if ( ! is_admin() ) {
        ob_start( 'sng_fix_images_processor' );
    }
});

// 3. Finaliza y limpia el búfer de forma segura al final de la carga.
add_action('shutdown', function() {
    if ( ! is_admin() && ob_get_length() ) {
        ob_end_flush();
    }
});

/**
 * Procesa el HTML del <body> de forma segura para arreglar las imágenes.
 */
function sng_fix_images_processor( $buffer ) {
    if ( empty( $buffer ) || strpos( $buffer, '<body' ) === false ) {
        return $buffer;
    }

    $parts = preg_split( '/(<body.*?>)/i', $buffer, -1, PREG_SPLIT_DELIM_CAPTURE );
    if ( count( $parts ) < 3 ) {
        return $buffer;
    }

    $head_part = $parts[0];
    $body_tag  = $parts[1];
    $body_part = $parts[2];

    $dom = new DOMDocument();
    libxml_use_internal_errors( true );
    $dom->loadHTML( mb_convert_encoding( $body_part, 'HTML-ENTITIES', 'UTF-8' ), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
    libxml_clear_errors();
    $xpath = new DOMXPath( $dom );

    // Arreglar imágenes sin 'alt' o con 'alt' vacío.
    $images = $xpath->query( '//img[not(@alt) or @alt=""]' );
    foreach ( $images as $image ) {
        $title = $image->getAttribute( 'title' );
        $image->setAttribute( 'alt', $title ? $title : 'Imagen descriptiva' );
    }
    
    $processed_body = $dom->saveHTML();
    return $head_part . $body_tag . $processed_body;
}

/**
 * =================================================================
 * ARREGLOS CON JAVASCRIPT (Para contenido dinámico)
 * =================================================================
 */

// 4. Carga nuestro script JS para arreglar elementos dinámicos.
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_script(
        'sng-dynamic-fixer',
        plugin_dir_url( __FILE__ ) . 'js/dynamic-fixer.js',
        [],
        '7.0.0', // Coincide con la versión del plugin
        true     // Cargar en el footer
    );
} );

/**
 * =================================================================
 * ACTUALIZADOR AUTOMÁTICO DESDE GITHUB
 * =================================================================
 */

// 5. Carga e inicia la librería para las actualizaciones.
require_once __DIR__ . '/plugin-update-checker/plugin-update-checker.php';

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$myUpdateChecker = PucFactory::buildUpdateChecker(
    'https://github.com/jdavidsmonroy/singular-accessibility-fixer/', // ¡¡¡CAMBIA ESTO!!!
    __FILE__,
    'singular-accessibility-fixer'
);

$myUpdateChecker->setBranch('main');