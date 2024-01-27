import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [glsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
