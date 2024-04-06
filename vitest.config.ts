import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    test: {
        environment: 'jsdom',
        include: ["test/*.test.ts?(x)"],
        setupFiles: ["./vitest_mock_setup.ts"]
    },
    // Solve import path problem:
    //  https://stackoverflow.com/questions/75380295/error-in-vitest-config-with-nextjs13-failed-to-resolve-import.
    plugins: [tsconfigPaths(), react()],
})