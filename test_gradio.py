import sys
import json
import urllib.request
import urllib.error

url = "https://wuthichaics01-ai-email-assistant.hf.space/"

def test_endpoint(path, payload):
    full_url = f"{url}{path}"
    print(f"\n--- Testing {full_url} ---")
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        full_url, 
        data=data, 
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            result = response.read().decode('utf-8')
            print(f"Status: {response.status}")
            print(f"Response: {result[:200]}")
            return True
    except urllib.error.HTTPError as e:
        print(f"Status: {e.code}")
        print(f"Error: {e.read().decode('utf-8')[:200]}")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

# Test Gradio 4.x endpoints
test_endpoint("/call/predict", {"data": ["Hello world"]})
test_endpoint("/call/generate", {"data": ["Hello world"]})
test_endpoint("/api/v1/predict", {"data": ["Hello world"]})
