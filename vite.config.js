import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: true,
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/uploads": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true
      }
    }
  },
});
