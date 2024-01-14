import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import './backend/public'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: { port: 3030 },
  build: {
    outDir: '../sprint4-backend/public',
    emptyOutDir: true
  }
});
