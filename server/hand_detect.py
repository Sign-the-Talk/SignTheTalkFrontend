import os
from tensorflow.python.keras.engine.sequential import Sequential
from tensorflow.python.keras.layers import LSTMV1 as LSTM, Dense
import numpy as np
from util import GestureLandmark, LandmarkCoordinate


sequence = []
sentence = []
threshold = 0.9
actions = np.array([
    "Hello", "Nice", "Meet", "You", "Like", "How", "More", "Two", "Three", "No", "Right",
    "Want", "Wrong", "Yes", "<unknown_gesture>"
])
detect_buffer_length = 8

model: Sequential = Sequential()  # type: ignore
model.add(LSTM(64, return_sequences=True, activation="relu", input_shape=(detect_buffer_length, 126)))
model.add(LSTM(128, return_sequences=True, activation="relu"))
model.add(LSTM(64, return_sequences=False, activation="relu"))
model.add(Dense(64, activation="relu"))
model.add(Dense(32, activation="relu"))
model.add(Dense(actions.shape[0], activation="softmax"))
model.load_weights(os.path.join(os.path.dirname(__file__), "action.h5"))


def extract_keypoints(landmarks: GestureLandmark):
    lh = np.array([[res.x, res.y, res.z] for res in landmarks.left]
                  ).flatten() if landmarks.left else np.zeros(21 * 3)
    rh = np.array([[res.x, res.y, res.z] for res in landmarks.right]
                  ).flatten() if landmarks.right else np.zeros(21 * 3)
    return np.concatenate([lh, rh])


def getGestureDetectorsGenerator():
    while True:
        landmarks = yield None
        if landmarks is None:
            print(f"Empty value received, continue.")
            continue

        global sequence, sentence
        keypoints = extract_keypoints(landmarks)
        sequence.append(keypoints)
        sequence = sequence[-detect_buffer_length:]
        if len(sequence) == detect_buffer_length:
            predict_result = model.predict(np.expand_dims(sequence, axis=0))
            if predict_result is None: raise ValueError(f"Cannot predict with keypoints `{keypoints}`.")
            res = predict_result[0]
            gesture_meaning = actions[np.argmax(res)]
            # print(gesture_meaning)
            yield gesture_meaning
            # sequence = []
