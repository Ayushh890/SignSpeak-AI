"""
Emotion classifier training pipeline.
Uses face landmarks / blendshapes from MediaPipe Face Mesh.

Datasets:
    - FER2013 (Kaggle): 35,887 labeled facial expression images
    - AffectNet: 400,000+ labeled images

Architecture options:
    - CNN on face images (traditional approach)
    - MLP on face blendshape values (lightweight, what we use in the browser)
    - CNN + LSTM for temporal emotion tracking
"""

import numpy as np


def extract_blendshape_features(blendshapes: list[dict]) -> np.ndarray:
    feature_names = [
        "browDownLeft", "browDownRight", "browInnerUp",
        "browOuterUpLeft", "browOuterUpRight",
        "cheekSquintLeft", "cheekSquintRight",
        "eyeBlinkLeft", "eyeBlinkRight",
        "eyeWideLeft", "eyeWideRight",
        "jawOpen", "jawForward",
        "mouthSmileLeft", "mouthSmileRight",
        "mouthFrownLeft", "mouthFrownRight",
        "mouthOpen", "mouthShrugLower",
        "noseSneerLeft", "noseSneerRight",
    ]

    features = []
    shape_dict = {bs["categoryName"]: bs["score"] for bs in blendshapes}
    for name in feature_names:
        features.append(shape_dict.get(name, 0.0))

    return np.array(features, dtype=np.float32)


EMOTION_LABELS = ["happy", "sad", "angry", "surprise", "fear", "neutral"]
