"""
Multimodal fusion engine (server-side).
Combines predictions from hand, face, pose, and lip modules.

Fusion strategies:
    1. Early fusion: concatenate features from all modalities, feed into single classifier
    2. Late fusion: independent classifiers per modality, combine predictions (current approach)
    3. Attention fusion: transformer-based cross-modal attention (future work)
"""

from dataclasses import dataclass


@dataclass
class ModalityInput:
    hand_sign: str | None = None
    hand_confidence: float = 0.0
    emotion: str | None = None
    emotion_confidence: float = 0.0
    pose_gesture: str | None = None
    pose_confidence: float = 0.0
    lip_state: str | None = None


MODALITY_WEIGHTS = {
    "hand": 0.45,
    "emotion": 0.20,
    "pose": 0.20,
    "lip": 0.15,
}


def fuse(inputs: ModalityInput) -> dict:
    components = []
    weighted_confidence = 0.0
    total_weight = 0.0

    if inputs.hand_sign:
        components.append(("hand", inputs.hand_sign, inputs.hand_confidence))
        weighted_confidence += inputs.hand_confidence * MODALITY_WEIGHTS["hand"]
        total_weight += MODALITY_WEIGHTS["hand"]

    if inputs.emotion and inputs.emotion != "neutral":
        components.append(("emotion", inputs.emotion, inputs.emotion_confidence))
        weighted_confidence += inputs.emotion_confidence * MODALITY_WEIGHTS["emotion"]
        total_weight += MODALITY_WEIGHTS["emotion"]

    if inputs.pose_gesture and inputs.pose_gesture != "STANDING":
        components.append(("pose", inputs.pose_gesture, inputs.pose_confidence))
        weighted_confidence += inputs.pose_confidence * MODALITY_WEIGHTS["pose"]
        total_weight += MODALITY_WEIGHTS["pose"]

    if inputs.lip_state and inputs.lip_state != "closed":
        components.append(("lip", inputs.lip_state, 0.7))
        weighted_confidence += 0.7 * MODALITY_WEIGHTS["lip"]
        total_weight += MODALITY_WEIGHTS["lip"]

    overall_confidence = weighted_confidence / total_weight if total_weight > 0 else 0.0

    return {
        "primary_sign": inputs.hand_sign,
        "components": [{"modality": m, "value": v, "confidence": c} for m, v, c in components],
        "overall_confidence": round(overall_confidence, 3),
        "modality_count": len(components),
    }
