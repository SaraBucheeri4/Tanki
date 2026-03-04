import os
from supabase import create_client, Client

# Note: actual table in Supabase is "tank_readings", not "sensor_readings"
TABLE_READINGS   = "tank_readings"
TABLE_PREDICTIONS = "predictions"


def get_client() -> Client:
    url = os.environ["SUPABASE_URL"]
    key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    return create_client(url, key)


def fetch_readings(tank_id: str) -> list[dict]:
    """Return all readings for a tank ordered oldest → newest."""
    client = get_client()
    response = (
        client.table(TABLE_READINGS)
        .select("temperature, ph, water_level_percent, created_at")
        .eq("tank_id", tank_id)
        .order("created_at", desc=False)
        .execute()
    )
    return response.data


def store_prediction(tank_id: str, predicted_level: float) -> None:
    """Insert a new prediction row. Never touches tank_readings."""
    client = get_client()
    client.table(TABLE_PREDICTIONS).insert(
        {
            "tank_id": tank_id,
            "predicted_level": round(float(predicted_level), 4),
        }
    ).execute()
    print(f"[db] Stored prediction {predicted_level:.2f}% for tank {tank_id}")
