// vite.config.js
export default {
  server: {
    proxy: {
      "/genai": "http://localhost:3000"
    }
  }
};
