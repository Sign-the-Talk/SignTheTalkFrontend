import { expect, test, } from "vitest"
import { render, screen } from "@testing-library/react"
import { userEvent as user_event } from "@testing-library/user-event"

import WelcomePage from "@/pages/index.page"

test(
    "Test if Vitest is working properly",
    function ()
    {
        expect(1 + 1).toBe(2)
    }
)

test(
    `Test the existance of the "start" button on welcome page`,
    async function ()
    {
        const result = render(<WelcomePage />)
        const start_button = result.container.querySelector("#start_now")
        const go_to_chat_link = result.container.querySelector("#chat_page_link")


        expect(start_button).toBeDefined();
        expect(go_to_chat_link.getAttribute("href")).toBe("/chat")
    }
)