import json
import random
from flask import Flask, jsonify

app = Flask(__name__)

# Load facts once at startup
with open("facts.json", "r") as f:
    facts = json.load(f)

@app.route("/api/random-fact")
def random_fact():
    fact = random.choice(facts)
    return jsonify({"fact": fact})

# This line is needed if you want to test locally
if __name__ == "__main__":
    app.run()
