import json
from typing import Literal


class LandmarkCoordinate:
    def __init__(self, x: float, y: float, z: float):
        self.x = x
        self.y = y
        self.z = z


class GestureLandmark:
    def __init__(self, left: list[LandmarkCoordinate], right: list[LandmarkCoordinate]):
        self.left = left
        self.right = right


def transformDataFromJSON(json_string: str):
    parsed_object: dict[Literal["left", "right"], list[dict[Literal["x", "y", "z"], float]]] = json.loads(json_string)
    result = GestureLandmark(
        list(map(lambda coords: LandmarkCoordinate(coords["x"], coords["y"], coords["z"]), parsed_object["left"])),
        list(map(lambda coords: LandmarkCoordinate(coords["x"], coords["y"], coords["z"]), parsed_object["right"]))
    )
    return result
