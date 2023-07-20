import react from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

const path = require("path");

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.tsx",
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./resoureces/js"),
            "@css": path.resolve(__dirname, "./resoureces/css"),
        },
    },
    define: {
        "process.env": {},
    },
});
