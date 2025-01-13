import os
import google.generativeai as genai
from google.generativeai import caching
import datetime
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the API key from the .env file
API_KEY = os.getenv('GEMINI_API_KEY')

# Configure generation parameters
GENERATION_CONFIG = {
    "temperature": 0.3,  
    "top_p": 0.8,
    "top_k": 40,
    "max_output_tokens": 2048,
    "candidate_count": 1,
    "stop_sequences": []
}

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")

# Create a detailed context for the image
context_prompt = """
This image shows a coding problem or technical question submitted by a user. 
The image will serve as the primary reference point.

Key points to consider:
1. This is a programming challenge that needs to be solved by code
2. The image should contain important details about the problem requirements and constraints
3. Carefully analyze the code, problem statement and constraints if any shown
4. Any reply provided should address all aspects of the question and the user's prompt in a technical way
5. Consider best practices and optimization opportunities in the solution
6. Do not provide the complete solution unless explicitly requested by the user's prompt

For all subsequent interactions:
- Reference specific parts of the image when discussing the problem
- Consider edge cases and potential limitations
- Suggest improvements or alternative approaches when applicable
- Provide code examples that directly relate to the problem shown only if explicitly requested by the user's prompt

The goal is to provide comprehensive assistance in understanding and solving this programming challenge without spoonfeeeding the answer/solution to the user unless explicitly request by the user.

Please analyze the image and provide guidance based on the user prompt in a concise manner.
"""

# Upload the image using the Files API
image_file = genai.upload_file(path="CodeQues1.png")

# # Create a cache with the uploaded image
# cache = caching.CachedContent.create(
#     model='models/gemini-1.5-flash-001',
#     display_name='test image',
#     system_instruction=(
#         'You are an expert image analyzer. Answer questions about the image you '
#         'have access to, including objects, colors, and context.'
#     ),
#     contents=[image_file, context_prompt],
#     ttl=datetime.timedelta(minutes=30),
# )

# # Construct a GenerativeModel which uses the created cache.
# model = genai.GenerativeModel.from_cached_content(cached_content=cache)

# # Query the model
# response = model.generate_content("Introduce to what type of data structure would I be expected to solve this coding problem efficiently")



# Apply to your generate_content call
response = model.generate_content(
    [context_prompt, image_file, "User Prompt:", "What are possible data structures I can use to solve this problem?"],
    generation_config=GENERATION_CONFIG
)

print(response.text)