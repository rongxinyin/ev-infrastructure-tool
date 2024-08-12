import pandas as pd
import datetime

def generate_timeseries_activity(daily_trip):
    start_time = datetime.datetime.strptime("00:00", "%H:%M")
    time_series_activities = []

    for activity in daily_trip["activities"]:
        start_time_str = activity["start_time"]
        end_time_str = activity["end_time"]

        start_time_obj = datetime.datetime.strptime(start_time_str, "%H:%M")
        end_time_obj = datetime.datetime.strptime(end_time_str, "%H:%M")

        for current_time in pd.date_range(start_time_obj, end_time_obj, freq='T')[:-1]:
            new_activity = {
                "activity_id": activity["activity_id"],
                "start_time": current_time.strftime("%H:%M"),
                "end_time": (current_time + datetime.timedelta(minutes=1)).strftime("%H:%M"),
                "activity_type": activity["activity_type"],
                "location": activity["location"]
            }
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
