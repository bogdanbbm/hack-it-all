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

        return jsonify({"generated_code": generated_code})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def create_prompt(input_list):
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
