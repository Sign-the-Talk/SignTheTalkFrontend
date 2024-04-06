import "./index.page.scss"

import { useI18N } from "@/i18n/i18n"
import { Button, Space, Typography } from "antd"
const { Title } = Typography
import { LanguageSelectButton } from "@/components/LanguageSelectButton"
import Link from "next/link"


export default function WelcomePage()
{
    const { text } = useI18N()

    return (<div id="welcome_page">
        <LanguageSelectButton />
        <Title>{text.welcome_page.page_title}</Title>
        <Title level={3}>{text.welcome_page.page_subtitle}</Title>
        <Space id="buttons" size="large">
            <Button id="start_now" type="primary" shape="round" size="large">
                <Link href={"/chat"} id="chat_page_link">{text.welcome_page.button__start_now}</Link>
            </Button>
            <Button id="more_info" shape="round" size="large">
                {text.welcome_page.button__more_info}
            </Button>
        </Space>
    </div>)
}