import { vi } from "vitest"

// Solving the failure of getting next config: https://github.com/vercel/next.js/issues/9761#issuecomment-721048254.
vi.mock(
    "next/config",
    async (importOrigin) =>
    {
        const result = await importOrigin<typeof import("next/config")>()
        return ({
            ...result,
            default: vi.fn(() => ({ publicRuntimeConfig: { locales: ["en", "ja", "zh"] } }))
        })
    }
)

vi.mock(
    "next/router",
    async (importOrigin) =>
    {
        const result = await importOrigin<typeof import("next/config")>()
        return ({
            ...result,
            useRouter: vi.fn(() => ({ locale: "en" }))
        })
    }
);