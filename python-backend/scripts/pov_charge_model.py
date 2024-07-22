from collections import deque
from model import Vehicle, ChargingStation, generate_timeseries_activity, cancel_trip_activity
import random
import json
import datetime
import pandas as pd

class ChargingQueue:
    def __init__(self):
        self.queue = deque()

    def enqueue(self, vehicle):
        if vehicle not in self.queue:
            self.queue.append(vehicle)

    def dequeue(self):
        return self.queue.popleft()
    
    def remove(self, vehicle):
        return self.queue.remove(vehicle)

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

def update_charging_limit(pov_vehicles, charging_period_limit):
    for vehicle in pov_vehicles:
        if vehicle.location == 'On-Site' and vehicle.vehicle_status == 'Charging' and vehicle.status_duration >= charging_period_limit:
            vehicle.vehicle_status = 'Parked'  # Reset vehicle status to "Parked"
            vehicle.charging_station.is_available = True  # Release the charging station
            vehicle.charging_station = None  # Reset the charging station
    return

def release_all_stations(pov_vehicles, stations):
    for vehicle in pov_vehicles:
        vehicle.charging_station = None
        if vehicle.location == 'On-Site':
            vehicle.vehicle_status = 'Parked'
    for station in stations:
        station.is_available = True
    return

def update_vehicle_status(pov_vehicles, current_time, time_step, charging_queue):
    for vehicle in pov_vehicles:
        # Get the current activity type based on the current time
        vehicle_activity = vehicle.activities.loc[current_time.strftime('%H:%M')]["activity_type"]

        # Update vehicle status based on the current time
        if vehicle.location == 'Off-Site':
            vehicle.vehicle_status = vehicle_activity
            vehicle.charging_rate = None
            if vehicle in charging_queue.queue:
                charging_queue.remove(vehicle) # Remove the vehicle from the charging queue  
        elif vehicle.location == 'Home':
            if vehicle.vehicle_status == 'Parked':
                vehicle.charging_rate = None
            if vehicle in charging_queue.queue:
                charging_queue.remove(vehicle) # Remove the vehicle from the charging queue
        
        # Update vehicle status duration 
        if vehicle.vehicle_status == vehicle.previous_status:
            vehicle.status_duration += time_step
        else:
            vehicle.status_duration = 0
            vehicle.previous_status = vehicle.vehicle_status
    return

def update_vehicle_soc(pov_vehicles, time_step):
    # Update vehicle soc status based on the current time
    for vehicle in pov_vehicles:
        if vehicle.location == 'On-Site':
            if vehicle.vehicle_status == 'Charging' and vehicle.charging_station is not None:
                if vehicle.soc < 90:
                    vehicle.soc += vehicle.charging_station.maximum_power * time_step / 60 / vehicle.battery_capacity * 100
                    vehicle.charging_rate = vehicle.charging_station.maximum_power
                else:
                    vehicle.charging_rate = 0
            elif vehicle.vehicle_status == 'Waiting for station':
                vehicle.charging_rate = None
            else:
                vehicle.vehicle_status = 'Parked'
                vehicle.charging_rate = None
        elif vehicle.location == 'Off-Site':
            vehicle.charging_rate = None
            if vehicle.vehicle_status == 'Driving':
                vehicle.soc -= vehicle.equivalent_electricity_kwh_rate * time_step / 60 / vehicle.battery_capacity * 100
        elif vehicle.location == 'Home':
            if vehicle.vehicle_status == 'Charging' and vehicle.home_charging in ['Level 1', 'Level 2']:
                if vehicle.soc < 90:
                    if vehicle.home_charging == 'Level 2':
                        vehicle.charging_rate = 7.0
                    else:
                        vehicle.charging_rate = 1.5
                    # Update vehicle soc based on the charging rate
                    vehicle.soc += vehicle.charging_rate * time_step / 60 / vehicle.battery_capacity * 100
                else:
                    vehicle.charging_rate = 0
            else:
                vehicle.charging_rate = None
                vehicle.vehicle_status = 'Parked'
        else:
            vehicle.charging_rate = None
            vehicle.vehicle_status = 'Parked'
    return

def update_vehicle_status_duration(pov_vehicles, time_step):
    for vehicle in pov_vehicles:
        if vehicle.vehicle_status == vehicle.previous_status:
            vehicle.status_duration += time_step
        else:
            vehicle.status_duration = 0
            vehicle.previous_status = vehicle.vehicle_status
    return

def update_vehicle_trip_status(pov_vehicles, current_time, time_step):
    for vehicle in pov_vehicles:
        # Get the current activity type based on the current time
        vehicle_next_location = vehicle.activities.loc[(current_time + datetime.timedelta(minutes=time_step)).strftime('%H:%M')]["location"]
        # Estimate the remaining vehicle soc based on the equivalent electricity kWh
        estimated_remain_soc = vehicle.soc - vehicle.equivalent_electricity_kwh / vehicle.battery_capacity * 100
        if vehicle_next_location == 'Off-Site':
            if estimated_remain_soc < 15: # Set the remaining soc 15% to cancel the trip
                vehicle.activities = cancel_trip_activity()
                vehicle.trip_status = 'Cancelled'
            else:
                vehicle.trip_status = None

def update_vehicle_location(pov_vehicles, current_time):
    for vehicle in pov_vehicles:
        vehicle.location = vehicle.activities.loc[current_time.strftime('%H:%M')]["location"]
    return

def update_vehicle_activities(pov_vehicles, current_time):
    for vehicle in pov_vehicles:
        vehicle.trip_status = None
        for daily_trip in vehicle.daily_travel_patterns:
            if daily_trip["day of week"] == current_time.strftime("%A"):
                vehicle.activities = generate_timeseries_activity(daily_trip)
                vehicle.equivalent_electricity_kwh_rate = daily_trip["equivalent electricity consumption rate"]
                vehicle.equivalent_electricity_kwh = daily_trip["equivalent electricity kWh"]
                # vehicle.vehicle_status = vehicle.activities.loc[current_time.strftime('%H:%M')]["activity_type"]
    return

def initialize_vehicles(pov_vehicles):
    for vehicle in pov_vehicles:
        vehicle.soc = 80
        vehicle.trip_status = None
        vehicle.location = None
        vehicle.charging_station = None
        vehicle.previous_status = None
        vehicle.vehicle_status = None
        vehicle.trip_status = None
        vehicle.status_duration = 0
        vehicle.equivalent_electricity_kwh_rate = 0
        vehicle.equivalent_electricity_kwh = 0
    return

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
    # Reset the stay duration
    # vehicle.status_duration = 0
    return

def update_charging_queue(charging_queue, stations):
    while charging_queue.queue and any(station.is_available for station in stations):
        vehicle = charging_queue.dequeue()
        assign_to_station(vehicle, stations, charging_queue, preferred_type='L2')



