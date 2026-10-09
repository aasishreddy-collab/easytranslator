import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "3000-itsjtvo4iptv24ywq3fbu-d7751c75.sg2.manus.computer",
      "8328-itsjtvo4iptv24ywq3fbu-d7751c75.sg2.manus.computer",
      "3000-iftnnug227dn3fb3ji779-b57dbeb0.sg2.manus.computer",
    ],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
