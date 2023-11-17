import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Specify the address of your Express server
        changeOrigin: true,
        // You can add additional proxy options here if needed
      },
    },
    host: true,
  },
});