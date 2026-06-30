"""
Lip reading model pipeline.
Extracts lip landmarks from MediaPipe Face Mesh and classifies lip movements.

Datasets:
    - LRW (Lip Reading in the Wild): 500,000+ word-level clips
    - LRS3: Large-scale sentence-level lip reading

Architecture: CNN + LSTM or Transformer on lip ROI sequences.

Current status: lip state detection (open/closed/slightly_open)
Future: word-level and sentence-level lip reading
"""

import numpy as np

LIP_LANDMARK_INDICES = {
    "outer_upper": [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
    "outer_lower": [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61],
    "inner_upper": [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308],
    "inner_lower": [308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78],
}


def extract_lip_features(face_landmarks: list[dict]) -> np.ndarray:
    if not face_landmarks or len(face_landmarks) < 468:
        return np.array([])

    features = []

    upper = face_landmarks[13]
    lower = face_landmarks[14]
    lip_distance = np.sqrt(
        (upper["x"] - lower["x"]) ** 2 + (upper["y"] - lower["y"]) ** 2
    )
    features.append(lip_distance)

    left = face_landmarks[61]
    right = face_landmarks[291]
    lip_width = np.sqrt(
        (left["x"] - right["x"]) ** 2 + (left["y"] - right["y"]) ** 2
    )
    features.append(lip_width)

    if lip_width > 0:
        features.append(lip_distance / lip_width)
    else:
        features.append(0.0)

    for region, indices in LIP_LANDMARK_INDICES.items():
        for idx in indices:
            lm = face_landmarks[idx]
            features.extend([lm["x"], lm["y"]])

    return np.array(features, dtype=np.float32)


def classify_lip_state(lip_distance: float) -> str:
    if lip_distance > 0.04:
        return "open"
    elif lip_distance > 0.02:
        return "slightly_open"
    return "closed"
