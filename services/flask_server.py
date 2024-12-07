import os
from flask import Flask, request, jsonify, Response
from openai import OpenAI
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

try:
    from credentials import API_KEY
except:
    API_KEY = os.environ.get("OpenAiKey")
app = Flask(__name__)


client = OpenAI(api_key=API_KEY)


# API endpoint to retrieve the prompt and pass it to the function
@app.route('/api/prompt', methods=['POST', 'OPTIONS'])
@cross_origin(origin="*", headers=['Content-Type'])
def handle_prompt():
    try:
        # Get JSON data from the POST request
        data = request.json
        if not data or 'user_input' not in data:
            return jsonify({"error": "Missing 'user_input' in request body"}), 400

        # Generate the test code
        generated_code = generate_test_code(data)

        # Return the generated code as plain text
        return Response(generated_code, mimetype='text/plain')

    except Exception as e:
        print(f"Error: {e}")  # Log the error for debugging
        return jsonify({"error": str(e)}), 500


def generate_test_code(user_input: dict) -> str:
    try:
        # Generate the prompt for ChatGPT
        prompt = create_prompt(user_input)

        # Call the OpenAI API using the new method
        stream = client.chat.completions.create(
            model="gpt-4o-mini",  # Update the model if needed
            messages=[
                {"role": "system", "content": """You are a helpful assistant for generating Python Playwright scripts,
                                        the user should give you the right names for the buttons he wants to test"""},
                {"role": "user", "content": prompt}
            ],
            stream=True
        )

        # Collect the response stream
        generated_code = ""
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                generated_code += chunk.choices[0].delta.content

        # Return the raw generated code (string)
        return generated_code

    except Exception as e:
        # Raise the exception to let the calling function handle it
        raise Exception(f"Error generating test code: {str(e)}")


def create_prompt(config):

    input_list = config.get("user_input")
    prompt = f"Based on the commands in {input_list}, generate the testing code for our local webpage found at localhost:3000,"\
    """here is an example of how the code should look like:
    import re
    from playwright.sync_api import Playwright, sync_playwright, expect

    def run(playwright: Playwright) -> None:
        browser = playwright.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        page.goto("http://localhost:3000/")
        page.get_by_placeholder("Username").click()
        page.get_by_placeholder("Username").fill("test")
        page.get_by_placeholder("Password").click()
        page.get_by_placeholder("Password").fill("test")
        page.get_by_role("button", name="Login").click()
        page.locator("#button-add-shoes1").click()
        page.get_by_role("button", name="1").click()
        page.get_by_role("button", name="View cart").click()

        # ---------------------
        context.close()
        browser.close()


    with sync_playwright() as playwright:
        run(playwright)
    """
    return prompt


if __name__ == "__main__":
    app.run(debug=True)
