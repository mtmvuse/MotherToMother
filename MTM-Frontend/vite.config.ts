/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());
  const isProduction = mode === "production";
  console.log("mode: ", mode);
  const backendURL = isProduction
    ? env.VITE_PRODUCTION_SERVER_URL
    : env.VITE_LOCAL_SERVER_URL;
  console.log("backendURL: ", backendURL);

  return defineConfig({
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        },
        devOptions: {
          enabled: true,
        },
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
        manifest: {
          name: "MTM User",
          short_name: "MTM User",
          description: "MTM User App for agency partners and public donors",
          theme_color: "#ffffff",
          icons: [
            {
              src: "./icons/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "./icons/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "./icons/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "./icons/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        strategies: "generateSW",
      }),
    ],
    optimizeDeps: {
      include: ["@mui/icons-material", "@mui/material"],
    },
    // server: {
    //   proxy: {
    //     // Proxy /api requests to our express server
    //     "/api": {
    //       // target: backendURL,
    //       target: backendURL,
    //       changeOrigin: true,
    //       secure: false,
    //       rewrite: (path) => path.replace(/^\/api/, ""),
    //     },
    //   },
    // },
  });
};
