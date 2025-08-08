<?php
/**
 * Plugin Name:       Singularity Accessibility Fixer
 * Plugin URI:        https://github.com/jdavidsmonroy/singular-accessibility-fixer
 * Description:       Solución Híbrida (PHP + JS) y segura para problemas críticos de accesibilidad.
 * Version:           7.0.1
 * Author:            Juan David Suárez (Singularity Edge)
 * Author URI:        https://singularityedge.com
 * License:           GPLv2 or later
 * GitHub Plugin URI: https://github.com/jdavidsmonroy/singular-accessibility-fixer
 */

// ¡¡¡ATENCIÓN!!! Recuerda cambiar el número de Versión a 7.0.1 (o la que corresponda) para la actualización.

if ( ! defined( 'ABSPATH' ) ) die;

// Solución verificada para el botón de Joinchat
add_filter( 'joinchat_html_output', function( $html_output ) {
    $find = '<div class="joinchat__button" role="button" tabindex="0">';
    $replace = '<div class="joinchat__button" role="button" tabindex="0" aria-label="Contactar por WhatsApp">';
    return str_replace( $find, $replace, $html_output );
}, 20, 1 );

// Inicia el búfer para arreglar el HTML de forma segura
add_action('init', function() {
    if ( ! is_admin() ) ob_start( 'sng_safe_html_processor' );
});

add_action('shutdown', function() {
    if ( ! is_admin() && ob_get_length() ) ob_end_flush();
});

function sng_safe_html_processor( $buffer ) {
    if ( empty( $buffer ) || strpos( $buffer, '<body' ) === false ) return $buffer;

    $parts = preg_split( '/(<body.*?>)/i', $buffer, -1, PREG_SPLIT_DELIM_CAPTURE );
    if ( count( $parts ) < 3 ) return $buffer;

    $head_part = $parts[0];
    $body_tag  = $parts[1];
    $body_part = $parts[2];

    $dom = new DOMDocument();
    libxml_use_internal_errors( true );
    $dom->loadHTML( mb_convert_encoding( $body_part, 'HTML-ENTITIES', 'UTF-8' ), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD );
    libxml_clear_errors();
    $xpath = new DOMXPath( $dom );

    // Tarea 1: Arreglar imágenes sin 'alt'
    $images = $xpath->query( '//img[not(@alt) or @alt=""]' );
    foreach ( $images as $image ) {
        $title = $image->getAttribute( 'title' );
        $image->setAttribute( 'alt', $title ? $title : 'Imagen descriptiva' );
    }
    
    // Tarea 2: Arreglar "skip links" vacíos
    $skip_links = $xpath->query( '//a[contains(@class, "skip-link") and not(normalize-space())]' );
    foreach ( $skip_links as $link ) {
        $link->nodeValue = 'Saltar al contenido';
    }
    
    $processed_body = $dom->saveHTML();
    return $head_part . $body_tag . $processed_body;
}

// Carga el script JS para arreglar elementos dinámicos
add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_script(
        'sng-dynamic-fixer',
        plugin_dir_url( __FILE__ ) . 'js/dynamic-fixer.js',
        [],
        '7.0.1', // Coincide con la versión del plugin
        true
    );
} );

// Carga e inicia la librería para las actualizaciones desde GitHub
require_once __DIR__ . '/plugin-update-checker/plugin-update-checker.php';
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;
$myUpdateChecker = PucFactory::buildUpdateChecker(
    'https://github.com/jdavidsmonroy/singular-accessibility-fixer/', // <-- ¡URL REAL INSERTADA!
    __FILE__,
    'singular-accessibility-fixer'
);
$myUpdateChecker->setBranch('main');