import sys
import json

def process_data(data):
    # Replace this with your actual data processing logic
    result = {"status": "success", "data": data}
    return result

if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    output_data = process_data(input_data)
    print(json.dumps(output_data))
