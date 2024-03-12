// vite.config.js
import { defineConfig } from "file:///D:/Humer/Work%20Files/RDF%20Projects/Developing/Vladimir/Vladimir%20Front%20End/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Humer/Work%20Files/RDF%20Projects/Developing/Vladimir/Vladimir%20Front%20End/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dotenv from "file:///D:/Humer/Work%20Files/RDF%20Projects/Developing/Vladimir/Vladimir%20Front%20End/node_modules/dotenv/lib/main.js";
import { VitePWA } from "file:///D:/Humer/Work%20Files/RDF%20Projects/Developing/Vladimir/Vladimir%20Front%20End/node_modules/vite-plugin-pwa/dist/index.mjs";
dotenv.config();
var vite_config_default = defineConfig({
  plugins: [react(), VitePWA({
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
  })],
  // server: {
  //   // port: 3030,
  //   host: true
  // },
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxIdW1lclxcXFxXb3JrIEZpbGVzXFxcXFJERiBQcm9qZWN0c1xcXFxEZXZlbG9waW5nXFxcXFZsYWRpbWlyXFxcXFZsYWRpbWlyIEZyb250IEVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcSHVtZXJcXFxcV29yayBGaWxlc1xcXFxSREYgUHJvamVjdHNcXFxcRGV2ZWxvcGluZ1xcXFxWbGFkaW1pclxcXFxWbGFkaW1pciBGcm9udCBFbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0h1bWVyL1dvcmslMjBGaWxlcy9SREYlMjBQcm9qZWN0cy9EZXZlbG9waW5nL1ZsYWRpbWlyL1ZsYWRpbWlyJTIwRnJvbnQlMjBFbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IGRvdGVudiBmcm9tIFwiZG90ZW52XCI7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xuXG5kb3RlbnYuY29uZmlnKCk7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBWaXRlUFdBKHtcbiAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICBpbmplY3RSZWdpc3RlcjogJ2F1dG8nLFxuXG4gICAgd29ya2JveDoge1xuICAgICAgY2xlYW51cE91dGRhdGVkQ2FjaGVzOiBmYWxzZSxcbiAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyxqc29uLHZ1ZSx0eHQsd29mZjJ9J11cbiAgICB9LFxuXG4gICAgbWFuaWZlc3Q6IHtcbiAgICAgIG5hbWU6ICdWbGFkaW1pciBJbnZlbnRvcnkgU3lzdGVtJyxcbiAgICAgIHNob3J0X25hbWU6ICdWbGFkaW1pcicsXG4gICAgICBkZXNjcmlwdGlvbjogJ1JERiBJbnZlbnRvcnkgU3lzdGVtJyxcbiAgICAgIGRpc3BsYXk6ICdzdGFuZGFsb25lJyxcbiAgICAgIHRoZW1lX2NvbG9yOiAncHJpbWFyeScsXG4gICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAncHJpbWFyeScsXG4gICAgICBpY29uczogW1xuICAgICAgICB7XG4gICAgICAgICAgc3JjOiAnL3NyYy9JbWcvZmF2aWNvbjEucG5nJyxcbiAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3JjOiAnL3NyYy9JbWcvZmF2aWNvbjEucG5nJyxcbiAgICAgICAgICBzaXplczogJzI1NngyNTYnLFxuICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3JjOiAnL3NyYy9JbWcvZmF2aWNvbjEucG5nJyxcbiAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICB9LFxuICAgICAgXVxuXG4gICAgfSxcbiAgfSldLFxuICBzZXJ2ZXI6IHtcbiAgICAvLyBwb3J0OiAzMDMwLFxuICAgIGhvc3Q6IHRydWUsXG4gIH0sXG4gIGRlZmluZToge1xuICAgIFwicHJvY2Vzcy5lbnYuUE9SVFwiOiBgJHtwcm9jZXNzLmVudi5QT1JUfWAsXG4gICAgXCJwcm9jZXNzLmVudi5TRURBUl9LRVlcIjogYFwiJHtwcm9jZXNzLmVudi5TRURBUl9LRVl9XCJgLFxuICAgIFwicHJvY2Vzcy5lbnYuRklTVE9fS0VZXCI6IGBcIiR7cHJvY2Vzcy5lbnYuRklTVE9fS0VZfVwiYCxcbiAgICBcInByb2Nlc3MuZW52LlZMQURJTUlSX0JBU0VfVVJMXCI6IGBcIiR7cHJvY2Vzcy5lbnYuVkxBRElNSVJfQkFTRV9VUkx9XCJgLFxuICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUE2WixTQUFTLG9CQUFvQjtBQUMxYixPQUFPLFdBQVc7QUFDbEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsZUFBZTtBQUV4QixPQUFPLE9BQU87QUFJZCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLFFBQVE7QUFBQSxJQUN6QixjQUFjO0FBQUEsSUFDZCxnQkFBZ0I7QUFBQSxJQUVoQixTQUFTO0FBQUEsTUFDUCx1QkFBdUI7QUFBQSxNQUN2QixjQUFjLENBQUMsbURBQW1EO0FBQUEsSUFDcEU7QUFBQSxJQUVBLFVBQVU7QUFBQSxNQUNSLE1BQU07QUFBQSxNQUNOLFlBQVk7QUFBQSxNQUNaLGFBQWE7QUFBQSxNQUNiLFNBQVM7QUFBQSxNQUNULGFBQWE7QUFBQSxNQUNiLGtCQUFrQjtBQUFBLE1BQ2xCLE9BQU87QUFBQSxRQUNMO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxPQUFPO0FBQUEsVUFDUCxNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxVQUNFLEtBQUs7QUFBQSxVQUNMLE9BQU87QUFBQSxVQUNQLE1BQU07QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsT0FBTztBQUFBLFVBQ1AsTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGO0FBQUEsSUFFRjtBQUFBLEVBQ0YsQ0FBQyxDQUFDO0FBQUEsRUFDRixRQUFRO0FBQUE7QUFBQSxJQUVOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixvQkFBb0IsR0FBRyxRQUFRLElBQUk7QUFBQSxJQUNuQyx5QkFBeUIsSUFBSSxRQUFRLElBQUk7QUFBQSxJQUN6Qyx5QkFBeUIsSUFBSSxRQUFRLElBQUk7QUFBQSxJQUN6QyxpQ0FBaUMsSUFBSSxRQUFRLElBQUk7QUFBQSxFQUNuRDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
