from flask import Flask
from flask_sock import Sock as FlaskSocket, Server as SocketServer
from hand_detect import getGestureDetectorsGenerator
from util import transformDataFromJSON

app = Flask("sign_the_talk__server")
socket = FlaskSocket(app)

gesture_detectors_generator = getGestureDetectorsGenerator()
next(gesture_detectors_generator)


@socket.route("/recog_hand")
def recogniseHandGesture(socket: SocketServer):
    if socket == None:
        raise RuntimeError("Cannot create socket.")

    while True:
        message = socket.receive(timeout=None)
        if message != None:
            # print(f"Got message:\n{message}")
            result = gesture_detectors_generator.send(transformDataFromJSON(message))
            if result is not None:
                print(f"Got detected gesture: {result}")
                socket.send(result)


if __name__ == "__main__":
    app.run("localhost", 8009)
