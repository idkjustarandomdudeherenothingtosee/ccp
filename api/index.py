import json
import random
import os

def handler(event, context):
    # Load facts.json (assumes file is next to this script)
    current_dir = os.path.dirname(__file__)
    facts_path = os.path.join(current_dir, "facts.json")
    with open(facts_path, "r") as f:
        facts = json.load(f)

    fact = random.choice(facts)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({"fact": fact})
    }
