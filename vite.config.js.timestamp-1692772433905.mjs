// vite.config.js
import { defineConfig } from "file:///D:/Humer/Work%20Files/RDF%20Projects/Developing/Vladimir/Vladimir%20Front%20End/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Humer/Work%20Files/RDF%20Projects/Developing/Vladimir/Vladimir%20Front%20End/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dotenv from "file:///D:/Humer/Work%20Files/RDF%20Projects/Developing/Vladimir/Vladimir%20Front%20End/node_modules/dotenv/lib/main.js";
import { VitePWA } from "file:///D:/Humer/Work%20Files/RDF%20Projects/Developing/Vladimir/Vladimir%20Front%20End/node_modules/vite-plugin-pwa/dist/index.mjs";
import basicSsl from "file:///D:/Humer/Work%20Files/RDF%20Projects/Developing/Vladimir/Vladimir%20Front%20End/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
dotenv.config();
var vite_config_default = defineConfig({
  plugins: [
    react(),
    // basicSsl(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        cleanupOutdatedCaches: false,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"]
      },
      manifest: {
        name: "Vladimir Inventory System",
        short_name: "Vladimir",
        description: "RDF Inventory System",
        display: "standalone",
        theme_color: "primary",
        background_color: "primary",
        icons: [
          {
            src: "/src/Img/favicon1.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/src/Img/favicon1.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "/src/Img/favicon1.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  server: {
    // port: 3030,
    host: true
  },
  define: {
    "process.env.PORT": `${process.env.PORT}`,
    "process.env.SEDAR_KEY": `"${process.env.SEDAR_KEY}"`,
    "process.env.FISTO_KEY": `"${process.env.FISTO_KEY}"`,
    "process.env.VLADIMIR_BASE_URL": `"${process.env.VLADIMIR_BASE_URL}"`
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxIdW1lclxcXFxXb3JrIEZpbGVzXFxcXFJERiBQcm9qZWN0c1xcXFxEZXZlbG9waW5nXFxcXFZsYWRpbWlyXFxcXFZsYWRpbWlyIEZyb250IEVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcSHVtZXJcXFxcV29yayBGaWxlc1xcXFxSREYgUHJvamVjdHNcXFxcRGV2ZWxvcGluZ1xcXFxWbGFkaW1pclxcXFxWbGFkaW1pciBGcm9udCBFbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0h1bWVyL1dvcmslMjBGaWxlcy9SREYlMjBQcm9qZWN0cy9EZXZlbG9waW5nL1ZsYWRpbWlyL1ZsYWRpbWlyJTIwRnJvbnQlMjBFbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCBkb3RlbnYgZnJvbSBcImRvdGVudlwiO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xyXG5pbXBvcnQgYmFzaWNTc2wgZnJvbSAnQHZpdGVqcy9wbHVnaW4tYmFzaWMtc3NsJ1xyXG5cclxuZG90ZW52LmNvbmZpZygpO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCksXHJcbiAgLy8gYmFzaWNTc2woKSxcclxuICBWaXRlUFdBKHtcclxuICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxyXG4gICAgaW5qZWN0UmVnaXN0ZXI6ICdhdXRvJyxcclxuXHJcbiAgICB3b3JrYm94OiB7XHJcbiAgICAgIGNsZWFudXBPdXRkYXRlZENhY2hlczogZmFsc2UsXHJcbiAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyxqc29uLHZ1ZSx0eHQsd29mZjJ9J11cclxuICAgIH0sXHJcblxyXG4gICAgbWFuaWZlc3Q6IHtcclxuICAgICAgbmFtZTogJ1ZsYWRpbWlyIEludmVudG9yeSBTeXN0ZW0nLFxyXG4gICAgICBzaG9ydF9uYW1lOiAnVmxhZGltaXInLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1JERiBJbnZlbnRvcnkgU3lzdGVtJyxcclxuICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxyXG4gICAgICB0aGVtZV9jb2xvcjogJ3ByaW1hcnknLFxyXG4gICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAncHJpbWFyeScsXHJcbiAgICAgIGljb25zOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgc3JjOiAnL3NyYy9JbWcvZmF2aWNvbjEucG5nJyxcclxuICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXHJcbiAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNyYzogJy9zcmMvSW1nL2Zhdmljb24xLnBuZycsXHJcbiAgICAgICAgICBzaXplczogJzI1NngyNTYnLFxyXG4gICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBzcmM6ICcvc3JjL0ltZy9mYXZpY29uMS5wbmcnLFxyXG4gICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcclxuICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF1cclxuXHJcbiAgICB9LFxyXG4gIH0pXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIC8vIHBvcnQ6IDMwMzAsXHJcbiAgICBob3N0OiB0cnVlLFxyXG4gIH0sXHJcbiAgZGVmaW5lOiB7XHJcbiAgICBcInByb2Nlc3MuZW52LlBPUlRcIjogYCR7cHJvY2Vzcy5lbnYuUE9SVH1gLFxyXG4gICAgXCJwcm9jZXNzLmVudi5TRURBUl9LRVlcIjogYFwiJHtwcm9jZXNzLmVudi5TRURBUl9LRVl9XCJgLFxyXG4gICAgXCJwcm9jZXNzLmVudi5GSVNUT19LRVlcIjogYFwiJHtwcm9jZXNzLmVudi5GSVNUT19LRVl9XCJgLFxyXG4gICAgXCJwcm9jZXNzLmVudi5WTEFESU1JUl9CQVNFX1VSTFwiOiBgXCIke3Byb2Nlc3MuZW52LlZMQURJTUlSX0JBU0VfVVJMfVwiYCxcclxuICB9LFxyXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQTZaLFNBQVMsb0JBQW9CO0FBQzFiLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7QUFDbkIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sY0FBYztBQUVyQixPQUFPLE9BQU87QUFJZCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFBQyxNQUFNO0FBQUE7QUFBQSxJQUVoQixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxnQkFBZ0I7QUFBQSxNQUVoQixTQUFTO0FBQUEsUUFDUCx1QkFBdUI7QUFBQSxRQUN2QixjQUFjLENBQUMsbURBQW1EO0FBQUEsTUFDcEU7QUFBQSxNQUVBLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLFNBQVM7QUFBQSxRQUNULGFBQWE7QUFBQSxRQUNiLGtCQUFrQjtBQUFBLFFBQ2xCLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxRQUNGO0FBQUEsTUFFRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQUM7QUFBQSxFQUNGLFFBQVE7QUFBQTtBQUFBLElBRU4sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLG9CQUFvQixHQUFHLFFBQVEsSUFBSTtBQUFBLElBQ25DLHlCQUF5QixJQUFJLFFBQVEsSUFBSTtBQUFBLElBQ3pDLHlCQUF5QixJQUFJLFFBQVEsSUFBSTtBQUFBLElBQ3pDLGlDQUFpQyxJQUFJLFFBQVEsSUFBSTtBQUFBLEVBQ25EO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
