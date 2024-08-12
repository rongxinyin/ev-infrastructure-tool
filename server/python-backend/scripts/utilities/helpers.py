import random
import datetime

def rank_and_select_vehicles(vehicle_list, percentage):
    """
    Rank vehicles by distance and select a percentage of them.
    """
    ranked_vehicles = sorted(vehicle_list, key=lambda x: x['distance']['value'], reverse=True)
    n = max(int(len(ranked_vehicles) * percentage), 1)
    selected_vehicles = ranked_vehicles[:n]
    return selected_vehicles

def estimate_charging_stations_range(number_of_vehicles):
    """
    Estimate the range of charging stations needed based on the number of vehicles.
    """
    if number_of_vehicles < 20:
        increment = 2
        min_stations, max_stations = 0, 14
    elif 20 <= number_of_vehicles < 50:
        increment = 2
        min_stations, max_stations = 8, 26
    elif 50 <= number_of_vehicles < 75:
        increment = 2
        min_stations, max_stations = 16, 40
    elif 75 <= number_of_vehicles < 100:
        increment = 2
        min_stations, max_stations = 34, 54
    elif 100 <= number_of_vehicles < 150:
        increment = 4
        min_stations, max_stations = 40, 72
    elif 150 <= number_of_vehicles < 200:
        increment = 4
        min_stations, max_stations = 48, 96
    elif 200 <= number_of_vehicles < 300:
        increment = 4
        min_stations, max_stations = 72, 120
    else:
        increment = 10
        min_stations, max_stations = 72, 120

    charging_station_range = list(range(min_stations, max_stations, increment))
    return charging_station_range

def initialize_vehicles(pov_vehicles):
    """
    Initialize the state of charge and status for a list of vehicles.
    """
    for vehicle in pov_vehicles:
        vehicle.soc = 80
        vehicle.trip_status = None
        vehicle.location = None
        vehicle.charging_station = None
        vehicle.previous_status = None
        vehicle.vehicle_status = None
        vehicle.status_duration = 0
        vehicle.equivalent_electricity_kwh_rate = 0
        vehicle.equivalent_electricity_kwh = 0
    return

def add_home_charging(data):
    """
    Add home charging capability to each vehicle in the dataset.
    """
    employee_commute = []
    for employee in data:
        travel_distance = employee['distance']['value']
        if travel_distance > 100 * 1609:  # Convert miles to meters
            employee['home_charging'] = 'Level 2'
        else:
            if random.random() < 0.7:  # 70% of the employees have Level 2 charging
                employee['home_charging'] = 'Level 2'
            else:
                employee['home_charging'] = 'Level 1'
        employee_commute.append(employee)
    return employee_commute
