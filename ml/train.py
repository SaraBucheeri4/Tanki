"""
Train the WaterLevelPredictor model on historical tank readings.

Usage:
    python train.py --tank_id <UUID> [--epochs 100] [--batch_size 32] [--lr 0.001]

Required env vars:
    SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY
"""

import os
import json
import argparse
import numpy as np
import mindspore as ms
import mindspore.nn as nn
import mindspore.dataset as mds

from database import fetch_readings
from model import WaterLevelPredictor

MIN_READINGS  = 50
CHECKPOINT_DIR = "./checkpoints"
CKPT_PATH     = os.path.join(CHECKPOINT_DIR, "model.ckpt")
NORM_PATH     = os.path.join(CHECKPOINT_DIR, "norm.json")


# ---------------------------------------------------------------------------
# Data helpers
# ---------------------------------------------------------------------------

def prepare_data(readings: list[dict]):
    """
    Build supervised pairs:  features at t  →  water_level_percent at t+1.

    X shape: (N-1, 3)   columns: [temperature, ph, water_level_percent]
    y shape: (N-1, 1)   column : [water_level_percent at t+1]
    """
    rows = [
        (float(r["temperature"]), float(r["ph"]), float(r["water_level_percent"]))
        for r in readings
    ]
    X = np.array(rows[:-1], dtype=np.float32)
    y = np.array([row[2] for row in rows[1:]], dtype=np.float32).reshape(-1, 1)
    return X, y


def fit_normalize(X: np.ndarray, y: np.ndarray):
    """Min-max normalize X and y. Returns normalized arrays + saved params."""
    x_min = X.min(axis=0)
    x_max = X.max(axis=0)
    y_min = float(y.min())
    y_max = float(y.max())

    X_norm = (X - x_min) / (x_max - x_min + 1e-8)
    y_norm = (y - y_min) / (y_max - y_min + 1e-8)

    params = {
        "x_min": x_min.tolist(),
        "x_max": x_max.tolist(),
        "y_min": y_min,
        "y_max": y_max,
    }
    return X_norm, y_norm, params


# ---------------------------------------------------------------------------
# Training
# ---------------------------------------------------------------------------

def train(tank_id: str, epochs: int = 100, batch_size: int = 32, lr: float = 1e-3):
    print(f"[train] Fetching readings for tank {tank_id} ...")
    readings = fetch_readings(tank_id)

    if len(readings) < MIN_READINGS:
        print(
            f"[train] Only {len(readings)} readings found "
            f"(need at least {MIN_READINGS}). Aborting."
        )
        return

    print(f"[train] {len(readings)} readings. Building dataset ...")
    X, y = prepare_data(readings)
    X_norm, y_norm, norm_params = fit_normalize(X, y)

    os.makedirs(CHECKPOINT_DIR, exist_ok=True)
    with open(NORM_PATH, "w") as f:
        json.dump(norm_params, f, indent=2)
    print(f"[train] Norm params saved → {NORM_PATH}")

    dataset = (
        mds.NumpySlicesDataset({"data": X_norm, "label": y_norm}, shuffle=True)
        .batch(batch_size)
    )
    steps_per_epoch = dataset.get_dataset_size()

    # ------------------------------------------------------------------
    # Build / restore model
    # ------------------------------------------------------------------
    net = WaterLevelPredictor()

    if os.path.exists(CKPT_PATH):
        print(f"[train] Resuming from checkpoint: {CKPT_PATH}")
        param_dict = ms.load_checkpoint(CKPT_PATH)
        ms.load_param_into_net(net, param_dict)

    loss_fn   = nn.MSELoss()
    optimizer = nn.Adam(net.trainable_params(), learning_rate=lr)

    def forward_fn(data, label):
        return loss_fn(net(data), label)

    grad_fn = ms.value_and_grad(forward_fn, grad_position=None, weights=optimizer.parameters)

    # ------------------------------------------------------------------
    # Training loop
    # ------------------------------------------------------------------
    print(f"[train] Training {epochs} epochs × {steps_per_epoch} steps/epoch ...")
    net.set_train(True)

    for epoch in range(1, epochs + 1):
        epoch_loss = 0.0
        for batch in dataset.create_dict_iterator():
            loss, grads = grad_fn(batch["data"], batch["label"])
            optimizer(grads)
            epoch_loss += float(loss.asnumpy())

        avg_loss = epoch_loss / steps_per_epoch
        if epoch % 10 == 0 or epoch == 1:
            print(f"[train] Epoch {epoch:>4}/{epochs}  avg_loss={avg_loss:.6f}")

    ms.save_checkpoint(net, CKPT_PATH)
    print(f"[train] Checkpoint saved → {CKPT_PATH}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train water level predictor")
    parser.add_argument("--tank_id",    required=True,          help="Tank UUID")
    parser.add_argument("--epochs",     type=int,   default=100)
    parser.add_argument("--batch_size", type=int,   default=32)
    parser.add_argument("--lr",         type=float, default=1e-3)
    args = parser.parse_args()

    train(args.tank_id, args.epochs, args.batch_size, args.lr)
