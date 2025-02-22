import react from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import sass from "vite-plugin-sass";

const path = require("path");

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.tsx",
            refresh: true,
        }),
        react(),
        sass(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./resources/js"),
            "@css": path.resolve(__dirname, "./resources/css"),
        },
    },
    define: {
        "process.env": {},
    },
});
