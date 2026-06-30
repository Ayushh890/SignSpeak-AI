import math


def distance(a: dict, b: dict) -> float:
    return math.sqrt(
        (a["x"] - b["x"]) ** 2
        + (a["y"] - b["y"]) ** 2
        + (a["z"] - b["z"]) ** 2
    )


def is_finger_extended(landmarks: list[dict], finger: str) -> bool:
    tips = {"thumb": 4, "index": 8, "middle": 12, "ring": 16, "pinky": 20}
    pips = {"thumb": 3, "index": 6, "middle": 10, "ring": 14, "pinky": 18}
    mcps = {"thumb": 2, "index": 5, "middle": 9, "ring": 13, "pinky": 17}

    tip = landmarks[tips[finger]]
    pip_ = landmarks[pips[finger]]
    mcp = landmarks[mcps[finger]]

    if finger == "thumb":
        return abs(tip["x"] - mcp["x"]) > abs(pip_["x"] - mcp["x"]) * 1.2
    return tip["y"] < pip_["y"]


def recognize_sign(landmarks: list[dict]) -> dict | None:
    if not landmarks or len(landmarks) < 21:
        return None

    fingers = {
        f: is_finger_extended(landmarks, f)
        for f in ["thumb", "index", "middle", "ring", "pinky"]
    }

    all_down = not any(fingers[f] for f in ["index", "middle", "ring", "pinky"])

    if all_down and fingers["thumb"]:
        return {"sign": "A", "confidence": 0.85}

    if all(fingers[f] for f in ["index", "middle", "ring", "pinky"]) and not fingers["thumb"]:
        return {"sign": "B", "confidence": 0.85}

    if fingers["index"] and fingers["thumb"] and not any(
        fingers[f] for f in ["middle", "ring", "pinky"]
    ):
        return {"sign": "L", "confidence": 0.85}

    if all(fingers.values()):
        return {"sign": "OPEN_HAND", "confidence": 0.9}

    if not any(fingers.values()):
        return {"sign": "FIST", "confidence": 0.8}

    if fingers["thumb"] and fingers["pinky"] and not any(
        fingers[f] for f in ["index", "middle", "ring"]
    ):
        return {"sign": "Y", "confidence": 0.85}

    return None
