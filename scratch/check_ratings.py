
import requests

BASE_URL = "http://localhost:8080/api"
LOGIN_URL = f"{BASE_URL}/auth/login"
RATINGS_URL = f"{BASE_URL}/ratings"

def check_ratings():
    # Attempt login
    login_data = {
        "email": "admin@sunline.com",
        "password": "Admin@123!"
    }
    
    try:
        response = requests.post(LOGIN_URL, json=login_data)
        if response.status_code != 200:
            print(f"Login failed: {response.status_code}")
            return
        
        token = response.json().get("token")
        if not token:
            print("No token received")
            return
        
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get ratings
        response = requests.get(RATINGS_URL, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch ratings: {response.status_code}")
            return
        
        ratings = response.json()
        print(f"Found {len(ratings)} ratings.")
        for r in ratings:
            print(f"- User: {r.get('userName')}, Stars: {r.get('stars')}, Comment: {r.get('comment')}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_ratings()
