from supabase import create_client, Client
import os

# Supabase config
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://hhjdpfbuikpmjenchdcq.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoamRwZmJ1aWtwbWplbmNoZGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzEzMzUwNiwiZXhwIjoyMDQ4NzA5NTA2fQ.qXcVgULba3lrp-IDkQndho8kzDMRiw2G-_gt9iI6KIc')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def reset_usage():
    try:
        supabase.table('Judge0Tokens').update({'usage': 0}).execute()
        print("Successfully reset all usage counts")
    except Exception as e:
        print(f"Error resetting usage counts: {str(e)}")

if __name__ == "__main__":
    reset_usage()