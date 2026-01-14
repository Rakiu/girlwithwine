import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  optimizeDeps: {
    include: ["jquery", "froala-editor", "react-froala-wysiwyg"],
  },

  resolve: {
    alias: {
      jquery: path.resolve(
        __dirname,
        "node_modules/jquery/dist/jquery.js"
      ),
    },
  },

  server: {
    host: true,
    port: 5173,
  },
});
