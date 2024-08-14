import os
import sys
import json
import datetime
import pandas as pd
from utilities.helpers import rank_and_select_vehicles, estimate_charging_stations_range, initialize_vehicles, add_home_charging
from utilities.queue import ChargingQueue, assign_charging_stations, update_charging_queue
from utilities.pattern_generator import create_driving_pattern
from models.vehicle import Vehicle
from models.charging_station import ChargingStation

def run_charging_management(site_id, driving_pattern_data, start_time, run_period=30, l2_max_rate=19.2, l3_max_rate=60.0, adoption_rate=0.1):
    site_pov_vehicles = [vehicle_info for vehicle_info in driving_pattern_data if vehicle_info['parking_lot'] == site_id and vehicle_info['distance']['value'] < 100 * 1609]
    selected_vehicles = rank_and_select_vehicles(site_pov_vehicles, adoption_rate)
    ev_pov_vehicles = [Vehicle(vehicle_info, 80) for vehicle_info in selected_vehicles]

    charging_period_limit = 240
    end_time = start_time + datetime.timedelta(days=run_period)

    number_of_L2 = estimate_charging_stations_range(len(selected_vehicles))
    number_of_L3 = [0]
    results = pd.DataFrame()

    for L2 in number_of_L2:
        for L3 in number_of_L3:
            initialize_vehicles(ev_pov_vehicles)
            stations = [ChargingStation('L2', maximum_power=l2_max_rate) for _ in range(L2)] + [ChargingStation('L3', maximum_power=l3_max_rate) for _ in range(L3)]
            charging_queue = ChargingQueue()
            vehicle_output = []

            for current_time in pd.date_range(start=start_time, end=end_time, freq='15T'):
                if current_time.hour == 0 and current_time.minute == 0:
                    for vehicle in ev_pov_vehicles:
                        vehicle.update_activities(current_time)
                    charging_queue.queue.clear()
                    for station in stations:
                        station.release()

                # Update vehicle location and activities
                for vehicle in ev_pov_vehicles:
                    vehicle.update_location(current_time)
                
                # Update charging station status and assign charging stations
                assign_charging_stations(ev_pov_vehicles, stations, charging_queue, current_time)
                update_charging_queue(charging_queue, stations)

                # Update vehicle status and soc
                for vehicle in ev_pov_vehicles:
                    vehicle.update_status(current_time, charging_queue, stations, charging_period_limit)
                    vehicle.update_soc(15)

                # Append vehicle status to the output list
                for vehicle in ev_pov_vehicles:
                    vehicle_output.append(vehicle.get_status(current_time, charging_queue))

            df_vehicle_output = pd.DataFrame(vehicle_output)
            df_vehicle_output['L2'] = L2
            df_vehicle_output['L3'] = L3
            results = pd.concat([results, df_vehicle_output])

    return results

def fleet_charging_management(site_id, driving_pattern_input, start_time, run_period=30, 
                            l2_port_low=0, l2_port_high=0, l3_port_low=0, l3_port_high=0, 
                            l2_max_rate=19.2, l3_max_rate=60.0, adoption_rate=0.1):

    fleet_vehicles = [Vehicle(vehicle_info, 80) for vehicle_info in driving_pattern_input]

    charging_period_limit = 240
    end_time = start_time + datetime.timedelta(days=run_period)

    # number_of_L2 = estimate_charging_stations_range(len(fleet_vehicles))
    number_of_L2 = range(l2_port_low*2, l2_port_high*2+2, 2)
    number_of_L3 = range(l3_port_low*3, l3_port_high*3+3, 3)
    results = pd.DataFrame()

    for L2 in number_of_L2:
        for L3 in number_of_L3:
            initialize_vehicles(fleet_vehicles)
            stations = [ChargingStation('L2', maximum_power=l2_max_rate) for _ in range(L2)] + [ChargingStation('L3', maximum_power=l3_max_rate) for _ in range(L3)]
            charging_queue = ChargingQueue()
            vehicle_output = []

            for current_time in pd.date_range(start=start_time, end=end_time, freq='15T'):
                if current_time.hour == 0 and current_time.minute == 0:
                    for vehicle in fleet_vehicles:
                        vehicle.update_activities(current_time)
                # Check if it is the beginning of the work day and release all charging stations
                if current_time.hour == 9 and current_time.minute == 0:
                    for station in stations:
                        station.release()
                    for vehicle in fleet_vehicles:
                        vehicle.release_station()

                # Update vehicle location and activities
                for vehicle in fleet_vehicles:
                    vehicle.update_location(current_time)
                
                # Update charging station status and assign charging stations
                assign_charging_stations(fleet_vehicles, stations, charging_queue, current_time)
                update_charging_queue(charging_queue, stations)

                # Update vehicle status and soc
                for vehicle in fleet_vehicles:
                    vehicle.update_status(current_time, charging_queue, stations, charging_period_limit)
                    vehicle.update_soc(15)

                # Append vehicle status to the output list
                for vehicle in fleet_vehicles:
                    vehicle_output.append(vehicle.get_status(current_time, charging_queue))

            df_vehicle_output = pd.DataFrame(vehicle_output)
            df_vehicle_output['L2'] = L2
            df_vehicle_output['L3'] = L3
            results = pd.concat([results, df_vehicle_output])

    return results

if __name__ == "__main__":
    test_folder = '~/github/ev-infrastructure-tool/python-backend/tests'
    for parking_lot in ['bldg-90']:
        test_path = os.path.expanduser(test_folder)
        site_path = os.path.join(test_path, parking_lot)
        os.makedirs(site_path, exist_ok=True)

        input_data = sys.argv[1] # first argument after the filename
        start_time = datetime.datetime.strptime(sys.argv[2], "%Y-%m-%d %H:%M:%S")
        run_period = int(sys.argv[3])
        l2_max_rate = float(sys.argv[4])
        l3_max_rate = float(sys.argv[5])
        adoption_rate = float(sys.argv[6])

        # ex values:
        # start_time=datetime.datetime(2024, 2, 1), 
        # run_period=30, 
        # l2_max_rate=7.0, 
        # l3_max_rate=50.0, 
        # adoption_rate=0.36

        pov_driving_patterns = json.loads(input_data)

        # add home charging information to the json data
        add_home_charging(pov_driving_patterns)

        driving_pattern_data = []
        for row in pov_driving_patterns:
            if row['parking_lot'] == parking_lot:
                driving_pattern_data.append(create_driving_pattern(row, scenario='normal'))

        results = run_charging_management(parking_lot, driving_pattern_data, start_time=start_time, run_period=run_period, l2_max_rate=l2_max_rate, l3_max_rate=l3_max_rate, adoption_rate=adoption_rate)
        results.to_csv(os.path.join(site_path, f'pov_vehicle_status_{adoption_rate}.csv'), index=False)
