<?php
/**
 * promptwerker theme bootstrap
 */

if (!defined('ABSPATH')) {
    exit;
}

define('PROMPTWERKER_VERSION', '0.1.0');
define('PROMPTWERKER_DIR', get_template_directory());
define('PROMPTWERKER_URI', get_template_directory_uri());

function promptwerker_setup(): void
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');

    register_nav_menus([
        'primary' => __('Hauptmenü', 'promptwerker'),
        'footer'  => __('Footer-Menü', 'promptwerker'),
    ]);
}
add_action('after_setup_theme', 'promptwerker_setup');

function promptwerker_enqueue_assets(): void
{
    wp_enqueue_style(
        'promptwerker-style',
        get_stylesheet_uri(),
        [],
        PROMPTWERKER_VERSION
    );
}
add_action('wp_enqueue_scripts', 'promptwerker_enqueue_assets');

// ACF: field-group JSON lives in /acf-json, synced into the repo instead of the DB.
add_filter('acf/settings/save_json', fn () => PROMPTWERKER_DIR . '/acf-json');
add_filter('acf/settings/load_json', function (array $paths) {
    $paths[] = PROMPTWERKER_DIR . '/acf-json';
    return $paths;
});

// File editing in wp-admin is a deploy-process bypass risk on a Git-managed theme.
define('DISALLOW_FILE_EDIT', true);
