import os
import google.generativeai as genai
from google.generativeai import caching
import datetime
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the API key from the .env file
api_key = os.getenv('GEMINI_API_KEY')

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-1.5-flash")

# Create a detailed context for the image
context_prompt = """
This image shows a coding problem or technical question that requires analysis and solution. 
The image will serve as our primary reference point for the following discussion.

Key points to consider:
1. This is a programming challenge that needs to be solved step by step
2. The image contains important details about the problem requirements and constraints
3. We'll need to carefully analyze the code or problem statement shown
4. Any solution provided should address all aspects visible in the image
5. Consider best practices and optimization opportunities in the solution

For all subsequent interactions:
- Focus on providing detailed explanations of the solution approach
- Reference specific parts of the image when discussing the problem
- Consider edge cases and potential limitations
- Suggest improvements or alternative approaches when applicable
- Provide code examples that directly relate to the problem shown

The goal is to provide comprehensive assistance in understanding and solving this programming challenge while maintaining context throughout our interaction.

Please analyze the image and provide guidance based on these parameters.
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

response = model.generate_content([
    context_prompt,
    "What type of data structure would be most efficient for solving this coding problem?",
    image_file
])

print(response.text)