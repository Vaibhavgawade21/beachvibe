import os

from dotenv import load_dotenv

load_dotenv()

AUDIUS_API_URL = os.getenv("AUDIUS_API_URL", "https://api.audius.co").rstrip("/")
AUDIUS_API_KEY = os.getenv("AUDIUS_API_KEY", "")
APP_NAME = os.getenv("APP_NAME", "beachvibe")
CORS_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173"
    ).split(",")
    if o.strip()
]
