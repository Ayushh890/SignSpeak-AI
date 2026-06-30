"""
Hand detection module using MediaPipe.
Browser-side detection via @mediapipe/tasks-vision handles real-time use.
This module is for server-side batch processing and model training pipelines.
"""

import cv2
import mediapipe as mp
import numpy as np


class HandDetector:
    def __init__(self, max_hands=2, detection_confidence=0.5):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=True,
            max_num_hands=max_hands,
            min_detection_confidence=detection_confidence,
        )

    def detect_from_image(self, image_path: str) -> list[list[dict]]:
        image = cv2.imread(image_path)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.hands.process(image_rgb)

        if not results.multi_hand_landmarks:
            return []

        all_hands = []
        for hand_landmarks in results.multi_hand_landmarks:
            hand = [
                {"x": lm.x, "y": lm.y, "z": lm.z}
                for lm in hand_landmarks.landmark
            ]
            all_hands.append(hand)
        return all_hands

    def detect_from_frame(self, frame: np.ndarray) -> list[list[dict]]:
        results = self.hands.process(frame)

        if not results.multi_hand_landmarks:
            return []

        all_hands = []
        for hand_landmarks in results.multi_hand_landmarks:
            hand = [
                {"x": lm.x, "y": lm.y, "z": lm.z}
                for lm in hand_landmarks.landmark
            ]
            all_hands.append(hand)
        return all_hands

    def close(self):
        self.hands.close()
