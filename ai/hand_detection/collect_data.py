"""
Data collection script for hand sign training.
Captures hand landmarks from webcam and saves labeled data.

Usage:
    python collect_data.py --label A --samples 100 --output ../datasets/hand_signs/
"""

import argparse
import json
import os
import time

import cv2
import mediapipe as mp
import numpy as np

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils


def normalize_landmarks(landmarks):
    wrist = landmarks[0]
    normalized = []
    for lm in landmarks:
        normalized.append({
            "x": lm.x - wrist.x,
            "y": lm.y - wrist.y,
            "z": lm.z - wrist.z,
        })
    return normalized


def collect(label, num_samples, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, f"{label}.json")

    existing = []
    if os.path.exists(filepath):
        with open(filepath) as f:
            existing = json.load(f)

    cap = cv2.VideoCapture(0)
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.7,
    )

    samples = []
    print(f"Collecting '{label}' — show the sign and press SPACE to capture.")
    print(f"Target: {num_samples} samples. Press Q to quit.\n")

    while len(samples) < num_samples:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)

        if result.multi_hand_landmarks:
            for hand_landmarks in result.multi_hand_landmarks:
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

        cv2.putText(frame, f"Label: {label} | Collected: {len(samples)}/{num_samples}",
                     (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        cv2.imshow("Data Collection", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        elif key == ord(" ") and result.multi_hand_landmarks:
            landmarks = result.multi_hand_landmarks[0]
            normalized = normalize_landmarks(landmarks.landmark)
            samples.append({
                "label": label,
                "landmarks": normalized,
                "timestamp": time.time(),
            })
            print(f"  Captured {len(samples)}/{num_samples}")

    cap.release()
    cv2.destroyAllWindows()
    hands.close()

    all_samples = existing + samples
    with open(filepath, "w") as f:
        json.dump(all_samples, f, default=str)

    print(f"\nSaved {len(samples)} new samples ({len(all_samples)} total) to {filepath}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Collect hand sign data")
    parser.add_argument("--label", required=True, help="Sign label (e.g., A, B, HELLO)")
    parser.add_argument("--samples", type=int, default=100, help="Number of samples")
    parser.add_argument("--output", default="../../datasets/hand_signs/", help="Output directory")
    args = parser.parse_args()
    collect(args.label, args.samples, args.output)
