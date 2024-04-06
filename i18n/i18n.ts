// This file is a basic configuration file, copied from HCI project.

import { useRouter } from "next/router"
import en_text from "./en.json"
import ja_text from "./ja.json"
import zh_text from "./zh.json"
import getNextConfig from "next/config"

type AvailablePageLanguage = "en" | "zh" | "ja"

export function useI18N()
{
    const { locale: router_locale } = useRouter()

    let text: typeof en_text;
    let locale: AvailablePageLanguage;
    switch (router_locale)
    {
        case "en": text = en_text; locale = "en"; break;
        case "ja": text = ja_text; locale = "ja"; break;
        case "zh": text = zh_text; locale = "zh"; break;
        default: text = en_text; locale = "en"; break;
    }

    return ({ locale, text })
}

const runtime_config: { locales: string[] } = getNextConfig().publicRuntimeConfig

export const possible_locales = runtime_config.locales