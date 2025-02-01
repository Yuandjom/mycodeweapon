from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Supabase config
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

SUPABASE_RATE_LIMIT_TABLE = "judge0tokens"

def reset_usage():
    try:
        supabase.table(SUPABASE_RATE_LIMIT_TABLE).update({'usage': 0}).execute()
        print("Successfully reset all usage counts")
    except Exception as e:
        print(f"Error resetting usage counts: {str(e)}")

if __name__ == "__main__":
    reset_usage()