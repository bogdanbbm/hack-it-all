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
                                        the user should give you the scenarios and the html of the site. You should only return the expected Playwright testing code."""},
                {"role": "user", "content": prompt}
            ],
            stream=True
        )

        print(stream)
        print(type(stream))

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
    input_list = config.get("user_input", [])

    if not input_list or not isinstance(input_list, list):
        return "Invalid input provided. Please provide a valid user_input list."

    # Combine HTML and commands from all inputs
    combined_html = "\n\n".join([item.get("html", "") for item in input_list])
    combined_user_prompt = "\n".join([item.get("prompt", "") for item in input_list])

    # Base example for the Playwright script
    base_example = """
    import re
    from playwright.sync_api import Playwright, sync_playwright, expect

    def run(playwright: Playwright) -> None:
        browser = playwright.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        page.goto("http://localhost:3000/")
        page.get_by_placeholder(...).click()
        page.get_by_placeholder(...).fill(...)
        page.get_by_placeholder("Password").click()
        page.get_by_placeholder("Password").fill("")
        page.get_by_role("button", name="...").click()
        page.page.get_by_test_id("...").click()

        # ---------------------
        context.close()
        browser.close()

    with sync_playwright() as playwright:
        run(playwright)
    """

    # Generate a detailed prompt combining all inputs
    prompt = f"""
    Based on the combined commands and HTML structures provided, generate a Python Playwright testing code for the local webpage at http://localhost:3000.

    Combined User Commands:
    {combined_user_prompt}

    Combined HTML Structures:
    {combined_html}

    The script should follow  and adapt the selectors (placeholders, roles, or ids) based on the combined HTML structures provided.
    You should use page.get_by_placeholder, page.get_by_role, or other relevant methods to interact with the elements and the execute fill or click actions.
    {base_example}
    """
    return prompt


@app.route('/api/convert-playwright', methods=['POST'])
@cross_origin(origin="*", headers=['Content-Type'])
def convert_playwright_to_json():
    """
    Endpoint to convert a Playwright script and HTML into actionable JSON.
    """
    try:
        # Get the JSON payload from the request
        data = request.json
        if not data or 'playwright_input' not in data or 'html_content' not in data:
            return jsonify({"error": "Missing 'playwright_input' or 'html_content' in request body"}), 400

        playwright_input = data['playwright_input']
        html_content = data['html_content']

        # Generate the prompt for OpenAI
        generated_actions = create_conversion_prompt(playwright_input, html_content)


        return Response(generated_actions, mimetype='application/json')

    except Exception as e:
        print(f"Error: {e}")  # Log for debugging
        return jsonify({"error": str(e)}), 500


def create_conversion_prompt(playwright_input: str, html_content: str) -> str:
    """
    Constructs the prompt for OpenAI to convert a Playwright script and HTML into JSON actions.
    """
    prompt = f"""
    I have a Playwright test script and corresponding HTML structure. Your task is to analyze them and convert the script into a JSON array where each action is represented with the action type, element ID, and additional text or properties if applicable.

    Playwright Script:
    {playwright_input}

    HTML Structure:
    {html_content}

    Instructions:
    - Identify all interactive elements (e.g., input fields, buttons).
    - For "fill" actions, include the `action: "set-input"`, the `id`, and the `text` being input.
    - For "click" actions, include the `action: "click"` and the `id`.
    - Ensure that the actions are only for "set-input" and "click" actions. Ignore other actions.
    - Base your element selection on IDs first, and use placeholders or roles if IDs are missing.
    - Return the output as a well-structured JSON array.
    

    Playwright Script Example:
        import re
        from playwright.sync_api import Playwright, sync_playwright, expect

        def run(playwright: Playwright) -> None:
            browser = playwright.chromium.launch(headless=False)
            context = browser.new_context()
            page = context.new_page()
            
            page.goto("http://localhost:3000/")
            
            page.get_by_placeholder(...).click()
            page.get_by_placeholder(...).fill(...)
            page.get_by_placeholder("Password").click()
            page.get_by_placeholder("Password").fill("")
            page.get_by_role("button", name="...").click()
            
            # Accept/Reject cookies 
            page.get_by_role(..., name="...").click()
            # ---------------------
            context.close()
            browser.close()

        with sync_playwright() as playwright:
            run(playwright)

    HTML Example:
        <div className='flex flex-col h-screen justify-center items-center'>

        <div className='text-2xl font-bold mb-8'>
            Awesome App
        </div>

        <label className="input input-bordered flex items-center gap-2 mb-3">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input id='input-username' type="text" className="grow" placeholder="Username" />
        </label>
        <label className="input input-bordered flex items-center gap-2 mb-8">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd" />
            </svg>
            <input id='input-password' type="password" placeholder="Password" className="grow" />
        </label>
        <button id='button-login' className="btn btn-primary w-32 text-lg" onClick={'() => handleLogin()'}>Login</button>
    </div>

    Output Example:
    [
        {{"action": "set-input", "id": "input-username", "text": "test"}},
        {{"action": "set-input", "id": "input-password", "text": "test"}},
        {{"action": "click", "id": "button-login"}}
    ]
    """

    stream = client.chat.completions.create(
            model="gpt-4o-mini",  # Ensure you are using a capable model
            messages=[
                {"role": "system", "content": "You are an assistant for converting Playwright scripts into actionable JSON commands."},
                {"role": "user", "content": prompt}
            ],
            stream=True
        )

#     ChatCompletion(id='chatcmpl-AbzpIV7oudVQt6Hoqofs375neFSew', choices=[Choice(finish_reason='stop', index=0, logprobs=None, message=ChatCompletionMessage(content='```json\n[\n    {\n        "action": "set-input",\n        "id": "input-username",\n        "text": "test"\n    },\n    {\n        "action": "set-input",\n        "id": "input-password",\n        "text": "test"\n    },\n    {\n        "action": "click",\n        "id": "button-login"\n    }\n]\n```', refusal=None, role='assistant', audio=None, function_call=None, tool_calls=None))], created=1733619160, model='gpt-4o-mini-2024-07-18', object='chat.completion', service_tier=None, system_fingerprint='fp_bba3c8e70b', usage=CompletionUsage(completion_tokens=80, prompt_tokens=1844, total_tokens=1924, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=0, audio_tokens=0, reasoning_tokens=0, rejected_prediction_tokens=0), prompt_tokens_details=PromptTokensDetails(audio_tokens=0, cached_tokens=0)))
# <class 'openai.types.chat.chat_completion.ChatCompletion'>
# Error: 'tuple' object has no attribute 'choices'

    generated_actions = ""
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            generated_actions += chunk.choices[0].delta.content

    return generated_actions



if __name__ == "__main__":
    app.run(debug=True)
