"""
Pose gesture classifier.
Uses 33 body landmarks from MediaPipe Pose.

Recognizable gestures:
    - Wave, Point, Fold hands, Bow, Raise hand, Lean

Architecture: MLP or LSTM on normalized landmark sequences.
"""

import numpy as np

POSE_GESTURE_LABELS = [
    "standing", "wave", "hands_up", "folded_hands",
    "right_hand_raise", "left_hand_raise", "bow", "lean", "point",
]


def normalize_pose_landmarks(landmarks: list[dict]) -> np.ndarray:
    if not landmarks or len(landmarks) < 33:
        return np.array([])

    hip_center = {
        "x": (landmarks[23]["x"] + landmarks[24]["x"]) / 2,
        "y": (landmarks[23]["y"] + landmarks[24]["y"]) / 2,
        "z": (landmarks[23]["z"] + landmarks[24]["z"]) / 2,
    }

    features = []
    for lm in landmarks:
        features.extend([
            lm["x"] - hip_center["x"],
            lm["y"] - hip_center["y"],
            lm["z"] - hip_center["z"],
        ])

    return np.array(features, dtype=np.float32)
