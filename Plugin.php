<?php

namespace SpAnjaan\NepaliUnicode;

use Backend\Facades\Backend;
use Backend\Models\UserRole;
use System\Classes\PluginBase;

/**
 * NepaliUnicode Plugin Information File
 */
class Plugin extends PluginBase
{
    /**
     * Returns information about this plugin.
     */
    public function pluginDetails(): array
    {
        return [
            'name'        => 'spanjaan.nepaliunicode::lang.plugin.name',
            'description' => 'spanjaan.nepaliunicode::lang.plugin.description',
            'author'      => 'SpAnjaan',
            'icon'        => 'icon-leaf'
        ];
    }

    /**
     * Register method, called when the plugin is first registered.
     */
    public function register(): void
    {

    }

    /**
     * Boot method, called right before the request route.
     */
    public function boot(): void
    {

    }

    /**
     * Registers any frontend components implemented in this plugin.
     */
    public function registerComponents(): array
    {
        return [
            \SpAnjaan\NepaliUnicode\Components\UnicodeConverter::class => 'unicodeConverter',
        ];
    }

    /**
     * Registers any backend permissions used by this plugin.
     */
    public function registerPermissions(): array
    {
        return []; // Remove this line to activate

        return [
            'spanjaan.nepaliunicode.some_permission' => [
                'tab' => 'spanjaan.nepaliunicode::lang.plugin.name',
                'label' => 'spanjaan.nepaliunicode::lang.permissions.some_permission',
                'roles' => [UserRole::CODE_DEVELOPER, UserRole::CODE_PUBLISHER],
            ],
        ];
    }

    /**
     * Registers backend navigation items for this plugin.
     */
    public function registerNavigation(): array
    {
        return []; // Remove this line to activate

        return [
            'nepaliunicode' => [
                'label'       => 'spanjaan.nepaliunicode::lang.plugin.name',
                'url'         => Backend::url('spanjaan/nepaliunicode/mycontroller'),
                'icon'        => 'icon-leaf',
                'permissions' => ['spanjaan.nepaliunicode.*'],
                'order'       => 500,
            ],
        ];
    }
}
