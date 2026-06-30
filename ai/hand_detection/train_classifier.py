"""
Training script for hand sign classifier.
Trains a simple neural network on collected landmark data.

Usage:
    python train_classifier.py --data ../../datasets/hand_signs/ --epochs 50
"""

import argparse
import json
import os

import numpy as np

try:
    import tensorflow as tf
    from tensorflow import keras
    HAS_TF = True
except ImportError:
    HAS_TF = False
    print("TensorFlow not installed. Install with: pip install tensorflow")


def load_dataset(data_dir):
    X, y = [], []
    label_map = {}
    label_idx = 0

    for filename in sorted(os.listdir(data_dir)):
        if not filename.endswith(".json"):
            continue

        label = filename.replace(".json", "")
        if label not in label_map:
            label_map[label] = label_idx
            label_idx += 1

        filepath = os.path.join(data_dir, filename)
        with open(filepath) as f:
            samples = json.load(f)

        for sample in samples:
            landmarks = sample["landmarks"]
            features = []
            for lm in landmarks:
                features.extend([lm["x"], lm["y"], lm["z"]])
            X.append(features)
            y.append(label_map[label])

    return np.array(X, dtype=np.float32), np.array(y), label_map


def build_model(input_dim, num_classes):
    model = keras.Sequential([
        keras.layers.Input(shape=(input_dim,)),
        keras.layers.Dense(128, activation="relu"),
        keras.layers.Dropout(0.3),
        keras.layers.Dense(64, activation="relu"),
        keras.layers.Dropout(0.3),
        keras.layers.Dense(32, activation="relu"),
        keras.layers.Dense(num_classes, activation="softmax"),
    ])
    model.compile(
        optimizer="adam",
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def train(data_dir, epochs, output_dir):
    if not HAS_TF:
        print("Cannot train without TensorFlow. Exiting.")
        return

    print(f"Loading data from {data_dir}...")
    X, y, label_map = load_dataset(data_dir)

    if len(X) == 0:
        print("No data found. Run collect_data.py first.")
        return

    print(f"Loaded {len(X)} samples across {len(label_map)} classes")
    print(f"Classes: {label_map}\n")

    indices = np.random.permutation(len(X))
    split = int(0.8 * len(X))
    X_train, X_test = X[indices[:split]], X[indices[split:]]
    y_train, y_test = y[indices[:split]], y[indices[split:]]

    model = build_model(X.shape[1], len(label_map))
    model.summary()

    model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=epochs,
        batch_size=32,
        verbose=1,
    )

    loss, acc = model.evaluate(X_test, y_test, verbose=0)
    print(f"\nTest accuracy: {acc:.4f}")

    os.makedirs(output_dir, exist_ok=True)
    model_path = os.path.join(output_dir, "hand_sign_classifier.keras")
    model.save(model_path)

    label_map_path = os.path.join(output_dir, "label_map.json")
    with open(label_map_path, "w") as f:
        json.dump(label_map, f, indent=2)

    print(f"Model saved to {model_path}")
    print(f"Label map saved to {label_map_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train hand sign classifier")
    parser.add_argument("--data", default="../../datasets/hand_signs/", help="Data directory")
    parser.add_argument("--epochs", type=int, default=50, help="Training epochs")
    parser.add_argument("--output", default="../../trained_models/", help="Output directory")
    args = parser.parse_args()
    train(args.data, args.epochs, args.output)
