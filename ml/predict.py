"""
Run inference with the trained model and store the prediction in Supabase.

Usage:
    python predict.py --tank_id <UUID>

Required env vars:
    SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY
"""

import os
import json
import argparse
import numpy as np
import mindspore as ms
from mindspore import Tensor

from database import fetch_readings, store_prediction
from model import WaterLevelPredictor

CHECKPOINT_DIR = "./checkpoints"
CKPT_PATH      = os.path.join(CHECKPOINT_DIR, "model.ckpt")
NORM_PATH      = os.path.join(CHECKPOINT_DIR, "norm.json")


# ---------------------------------------------------------------------------
# Normalization helpers (inverse of what train.py does)
# ---------------------------------------------------------------------------

def load_norm_params() -> dict:
    if not os.path.exists(NORM_PATH):
        raise FileNotFoundError(
            f"Norm params not found at {NORM_PATH}. Run train.py first."
        )
    with open(NORM_PATH) as f:
        return json.load(f)


def normalize_input(features: np.ndarray, params: dict) -> np.ndarray:
    x_min = np.array(params["x_min"], dtype=np.float32)
    x_max = np.array(params["x_max"], dtype=np.float32)
    return (features - x_min) / (x_max - x_min + 1e-8)


def denormalize_output(value: float, params: dict) -> float:
    return value * (params["y_max"] - params["y_min"]) + params["y_min"]


# ---------------------------------------------------------------------------
# Prediction
# ---------------------------------------------------------------------------

def predict(tank_id: str):
    if not os.path.exists(CKPT_PATH):
        raise FileNotFoundError(
            f"Checkpoint not found at {CKPT_PATH}. Run train.py first."
        )

    norm_params = load_norm_params()

    print(f"[predict] Fetching latest reading for tank {tank_id} ...")
    readings = fetch_readings(tank_id)

    if not readings:
        print("[predict] No readings found for this tank. Aborting.")
        return

    latest = readings[-1]
    features = np.array(
        [[
            float(latest["temperature"]),
            float(latest["ph"]),
            float(latest["water_level_percent"]),
        ]],
        dtype=np.float32,
    )

    features_norm = normalize_input(features, norm_params)

    # Load model
    net = WaterLevelPredictor()
    param_dict = ms.load_checkpoint(CKPT_PATH)
    ms.load_param_into_net(net, param_dict)
    net.set_train(False)

    # Inference
    output = net(Tensor(features_norm))
    predicted_norm  = float(output.asnumpy()[0][0])
    predicted_level = denormalize_output(predicted_norm, norm_params)
    predicted_level = max(0.0, min(100.0, predicted_level))   # clamp to valid range

    print(f"[predict] Current water level : {latest['water_level_percent']}%")
    print(f"[predict] Predicted next level : {predicted_level:.2f}%")

    store_prediction(tank_id, predicted_level)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict next water level")
    parser.add_argument("--tank_id", required=True, help="Tank UUID")
    args = parser.parse_args()

    predict(args.tank_id)
