import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
            manifest: {
                name: "Cartola Finanças",
                short_name: "Cartola",
                //start_url: "/Capybara",
                display: "standalone",
                background_color: "#ffffff",
                theme_color: "#000000",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,png,woff2,svg}"],
            },
        }),
    ],
    server: {
        host: true
    },
    //base: "/Capybara",
});