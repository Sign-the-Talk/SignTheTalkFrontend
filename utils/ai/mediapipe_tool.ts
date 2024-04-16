import { GestureRecognizer, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision"

let gesture_recogniser: GestureRecognizer | null = null

const mediapipe_wasm_path = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
const mediapipe_model_path = "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"

export async function prepareMediapipe()
{
    const vision_resolver = await FilesetResolver.forVisionTasks(mediapipe_wasm_path)
    gesture_recogniser = await GestureRecognizer.createFromOptions(
        vision_resolver,
        {
            baseOptions: { modelAssetPath: mediapipe_model_path },
            numHands: 2,
            runningMode: "VIDEO"
        }
    )
}

let should_continue_detect = false

export function startDetecting()
{
    const video_element = document.getElementById("webcam_video") as HTMLVideoElement
    console.log(`startDetecting`)
    should_continue_detect = true
    detectGesture(video_element)
}

export function stopDetecting()
{
    console.log(`stopDetecting`)
    should_continue_detect = false
}

export async function detectGesture(video: HTMLVideoElement)
{
    if (gesture_recogniser == null)
    {
        throw EvalError(`The "gesture_recogniser" is still null, have you called "prepareMediapipe" beforehand ?`)
    }
    const time_now__ms = Date.now()
    const recognise_result = gesture_recogniser.recognizeForVideo(video, time_now__ms)

    // Continue according to switch.
    if (should_continue_detect) { requestAnimationFrame(() => detectGesture(video)) }

    // If there is a valid gesture, then return
    if (recognise_result.gestures.length > 0)
    {
        console.log(`Result at ${time_now__ms}:`, recognise_result)
    }
}