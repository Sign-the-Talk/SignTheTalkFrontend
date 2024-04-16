"use client"

import "./chat.page.scss"

import { Button, Typography } from "antd"
const { Title, Text } = Typography
import { useI18N } from "@/i18n/i18n"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { prepareMediapipe, startDetecting, stopDetecting } from "@/utils/ai/mediapipe_tool"
import { BaseButtonProps } from "antd/es/button/button"
import { requestOpenFrontCamera } from "@/utils/browser"


/**
 * 
 * Status Chage
 * 
 * ```plaintext
 * just_entered ---> translating <---> stopped
 * |
 * v
 * error
 * ```
 */
enum PageStatus
{
    /** User just enter the chat page, may need time to read instruction. */
    just_entered = "just_entered",

    /** Translating user's sign language. */
    translating = "translating",

    /** Translation stopped. */
    stopped = "stopped",

    /** Some error occurs. */
    error = "error"
}

export default function ChatPage()
{
    let [page_status, setPageStatus] = useState(PageStatus.just_entered)
    let webcam = null
    let media_stream: MutableRefObject<MediaStream | null> = useRef(null)

    const { text } = useI18N()

    function getPageElementAccordingToStatus()
    {
        const t = text.chat
        function makeButton(type: BaseButtonProps["type"], onClick: () => any, text: string) 
        {
            return (<Button
                className="button" type={type} shape="round" size="large" onClick={onClick}>
                {text}
            </Button>)
        }
        switch (page_status)
        {
            case PageStatus.just_entered:
                return {
                    title: t.title__just_entered, description: t.desc__just_entered,
                    button: makeButton("primary", startChat, "Start")
                }
            case PageStatus.translating:
                return {
                    title: t.title__translating, description: t.desc__translating,
                    button: makeButton("default", stopChat, "Stop")
                }
            case PageStatus.stopped:
                return {
                    title: t.title__stopped, description: t.desc__stopped,
                    button: makeButton("primary", startChat, "Start")
                }
            case PageStatus.error:
                return {
                    title: t.title__error, description: t.desc__error,
                    button: makeButton("dashed", () => { }, "Cannot Start")
                }

            default: throw TypeError(`The page_status "${page_status}" is not handled!`)
        }
    }


    function startChat()
    {
        setPageStatus(PageStatus.translating)
        requestOpenFrontCamera()
            .then(
                function (stream)
                {
                    const video_element = document.getElementById("webcam_video") as HTMLVideoElement
                    media_stream.current = video_element.srcObject = stream
                    video_element.play()
                    video_element.addEventListener("loadeddata", startDetecting)
                }
            )
    }

    function stopChat()
    {
        setPageStatus(PageStatus.stopped)
        stopDetecting()
        media_stream.current?.getTracks().forEach(track => track.stop())
        const video_element = document.getElementById("webcam_video") as HTMLVideoElement
        video_element.removeEventListener("loadeddata", startDetecting)
    }

    const { title, description, button } = getPageElementAccordingToStatus()

    useEffect(
        function ()
        {
            prepareMediapipe()
        },
        []
    )

    return (<div id="chat_page">
        <div id="left_panel">
            <Title className="title">{title}</Title>
            <Text>{description}</Text>
            {button}
            <video id="webcam_video" autoPlay={true} playsInline={true} />
        </div>
        <div id="right_panel"></div>
    </div>)
}