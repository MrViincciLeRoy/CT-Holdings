from flask import Flask, request, jsonify
import requests, os

app = Flask(__name__)

HF_TOKEN = os.environ.get("HF_TOKEN")
HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.1"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    prompt = data.get("prompt", "")

    res = requests.post(
        f"https://api-inference.huggingface.co/models/{HF_MODEL}",
        headers={"Authorization": f"Bearer {HF_TOKEN}"},
        json={
            "inputs": prompt,
            "parameters": {"max_new_tokens": 300, "temperature": 0.5, "return_full_text": False},
        },
    )
    return jsonify(res.json())

if __name__ == "__main__":
    app.run()
