import os
from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will allow requests from any domain. Adjust as needed for production.

try:
    from credentials import API_KEY
except:
    API_KEY = os.environ.get("OpenAiKey")
app = Flask(__name__)


client = OpenAI(api_key=API_KEY)


# API endpoint to retrieve the prompt and pass it to the function
@app.route('/api/prompt', methods=['POST'])
def handle_prompt():
    try:
        data = request.json  # Get JSON data from the POST request
        if not data or 'user_input' not in data:
            return jsonify({"error": "Missing 'user_input' in request body"}), 400

        generated_code = generate_test_code(data)  # generate prompt for test script

        # Return the result and proposed test method
        return jsonify({"generated_test_code": generated_code})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def generate_test_code(user_input: dict):
    try:
        # Generate the prompt for ChatGPT
        prompt = create_prompt(user_input)

        # Call the OpenAI API using the new method
        stream = client.chat.completions.create(
            model="gpt-4o-mini",  # Update the model if needed
            messages=[
                {"role": "system", "content": "You are a helpful assistant for generating Python Playwright scripts."},
                {"role": "user", "content": prompt}
            ],
            stream=True
        )

        # Collect the response stream
        generated_code = ""
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                generated_code += chunk.choices[0].delta.content

        return jsonify({"generated_code": generated_code})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def create_prompt(config):
    """
    Create a natural language prompt for ChatGPT to generate Playwright code.
    """
    user_instructions = config.get("user_input")

    prompt = f"""
        Your task is to generate a Python script that uses Playwright library to perform certain test steps on a web application. 
        The instructions of each step will be written either on a new line or separated by the "." symbol. 
        The script should include proper assertions and handle any cookie consent banners. Here are the instructions:
        """
    prompt = prompt + "\n" + user_instructions

    return prompt


if __name__ == "__main__":
    app.run(debug=True)
