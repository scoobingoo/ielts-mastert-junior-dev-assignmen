import { defineConfig } from "vitest/config";
import path from "path";

// Cấu hình Vitest hỗ trợ alias @/* trỏ vào thư mục src
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
