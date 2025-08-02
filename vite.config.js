import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Đảm bảo base path đúng
  build: {
    outDir: "dist", // Output directory
    assetsDir: "assets", // Asset directory
    sourcemap: false, // Tắt sourcemap cho production
    minify: true, // Minify code
  },
  server: {
    port: 5173,
    host: true,
  },
});
