from dotenv import load_dotenv
import os
from openai import OpenAI

# Simplify path resolution
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '.env')

# Load environment variables
load_dotenv(env_path)

# Get API key
api_key = os.getenv('OPENAI_API_KEY')

if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Initialize OpenAI client
openai_client = OpenAI(
    api_key=api_key
)

def query(prompt):
    messages = [
        {"role": "user", "content": prompt},
    ]
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=messages,
    )
    return response.choices[0].message.content
