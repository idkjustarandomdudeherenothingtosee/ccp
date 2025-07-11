import json
import random
import os
import sys
import traceback

def handler(event, context):
    try:
        current_dir = os.path.dirname(__file__)
        facts_path = os.path.join(current_dir, "facts.json")
        
        with open(facts_path, "r") as f:
            facts = json.load(f)
            
        fact = random.choice(facts)
        
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"fact": fact})
        }
    except Exception as e:
        # Log the full traceback for debugging in Vercel logs
        traceback.print_exc(file=sys.stderr)
        
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Internal server error"})
        }
