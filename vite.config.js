import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./src/assets/manifest.json";

export default defineConfig({
	plugins: [react(), crx({ manifest })],
});
