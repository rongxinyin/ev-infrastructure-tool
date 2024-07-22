from pov_charge_model import *
from pov_travel_pattern import *
import os
import random
import json

def random_select_list(lst, percentage):
    n = max(int(len(lst) * percentage), 1)
    return random.sample(lst, n)

def rank_and_select_vehicles(vehicle_list, percentage):
    ranked_vehicles = sorted(vehicle_list, key=lambda x: x['distance']['value'], reverse=True)
    n = max(int(len(ranked_vehicles) * percentage), 1)
    selected_vehicles = ranked_vehicles[1:n+1]
    return selected_vehicles

def estimate_charging_stations_range(number_of_vehicles):

    # Determine the increment based on the number of vehicles
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
    elif 250 <= number_of_vehicles < 300:
        increment = 4
        min_stations, max_stations = 72, 120
    else:
        increment = 10
        min_stations, max_stations = 72, 120

    # Create the range of charging stations
    charging_station_range = list(range(min_stations, max_stations, increment))
    
    return charging_station_range

# Example usage of the charging choice model
def run_charging_management(site_id, driving_pattern_input, time_step = 15, 
                            charging_period_limit = 240, 
                            start_time = datetime.datetime(2024, 2, 1), 
                            run_period = 30, 
                            l2_max_rate = 19.2, l3_max_rate = 60.0, adoption_rate = 0.1):
    # Create Vehicle objects and set daily travel patterns
    with open(driving_pattern_input, 'r') as file:
        fleet_driving_patterns = json.load(file)

    site_pov_vehicles = []
    for vehicle_info in fleet_driving_patterns:
        # if vehicle_info['zev site'] == site_id:
        if vehicle_info['parking_lot'] == site_id:
            if vehicle_info['distance']['value'] < 100 * 1609 and vehicle_info['leave_to_work_time'] < '12:00': # less than 100 miles
                site_pov_vehicles.append(vehicle_info)
                print(vehicle_info['leave_to_work_time'])
            # vehicle = Vehicle(vehicle_info, 80) # Set initial state of charge to 80%
            # pov_vehicles.append(vehicle)
        continue
    selected_vehicles = rank_and_select_vehicles(site_pov_vehicles, adoption_rate)
    ev_pov_vehicles = [Vehicle(vehicle_info, 80) for vehicle_info in selected_vehicles]
    # Randomly select a subset of vehicles for testing
    # ev_pov_vehicles = random_select_list(pov_vehicles, adoption_rate)
    # Start a week of simulation, global variables
    # time_step = 15  # 15 minutes
    charging_period_limit = 240  # 4 hours
    # start_time = datetime.datetime(2024, 2, 1)
    end_time = start_time + run_period * datetime.timedelta(days=1)

    number_of_L2 = estimate_charging_stations_range(len(selected_vehicles))
    number_of_L3 = [0]
    results = pd.DataFrame()

    for L2 in number_of_L2:
        for L3 in number_of_L3:
            # Initialize vehicles
            initialize_vehicles(ev_pov_vehicles)

            # Initialize charging stations and queue
            stations = [ChargingStation('L2', maximum_power=l2_max_rate) for _ in range(L2)] + [ChargingStation('L3', maximum_power=l3_max_rate) for _ in range(L3)]
            charging_queue = ChargingQueue()

            # Create a list to store the vehicle status
            vehicle_output = []

            for current_time in pd.date_range(start=start_time, end=end_time, freq='15T'):

                # Update vehicle activities at the start of the day
                if current_time.hour == 0 and current_time.minute == 0:
                    update_vehicle_activities(ev_pov_vehicles, current_time)
                    charging_queue.queue.clear() # Clear the charging queue at the start of the day, fixed on 2024-4-22
                    release_all_stations(ev_pov_vehicles, stations)
                # Update vehicle location and activities
                update_vehicle_location(ev_pov_vehicles, current_time)

                # Update vehicle trip status
                # update_vehicle_trip_status(fleet_vehicles, current_time, time_step)

                # Update charging limit during daytime and release all stations at 9:00am
                if current_time.hour > 8 and current_time.hour < 18:
                    update_charging_limit(ev_pov_vehicles, charging_period_limit)
                # if current_time.hour == 9 and current_time.minute == 0:
                #     release_all_stations(fleet_vehicles, stations)

                # Assign charging stations
                assign_charging_stations(ev_pov_vehicles, stations, charging_queue, current_time)
                update_charging_queue(charging_queue, stations)

                # Update vehicle status
                update_vehicle_status(ev_pov_vehicles, current_time, time_step, charging_queue)

                # Update vehicle soc
                update_vehicle_soc(ev_pov_vehicles, time_step)

                # Output assigned stations
                for i, vehicle in enumerate(ev_pov_vehicles):
                    station_type = vehicle.charging_station.station_type if vehicle.charging_station else 'None'

                    # Output vehicle status
                    vehicle_output.append({"time": current_time, "vehicle_id": i+1, 
                                        "soc": vehicle.soc, 
                                        "location": vehicle.location,
                                        "charging_station": station_type,
                                        "charging_rate": vehicle.charging_rate,
                                        "status": vehicle.vehicle_status, 
                                        "status_duration": vehicle.status_duration, 
                                        "trip_status": vehicle.trip_status, 
                                        "equivalent_electricity_kwh": vehicle.equivalent_electricity_kwh, 
                                        "queue_status": 'In queue' if vehicle in charging_queue.queue else 'Not in queue'})

                # Output charging queue
                print("Charging Queue:", [vehicle.vehicle_status for vehicle in charging_queue.queue])

            # Output vehicle status
            df_vehicle_output = pd.DataFrame(vehicle_output)
            df_vehicle_output['L2'] = L2
            df_vehicle_output['L3'] = L3
            results = pd.concat([results, df_vehicle_output])

    return results

def add_home_charging(data):
    # Create a list of json data for each vehicle and dump to json file
    employee_commute = []
    for employee in data:
        travel_distance = employee['distance']['value']
        if travel_distance > 100 * 1609:  # Convert miles to meters
            employee['home_charging'] = 'Level 2'
        else:
            if random.random() < 0.7: # 70% of the employees have Level 2 charging
                employee['home_charging'] = 'Level 2'
            else:
                employee['home_charging'] = 'Level 1'
        # Append the updated employee data to the list
        employee_commute.append(employee)
    return employee_commute

if __name__ == "__main__":
    # Save the results to a csv file
    output_folder = '~/github/ev-infrastructure-tool/python-backend/tests'

    for parking_lot in ['bldg-90']:
        # Create the output folder if it doesn't exist
        output_path = os.path.expanduser(output_folder)
        site_path = os.path.join(output_path, parking_lot)
        if not os.path.exists(site_path):
            os.makedirs(site_path)

        # Create a list of json data for each vehicle and dump to json file
        driving_pattern_data = []
        with open('data/pov_driving_pattern.json', 'w') as f:
            # Load employee commute survey json data
            with open('../tests/update_employee_commute.json', 'r') as file:
                pov_driving_patterns = json.load(file)

            for row in pov_driving_patterns:
                if row['parking_lot'] == parking_lot:
                    driving_pattern_data.append(create_driving_pattern(row, scenario='normal'))
            # dump to json file
            json.dump(driving_pattern_data, f)

        # Run the charging management model for different adoption rates
        for adoption_rate in [0.36]:
            print(f"Running charging management model for site {parking_lot} with adoption rate {adoption_rate}")
            results = run_charging_management(parking_lot, 'tests/pov_driving_pattern.json', 
                                            start_time = datetime.datetime(2024, 2, 1), run_period = 30, 
                                            l2_max_rate = 7.0, l3_max_rate = 50.0, adoption_rate = adoption_rate)
            results.to_csv(os.path.join(site_path, f'pov_vehicle_status_{adoption_rate}.csv'), index=False)
            print(f"Results saved to {site_path}/pov_vehicle_status_{adoption_rate}.csv")