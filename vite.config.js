import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
//Configuration for vite
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});
