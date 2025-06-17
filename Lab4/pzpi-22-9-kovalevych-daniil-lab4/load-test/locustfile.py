from locust import HttpUser, task, between

class AuthUser(HttpUser):
    wait_time = between(1, 2)
    token = None

    def on_start(self):
        # Авторизація з бази: admin/admin123
        credentials = {
            "username": "admin",
            "password": "admin123"
        }
        response = self.client.post("/login", json=credentials)

        if response.status_code == 200 and "token" in response.json():
            self.token = response.json()["token"]
        else:
            print("Login failed:", response.status_code, response.text)

    @task
    def get_vehicles(self):
        if self.token:
            self.client.get("/vehicles", headers={"Authorization": f"Bearer {self.token}"})