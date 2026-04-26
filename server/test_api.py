import requests
import json

url = "http://localhost:5000/api/auth/login"
headers = {"Content-Type": "application/json"}

def test_login(email, password):
    payload = {"email": email, "password": password}
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Testing {email} with password {password}")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

test_login("aman@student.edu", "student123")
test_login("aman@student.edu", "wrongpass")
