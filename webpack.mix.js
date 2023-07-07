const mix = require("laravel-mix");

mix.js("resources/js/app.tsx", "public/js")
    .postCss("resources/css/app.css", "public/css", [
        //
    ])
    .react()
    .webpackConfig({
        resolve: {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
    })
    .version();
