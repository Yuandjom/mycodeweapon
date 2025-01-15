from supabase import create_client, Client
import os
from dotenv import load_dotenv

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def reset_usage():
    try:
        supabase.table('Judge0Tokens').update({'usage': 0}).execute()
        print("Successfully reset all usage counts")
    except Exception as e:
        print(f"Error resetting usage counts: {str(e)}")

if __name__ == "__main__":
    reset_usage()