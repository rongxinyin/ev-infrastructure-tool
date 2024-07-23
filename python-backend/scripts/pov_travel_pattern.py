import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import random
import json
import datetime

# Generate a random number of driving days for each week
def create_driving_pattern(row, scenario):
    # Generate a random number of driving days for each week
    row.update({"days_drive": 5})
    if scenario == 'normal':
        driving_days = random.sample(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 
                                        k=row['days_drive'])
    elif scenario == 'abnormal':
        if row['days_drive'] == 1:
            driving_days = random.sample(['Tuesday', 'Wednesday'], 
                                        k=row['days_drive'])
        elif row['days_drive'] == 2:
            driving_days = random.sample(['Tuesday', 'Wednesday'], k=row['days_drive'])
        elif row['days_drive'] == 3:
            driving_days = random.sample(['Tuesday', 'Wednesday', 'Thursday'], k=row['days_drive'])
        elif row['days_drive'] == 4:
            driving_days = random.sample(['Tuesday', 'Wednesday', 'Thursday', 'Friday'], k=row['days_drive'])
        elif row['days_drive'] == 5:
            driving_days = random.sample(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], k=row['days_drive'])
    else:
        print('Invalid scenario')
    row.update({"vehicle id": row['employee_id'], 
                "zev site": row['onsite_bldg'], 
                "parking lot": row['parking_lot'],
                "catagory": 'Light-Duty', 
                "battery capacity": 80,
                "weekly driving patterns": []
                })
    # Generate a random number of mpge (mu=24.09, sigma=2.85) for each vehicle
    # Cite NREL report: Field Evaluation of Medium-Duty Plug-in Electric Delivery Trucks
    if row['catagory'] == 'Heavy-Duty':
        mu, sigma = 24.09, 2.85
    elif row['catagory'] == 'Medium-Duty':
        mu, sigma = 68, 2.0 # for medium-duty vehicles, e.g., ford f-150 lightning
    else:
        # mu, sigma = 86, 3.2 # for light-duty vehicles
        mu, sigma = 117, 3.2 # for light-duty vehicles, NREL Electric Vehicle Efficiency Ratios
    mpge = np.random.normal(mu, sigma, 1)[0]
    for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']:
        if day in driving_days:
            driving_distance_per_day = row['distance']['value'] / 1609 # convert meters to miles
            equivalent_electricity_kWh = driving_distance_per_day * 2 * 33.7 / mpge # round trip
            fuel_efficiency_mph = row['distance']['value'] / row['duration']['value'] * 2.23694 # convert m/s to mph
            row['weekly driving patterns'].append({
                "day of week": day,
                "driving distance": driving_distance_per_day,
                "equivalent efficiency mpge": mpge,
                "average speed mph": fuel_efficiency_mph,
                "equivalent electricity consumption rate": fuel_efficiency_mph * 33.7 / mpge,
                "equivalent electricity kWh": equivalent_electricity_kWh,
                "activities": create_activities_hasTrip(row)
            })
        else:
            row['weekly driving patterns'].append({
                "day of week": day,
                "driving distance": 0,
                "equivalent efficiency mpge": 0,
                "average speed mph": 0,
                "equivalent electricity consumption rate": 0,
                "equivalent electricity kWh": 0,
                "activities": create_activities_noTrip()
            })
    return row

def generate_random_time(start_time, end_time):
        start_time_obj = datetime.datetime.strptime(start_time, "%H:%M")
        end_time_obj = datetime.datetime.strptime(end_time, "%H:%M")
        time_range = end_time_obj - start_time_obj
        random_time = start_time_obj + datetime.timedelta(minutes=random.randint(0, int(time_range.total_seconds() / 60)))
        return random_time

def create_activities_hasTrip(row):
    activities = []
    # Get distance between home and work
    distance = row['distance']['value'] / 1609 # convert meters to miles
    # Generate departure and return trips start and end times
    departure_start_time = datetime.datetime.strptime(row['leave_to_work_time'], '%H:%M')
    departure_end_time = departure_start_time + datetime.timedelta(seconds=row['duration']['value'])
    return_start_time = datetime.datetime.strptime(row['return_home_time'], '%H:%M')
    return_end_time = return_start_time + datetime.timedelta(seconds=row['duration']['value'])
    activities.append({"activity_id": 1, "start_time": '00:00', 
                       "end_time": departure_start_time.strftime('%H:%M'), 
                       "activity_type": "Parked", 
                       "location": "Home", 
                       "driving_distance": 0})
    activities.append({"activity_id": 2, "start_time": departure_start_time.strftime('%H:%M'), 
                       "end_time": departure_end_time.strftime('%H:%M'), 
                       "activity_type": "Driving", 
                       "location": "Off-Site", 
                       "driving_distance": distance})
    activities.append({"activity_id": 3, "start_time": departure_end_time.strftime('%H:%M'), 
                       "end_time": return_start_time.strftime('%H:%M'), 
                       "activity_type": "Parked", 
                       "location": "On-Site", 
                       "driving_distance": 0})
    activities.append({"activity_id": 4, "start_time": return_start_time.strftime('%H:%M'), 
                       "end_time": return_end_time.strftime('%H:%M'), 
                       "activity_type": "Driving", 
                       "location": "Off-Site", 
                       "driving_distance": distance})
    activities.append({"activity_id": 5, "start_time": return_end_time.strftime('%H:%M'), 
                       "end_time": '23:59', 
                       "activity_type": "Parked", 
                       "location": "Home", 
                       "driving_distance": 0})
    return activities

def create_activities_noTrip():
    activities = []
    activities.append({"activity_id": 1, "start_time": '00:00', 
                       "end_time": '23:59', 
                       "activity_type": "Parked", 
                       "location": "Home", 
                       "driving_distance": 0})
    return activities
    