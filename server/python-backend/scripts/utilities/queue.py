from collections import deque
import datetime

class ChargingQueue:
    def __init__(self):
        self.queue = deque()

    def enqueue(self, vehicle):
        if vehicle not in self.queue:
            self.queue.append(vehicle)

    def dequeue(self):
        return self.queue.popleft()
    
    def remove(self, vehicle):
        if vehicle in self.queue:
            self.queue.remove(vehicle)

def assign_charging_stations(vehicles, stations, charging_queue, current_time):
    """
    Assign charging stations to vehicles based on their state of charge (soc)
    and stay duration. If soc < 50, assign L3 stations for short stay vehicles
    and L2 stations for long stay vehicles. If soc >= 20, assign L2 stations.
    If no available station, add to the charging queue.
    """
    for vehicle in vehicles:
        charging_request = check_charging_request(vehicle, current_time)
        print(f"Vehicle {vehicle.vehicle_id}: Charging Request = {charging_request}, SoC = {vehicle.soc}, Location = {vehicle.location}, Home Charging = {vehicle.home_charging}")
        if vehicle.location == 'On-Site':
            if charging_request and vehicle.charging_station is None:
                # Prioritize L3 for vehicles with short stay
                if vehicle.vehicle_catagory in ['Heavy-Duty']: # assuming high priority for heavy-duty vehicles
                    assign_to_station(vehicle, stations, charging_queue, preferred_type='L3')
                else:
                    assign_to_station(vehicle, stations, charging_queue, preferred_type='L2')
        elif vehicle.location == 'Home':
            # If vehicle is at home, assign L2 station
            if charging_request and vehicle.home_charging in ['Level 1', 'Level 2']:
                vehicle.vehicle_status = 'Charging' # Set vehicle status to "Charging"
        else:
            # If vehicle is not on-site, release the charging station from the queue
            if vehicle.charging_station:
                vehicle.charging_station.is_available = True
                vehicle.charging_station = None
    return # No need to assign charging station

def check_charging_request(vehicle, current_time):
    """
    Check if the vehicle needs to charge based on the current time and soc.
    """
    next_day = (current_time + datetime.timedelta(days=1)).strftime("%A")
    for daily_trip in vehicle.daily_travel_patterns:
        if daily_trip["day of week"] == next_day:
            try:
                required_soc = daily_trip["equivalent electricity kWh"] / vehicle.battery_capacity * 100
            except KeyError as e:
                # Handle missing data in daily_trip
                print(f"Missing key in daily_trip data: {e}")
                required_soc = 0
    # Check if the vehicle needs to charge
    if (vehicle.soc) < 50 or (vehicle.soc - required_soc) < 15:
        return True
    else:
        return False

def assign_to_station(vehicle, stations, charging_queue, preferred_type):
    """
    Assign vehicle to the preferred charging station type if available.
    If not available, assign to the first available station.
    If no available station, add to the charging queue.
    """
    preferred_stations = [station for station in stations if station.station_type == preferred_type and station.is_available]
    if preferred_stations:
        vehicle.charging_station = preferred_stations[0]
        vehicle.vehicle_status = 'Charging'
        preferred_stations[0].is_available = False
    else:
        # If preferred station type is not available
        available_stations = [station for station in stations if station.is_available]
        if available_stations:
            vehicle.charging_station = available_stations[0]
            vehicle.vehicle_status = 'Charging'
            available_stations[0].is_available = False
        else:
            # If no available station, add to the charging queue
            charging_queue.enqueue(vehicle)
            vehicle.vehicle_status = 'Waiting for station'
    return

def update_charging_queue(charging_queue, stations):
    while charging_queue.queue and any(station.is_available for station in stations):
        vehicle = charging_queue.dequeue()
        assign_to_station(vehicle, stations, charging_queue, preferred_type='L2')
