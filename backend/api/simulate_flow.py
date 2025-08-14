import requests

BASE_URL = "http://localhost:5000"

def simulate_device_data():
    print("\n[1] Getting simulated device data...")
    resp = requests.get(f"{BASE_URL}/devices/simulate")
    resp.raise_for_status()
    data = resp.json()
    
    print("Simulated Device Data:", data)
    return data

def log_emission(data):
    print("\n[2] Logging emission to backend...")
    resp = requests.post(f"{BASE_URL}/emissions/", json=data)
    resp.raise_for_status()
    log_data = resp.json()
    print("Logged Emission:", log_data)
    return log_data

def fetch_emissions():
    print("\n[3] Fetching all emissions...")
    resp = requests.get(f"{BASE_URL}/emissions/")
    resp.raise_for_status()
    emissions = resp.json()
    print("All Emissions:", emissions)
    return emissions

def generate_credit(emission_id):
    print(f"\n[4] Generating carbon credit for emission {emission_id}...")
    resp = requests.post(f"{BASE_URL}/credits/{emission_id}")
    resp.raise_for_status()
    credit = resp.json()
    print("Generated Credit:", credit)
    return credit

if __name__ == "__main__":
    device_data = simulate_device_data()

    # Adjust keys to match emission POST schema
    emission_payload = {
        "device_id": device_data["device_id"],
        "fuel_type": device_data["fuel_type"],
        "fuel_amount": device_data["fuel_amount"]
    }

    log = log_emission(emission_payload)
    fetch_emissions()
    generate_credit(log["id"])
