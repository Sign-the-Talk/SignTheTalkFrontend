import "./index.page.scss"

import { useI18N } from "@/i18n/i18n"
import { Button, Space, Typography } from "antd"
const { Title } = Typography
import { LanguageSelectButton } from "@/components/LanguageSelectButton"


export default function WelcomePage()
{
    const { text } = useI18N()

    return (<div id="welcome_page">
        <LanguageSelectButton />
        <Title>{text.welcome_page.page_title}</Title>
        <Title level={3}>{text.welcome_page.page_subtitle}</Title>
        <Space id="buttons" size="large">
            <Button type="primary" shape="round" size="large">{text.welcome_page.button__start_now}</Button>
            <Button shape="round" size="large">{text.welcome_page.button__more_info}</Button>
        </Space>
    </div>)
}