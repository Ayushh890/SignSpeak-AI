import mediapipe as mp
import numpy as np

mp_hands = mp.solutions.hands


class HandDetectionService:
    def __init__(self):
        self.hands = mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )

    def detect(self, frame: np.ndarray) -> dict:
        results = self.hands.process(frame)

        if not results.multi_hand_landmarks:
            return {"landmarks": [], "handedness": []}

        landmarks = []
        handedness = []

        for hand_landmarks, hand_handedness in zip(
            results.multi_hand_landmarks, results.multi_handedness
        ):
            hand_data = []
            for lm in hand_landmarks.landmark:
                hand_data.append({"x": lm.x, "y": lm.y, "z": lm.z})
            landmarks.append(hand_data)
            handedness.append(hand_handedness.classification[0].label)

        return {"landmarks": landmarks, "handedness": handedness}

    def close(self):
        self.hands.close()
