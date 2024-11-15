import pandas as pd
import json
import os
from datetime import datetime
import pytz
import sys

def process_charging_data(csv_file_path, output_json_path, timezone_str=None):
    # Specify the default timezone based on the environment
    default_timezone = datetime.now().astimezone().tzinfo
    
    # Use the provided timezone or default to UTC
    if timezone_str:
        timezone = pytz.timezone(timezone_str)
    else:
        timezone = default_timezone
    
    # Read the CSV data
    df = pd.read_csv(csv_file_path)
    
    # Convert timestamp columns to datetime with timezone information
    df['PLUG_IN_TS'] = pd.to_datetime(df['PLUG_IN_TS'])
    if df['PLUG_IN_TS'].dt.tz is None:
        df['PLUG_IN_TS'] = df['PLUG_IN_TS'].dt.tz_localize(pytz.UTC)
    df['PLUG_IN_TS'] = df['PLUG_IN_TS'].dt.tz_convert(timezone)
    
    df['CHARGE_START_TS'] = pd.to_datetime(df['CHARGE_START_TS'])
    if df['CHARGE_START_TS'].dt.tz is None:
        df['CHARGE_START_TS'] = df['CHARGE_START_TS'].dt.tz_localize(pytz.UTC)
    df['CHARGE_START_TS'] = df['CHARGE_START_TS'].dt.tz_convert(timezone)
    
    df['CHARGE_END_TS'] = pd.to_datetime(df['CHARGE_END_TS'])
    if df['CHARGE_END_TS'].dt.tz is None:
        df['CHARGE_END_TS'] = df['CHARGE_END_TS'].dt.tz_localize(pytz.UTC)
    df['CHARGE_END_TS'] = df['CHARGE_END_TS'].dt.tz_convert(timezone)
    
    df['PLUT_OUT_TS'] = pd.to_datetime(df['PLUT_OUT_TS'])
    if df['PLUT_OUT_TS'].dt.tz is None:
        df['PLUT_OUT_TS'] = df['PLUT_OUT_TS'].dt.tz_localize(pytz.UTC)
    df['PLUT_OUT_TS'] = df['PLUT_OUT_TS'].dt.tz_convert(timezone)
    
    # Calculate session durations in hours
    df['charge_duration'] = (df['CHARGE_END_TS'] - df['CHARGE_START_TS']).dt.total_seconds() / 3600
    df['total_duration'] = (df['PLUT_OUT_TS'] - df['PLUG_IN_TS']).dt.total_seconds() / 3600
    
    # Calculate energy usage in kWh
    df['energy_used'] = df['ENDKWH'] - df['STARTKWH']
    
    # Calculate average charging power in kW
    df['average_power'] = df['energy_used'] / df['charge_duration']
    
    # Calculate SOC change
    df['soc_change'] = df['ENDSOC'] - df['STARTSOC']

    # Calculate load flexibility
    df['load_flexibility'] = (df['total_duration'] - df['charge_duration']) / df['total_duration']
    
    # Prepare the metrics dictionary
    metrics = {
        "total_sessions": len(df),
        "total_energy_used": df['energy_used'].sum(),
        "average_energy_per_session": df['energy_used'].mean(),
        "total_charge_duration": df['charge_duration'].sum(),
        "average_charge_duration": df['charge_duration'].mean(),
        "total_soc_change": df['soc_change'].sum(),
        "average_soc_change": df['soc_change'].mean(),
        "average_power": df['average_power'].mean(),
        "average_load_flexibility": df['load_flexibility'].mean(),
        "sessions": df.to_dict(orient='records')
    }
    
    # Convert Timestamp objects to strings
    metrics['sessions'] = [
        {
            **session, 
            'PLUG_IN_TS': session['PLUG_IN_TS'].isoformat(), 
            'CHARGE_START_TS': session['CHARGE_START_TS'].isoformat(), 
            'CHARGE_END_TS': session['CHARGE_END_TS'].isoformat(), 
            'PLUT_OUT_TS': session['PLUT_OUT_TS'].isoformat()
        }
        for session in metrics['sessions']
    ]
    
    # Write the metrics to a JSON file
    with open(output_json_path, 'w') as f:
        json.dump(metrics, f, indent=4)
    
    print(json.dumps(metrics))  # Print the result as a JSON string

def process_charging_data_nvsd(csv_file_path, output_json_path, timezone_str=None):
    # Specify the default timezone based on the environment
    default_timezone = datetime.now().astimezone().tzinfo
    
    # Use the provided timezone or default to the system's local timezone
    if timezone_str:
        timezone = pytz.timezone(timezone_str)
    else:
        timezone = default_timezone
    
    # Read the CSV data
    df = pd.read_csv(csv_file_path)
    
    # Convert timestamp columns to datetime with timezone information
    df['Connected Time'] = pd.to_datetime(df['Date'] + ' ' + df['Connected Time'])
    df['Disconnected Time'] = pd.to_datetime(df['Date'] + ' ' + df['Disconnected Time'])
    
    if df['Connected Time'].dt.tz is None:
        df['Connected Time'] = df['Connected Time'].dt.tz_localize(pytz.UTC)
    df['Connected Time'] = df['Connected Time'].dt.tz_convert(timezone)
    
    if df['Disconnected Time'].dt.tz is None:
        df['Disconnected Time'] = df['Disconnected Time'].dt.tz_localize(pytz.UTC)
    df['Disconnected Time'] = df['Disconnected Time'].dt.tz_convert(timezone)
    
    # Calculate session durations in hours
    df['charge_duration'] = df['Charge Duration (min)'] / 60.0
    df['total_duration'] = df['Connected Duration (min)'] / 60.0
    
    # Calculate average charging power in kW
    df['average_power'] = df['Energy Provided (kWh)'] / df['charge_duration']
    
    # Calculate load flexibility
    df['load_flexibility'] = (df['total_duration'] - df['charge_duration']) / df['total_duration']
    
    # Prepare the metrics dictionary
    metrics = {
        "total_sessions": len(df),
        "total_energy_provided": df['Energy Provided (kWh)'].sum(),
        "average_energy_per_session": df['Energy Provided (kWh)'].mean(),
        "total_charge_duration": df['charge_duration'].sum(),
        "average_charge_duration": df['charge_duration'].mean(),
        "average_power": df['average_power'].mean(),
        "average_load_flexibility": df['load_flexibility'].mean(),
        "sessions": df.to_dict(orient='records')
    }

    # For each session, create a timeseries of charging demand in kW every 15 minutes intervals
    for session in metrics['sessions']:
        session['charging_demand'] = []
        total_energy_provided = session['Energy Provided (kWh)']
        average_power = session['average_power']
        connected_time = session['Connected Time']
        disconnected_time = session['Disconnected Time']
        current_time = connected_time
        while current_time < disconnected_time:
            if total_energy_provided > 0:
                session['charging_demand'].append({
                    'timestamp': current_time.isoformat(),
                    'demand': average_power
                })
                total_energy_provided -= average_power * 0.25
            else:   
                session['charging_demand'].append({
                    'timestamp': current_time.isoformat(),
                    'demand': 0
                })
            current_time += pd.Timedelta('15 minutes')
    
    # Convert Timestamp objects to strings
    metrics['sessions'] = [
        {
            **session, 
            'Connected Time': session['Connected Time'].isoformat(), 
            'Disconnected Time': session['Disconnected Time'].isoformat()
        }
        for session in metrics['sessions']
    ]
    
    # Write the metrics to a JSON file
    with open(output_json_path, 'w') as f:
        json.dump(metrics, f, indent=4)
    
    print(json.dumps(metrics, indent=4))  # Print the result as a JSON string

# Example usage:
# process_charging_data('session_report_test.csv', 'output_metrics.json', 'America/Los_Angeles')

if __name__ == "__main__":
    # Get the current working directory
    base_dir = os.getcwd()

    # Define the relative path to the 'python-backend/tests' directory
    relative_path = os.path.join('python-backend', 'tests')
    output_json_path = os.path.join(relative_path, "nvsd_charging_session_metrics.json")

    # Get the CSV file path and timezone from command line arguments
    csv_file_path = os.path.join(relative_path, "session_report_sd.csv")
    timezone_str = sys.argv[2] if len(sys.argv) > 2 else None

    process_charging_data_nvsd(csv_file_path, output_json_path, timezone_str)

