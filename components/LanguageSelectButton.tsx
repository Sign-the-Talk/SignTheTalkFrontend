import { Button, Dropdown, MenuProps } from "antd";
import { possible_locales, useI18N } from "../i18n/i18n";
import Link from "next/link";
import { TranslationOutlined } from "@ant-design/icons";

// Copied and modified from Software Engineering course project because it is common components,
//  no need to re-write.
export function LanguageSelectButton()
{
    const { text } = useI18N()

    const lang_items: MenuProps["items"] = possible_locales.map(
        locale => ({
            key: locale, label: (<Link href={""} locale={locale}>
                {text.lang[locale as keyof typeof text.lang]}
            </Link>)
        })
    )

    return (<div id="lang_select_button">
        <Dropdown menu={{ items: lang_items }}><Button shape="round">
            <TranslationOutlined />
        </Button></Dropdown>
    </div>)
}