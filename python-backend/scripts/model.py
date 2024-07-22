import pandas as pd
import datetime

class Vehicle:
    def __init__(self, vehicle_info, initial_soc):
        self.vehicle_id = vehicle_info['vehicle id']
        self.vehicle_catagory = vehicle_info['catagory']
        self.soc = initial_soc
        self.battery_capacity = vehicle_info['battery capacity']
        self.site = vehicle_info['zev site']
        self.location = None
        self.home_charging = vehicle_info['home_charging']
        self.charging_station = None
        self.charging_rate = None
        self.previous_status = None
        self.vehicle_status = None
        self.trip_status = None
        self.status_duration = 0
        self.daily_travel_patterns = vehicle_info['weekly driving patterns']
        self.equivalent_electricity_kwh = 0

    def calculate_total_distance(self):
        total_distance = 0
        for pattern in self.daily_travel_patterns:
            total_distance += pattern["Driving Distance"]
        return total_distance

    def calculate_total_energy_consumption(self):
        total_energy = 0
        for pattern in self.daily_travel_patterns:
            total_energy += pattern["equivalent electricity kWh"]
        return total_energy

class ChargingStation:
    def __init__(self, station_type, minimum_power=0.0, maximum_power=0.0):
        self.station_type = station_type
        self.is_available = True
        self.minimum_power = minimum_power
        self.maximum_power = maximum_power

    def __repr__(self):
        return ("power rate {}W\n").format(self.maximum_power)

class Activity(object):
    """ Activity is an abstract class that is implemented in Driving and Parked.
    Args:
        start (datetime): start time of the activity
        end (datetime): end time of the activity
    """

    def __init__(self, start, end, location):
        self.start = start
        self.end = end
        self.location = location

def generate_timeseries_activity(daily_trip):
    # Get the start time of the day
    start_time = datetime.datetime.strptime("00:00", "%H:%M")

    # Initialize the list to store the time series activities
    time_series_activities = []

    # Iterate over the activities in the daily trip
    for activity in daily_trip["activities"]:
        # Get the start and end time of the activity
        start_time_str = activity["start_time"]
        end_time_str = activity["end_time"]

        # Convert the start and end time strings to datetime objects
        start_time_obj = datetime.datetime.strptime(start_time_str, "%H:%M")
        end_time_obj = datetime.datetime.strptime(end_time_str, "%H:%M")

        # Generate the time series activities for the duration of the activity
        for current_time in pd.date_range(start_time_obj, end_time_obj, freq='T')[:-1]:

            # Create a new activity with the current time
            new_activity = {
                "activity_id": activity["activity_id"],
                "start_time": current_time.strftime("%H:%M"),
                "end_time": (current_time + datetime.timedelta(minutes=1)).strftime("%H:%M"),
                "activity_type": activity["activity_type"],
                "location": activity["location"]
            }

            # Add the new activity to the time series activities list
            time_series_activities.append(new_activity)
    df = pd.DataFrame(time_series_activities)
    df.index = df['start_time']
    return df

def cancel_trip_activity():
    # Initialize the list to store the time series activities
    time_series_activities = []

    # Convert the start and end time strings to datetime objects
    start_time_obj = datetime.datetime.strptime("00:00", "%H:%M")
    end_time_obj = datetime.datetime.strptime("23:59", "%H:%M")

    # Generate the time series activities for the duration of the activity
    for current_time in pd.date_range(start_time_obj, end_time_obj, freq='T')[:-1]:

        # Create a new activity with the current time
        new_activity = {
            "activity_id": 1,
            "start_time": current_time.strftime("%H:%M"),
            "end_time": (current_time + datetime.timedelta(minutes=1)).strftime("%H:%M"),
            "activity_type": "Parked", # Cancel the trip and stay on-site
            "location": "On-Site" # Cancel the trip and stay on-site
        }

        # Add the new activity to the time series activities list
        time_series_activities.append(new_activity)
    df = pd.DataFrame(time_series_activities)
    df.index = df['start_time']
    return df