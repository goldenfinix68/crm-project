<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Entrypoints
    |--------------------------------------------------------------------------
    | The files in the configured directories will be considered
    | entry points and will not be required in the configuration file.
    | To disable the feature, set to false.
    */
    'entrypoints' => [
        'resources/js',
        'resources/scripts',
    ],
    'ignore_patterns' => [
        '/\\.d\\.ts$/',
        '/\\.json$/',
    ],

    /*
    |--------------------------------------------------------------------------
    | Aliases
    |--------------------------------------------------------------------------
    | These aliases will be added to the Vite configuration and used
    | to generate a proper tsconfig.json file.
    */
    'aliases' => [
        '@' => 'resources',
    ],

    /*
    |--------------------------------------------------------------------------
    | Static assets path
    |--------------------------------------------------------------------------
    | This option defines the directory that Vite considers as the
    | public directory. Its content will be copied to the build directory
    | at build-time.
    | https://vitejs.dev/config/#publicdir
    */
    'public_directory' => resource_path('static'),

    /*
    |--------------------------------------------------------------------------
    | Ping timeout
    |--------------------------------------------------------------------------
    | The maximum duration, in seconds, that the ping to `ping_url` or
    | `dev_url` should take while trying to determine whether to use the
    | manifest or the server in a local environment. Using false will disable
    | the feature.
    | https://laravel-vite.innocenzi.dev/guide/configuration.html#ping-timeout
    */
    'ping_timeout' => 10,
    'ping_url' => null,

    /*
    |--------------------------------------------------------------------------
    | Build path
    |--------------------------------------------------------------------------
    | The directory, relative to /public, in which Vite will build
    | the production files. This should match "build.outDir" in the Vite
    | configuration file.
    */
    'build_path' => 'build',

    /*
    |--------------------------------------------------------------------------
    | Development URL
    |--------------------------------------------------------------------------
    | The URL at which the Vite development server runs.
    | This is used to generate the script tags when developing.
    */
    'dev_url' => env('DEV_SERVER_URL', 'http://localhost:5173'),

    /*
    |--------------------------------------------------------------------------
    | Commands
    |--------------------------------------------------------------------------
    | Defines the list of artisan commands that will be executed when
    | the development server or the production build starts.
    */
    'commands' => [
        'vite:aliases',
        // 'typescript:generate'
    ],
];
