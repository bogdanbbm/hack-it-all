import os
from flask import Flask, request, jsonify
from openai import OpenAI
try:
    from credentials import API_KEY
except:
    API_KEY = os.environ.get("OpenAiKey")
app = Flask(__name__)


client = OpenAI(api_key=API_KEY)


@app.route('/generate_code', methods=['POST'])
def generate_code():
    try:
        # Get JSON payload from the frontend
        pipeline_config = request.json

        # Generate the prompt for ChatGPT
        prompt = create_prompt(pipeline_config)

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
    website = config.get("website")
    button = config.get("button")
    entry = config.get("entry")
    expected_result = config.get("expected_result")

    prompt = f"""
        Generate a Python script using Playwright that performs the following steps:
        1. Navigate to the website: {website}.
        2. Click on the button named: "{button}".
        3. Enter the text "{entry}" in the search box and submit.
        4. Verify that the first search result has the title: "{expected_result}".

        The script should include proper assertions and handle any cookie consent banners.
        """
    return prompt


if __name__ == "__main__":
    app.run(debug=True)
