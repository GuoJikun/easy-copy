import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const nameList = ["background", "content"];

export default defineConfig({
  appType: "mpa",
  plugins: [vue()],
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: "./popup.html",
        background: "./src/background.js",
        content: "./src/content.js",
      },

      output: {
        entryFileNames: (info) => {
          return nameList.includes(info.name) ? "[name].js" : "[name].js";
        },
      },
    },
  },
});
