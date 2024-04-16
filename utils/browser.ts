export function requestOpenFrontCamera()
{
    return navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
}