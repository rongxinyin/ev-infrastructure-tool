import pandas as pd
import datetime
from utilities.activity import generate_timeseries_activity

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

    def update_activities(self, current_time):
        for daily_trip in self.daily_travel_patterns:
            if daily_trip["day of week"] == current_time.strftime("%A"):
                self.activities = generate_timeseries_activity(daily_trip)
                self.equivalent_electricity_kwh_rate = daily_trip["equivalent electricity consumption rate"]
                self.equivalent_electricity_kwh = daily_trip["equivalent electricity kWh"]

    def update_location(self, current_time):
        self.location = self.activities.loc[current_time.strftime('%H:%M')]["location"]

    def update_status(self, current_time, charging_queue, stations, charging_period_limit):
        vehicle_activity = self.activities.loc[current_time.strftime('%H:%M')]["activity_type"]
        if self.location == 'Off-Site':
            self.vehicle_status = vehicle_activity
            self.charging_rate = None
            if self in charging_queue.queue:
                charging_queue.remove(self)
        elif self.location == 'Home' and self.vehicle_status == 'Parked':
            self.charging_rate = None
            if self in charging_queue.queue:
                charging_queue.remove(self)
        if self.vehicle_status == self.previous_status:
            self.status_duration += 15
        else:
            self.status_duration = 0
            self.previous_status = self.vehicle_status

    def update_soc(self, time_step):
        if self.location == 'On-Site':
            if self.vehicle_status == 'Charging' and self.charging_station is not None:
                if self.soc < 90:
                    self.soc += self.charging_station.maximum_power * time_step / 60 / self.battery_capacity * 100
                    self.charging_rate = self.charging_station.maximum_power
                else:
                    self.charging_rate = 0
            elif self.vehicle_status == 'Waiting for station':
                self.charging_rate = None
            else:
                self.vehicle_status = 'Parked'
                self.charging_rate = None
        elif self.location == 'Off-Site':
            self.charging_rate = None
            if self.vehicle_status == 'Driving':
                self.soc -= self.equivalent_electricity_kwh_rate * time_step / 60 / self.battery_capacity * 100
        elif self.location == 'Home':
            if self.vehicle_status == 'Charging' and self.home_charging in ['Level 1', 'Level 2']:
                if self.soc < 90:
                    if self.home_charging == 'Level 2':
                        self.charging_rate = 7.0
                    else:
                        self.charging_rate = 1.5
                    self.soc += self.charging_rate * time_step / 60 / self.battery_capacity * 100
                else:
                    self.charging_rate = 0
            else:
                self.charging_rate = None
                self.vehicle_status = 'Parked'
        else:
            self.charging_rate = None
            self.vehicle_status = 'Parked'
            
    def get_status(self, current_time, charging_queue):
        station_type = self.charging_station.station_type if self.charging_station else 'None'
        return {
            "time": current_time, "vehicle_id": self.vehicle_id, 
            "soc": self.soc, "location": self.location,
            "charging_station": station_type, "charging_rate": self.charging_rate,
            "status": self.vehicle_status, "status_duration": self.status_duration, 
            "trip_status": self.trip_status, "equivalent_electricity_kwh": self.equivalent_electricity_kwh, 
            "queue_status": 'In queue' if self in charging_queue.queue else 'Not in queue'
        }
