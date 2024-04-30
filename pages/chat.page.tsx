"use client"

import "./chat.page.scss"

import { Button, Typography } from "antd"
const { Title, Text } = Typography
import { useI18N } from "@/i18n/i18n"
import { useEffect, useRef, useState } from "react"
import { prepareMediapipe, startDetectingFromVideo, stopDetecting } from "@/utils/ai/mediapipe_tool"
import { BaseButtonProps } from "antd/es/button/button"
import { requestOpenFrontCamera } from "@/utils/browser"

const empty_landmarks = [...new Array(21)].map(() => ({ x: 0, y: 0, z: 0 } as const))

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

    /** The translating is launching. */
    starting = "starting",

    /** Translation stopped. */
    stopped = "stopped",

    /** Some error occurs. */
    error = "error"
}

export default function ChatPage()
{
    let [page_status, setPageStatus] = useState(PageStatus.just_entered)
    let media_stream = useRef<MediaStream | null>(null)
    let web_socket = useRef<WebSocket | null>(null)
    const { text } = useI18N()
    const { title, description, button } = getPageElementAccordingToStatus()

    function getReturnContent()
    {
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

    useEffect(
        function ()
        {
            prepareMediapipe()
            web_socket.current = getWebSocketToHandRecognision()
            web_socket.current.onmessage = handleWebSocketMessage
        },
        []
    )

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

    const startDetecting = () => startDetectingFromVideo({
        processResult: function (result)
        {
            const handedness = result.handedness.flat()
            const [left_hand_index, right_hand_index] = ["Left", "Right"].map(
                category_name => handedness.find(v => v.categoryName == category_name)?.index
            )
            web_socket.current.send(JSON.stringify({
                left: result.landmarks[left_hand_index] ?? empty_landmarks,
                right: result.landmarks[right_hand_index] ?? empty_landmarks
            }))
        }
    })

    function startChat()
    {
        requestOpenFrontCamera()
            .then(
                function (stream)
                {
                    const video_element = document.getElementById("webcam_video") as HTMLVideoElement
                    media_stream.current = video_element.srcObject = stream
                    video_element.play()
                    video_element.addEventListener("loadeddata", startDetecting)
                    setPageStatus(PageStatus.translating)
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

    function handleWebSocketMessage(event: MessageEvent)
    {
        console.log(`Got parsed result: ${event.data}`)
    }

    return getReturnContent()
}

function getWebSocketToHandRecognision()
{
    try
    {
        return new WebSocket("ws://localhost:8009/recog_hand")
    }
    catch (error)
    {
        console.error(`The server is possibly not up.`, error)
    }
}