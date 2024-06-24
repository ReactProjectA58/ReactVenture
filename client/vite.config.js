import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { BASE } from "../client/src/common/constants";

export default defineConfig({
  plugins: [react()],
  base: BASE,
});
