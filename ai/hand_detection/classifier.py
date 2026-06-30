"""
Placeholder for CNN/Transformer-based hand sign classifier.
Will be implemented in Phase 3 (Finger Recognition) and Phase 4 (Word Detection).

Training pipeline:
1. Collect landmark data from MediaPipe
2. Normalize landmarks relative to wrist (landmark 0)
3. Train classifier on normalized landmark sequences

Supported architectures:
- CNN on landmark heatmaps
- LSTM on landmark sequences (for dynamic signs)
- Transformer encoder for context-aware recognition
"""

import numpy as np


def normalize_landmarks(landmarks: list[dict]) -> np.ndarray:
    if not landmarks:
        return np.array([])

    wrist = landmarks[0]
    normalized = []
    for lm in landmarks:
        normalized.extend([
            lm["x"] - wrist["x"],
            lm["y"] - wrist["y"],
            lm["z"] - wrist["z"],
        ])
    return np.array(normalized, dtype=np.float32)
