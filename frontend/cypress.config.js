import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "fe82qx",
  e2e: {
    experimentalStudio: true,
    baseUrl: "http://localhost:5173",
  },
});
