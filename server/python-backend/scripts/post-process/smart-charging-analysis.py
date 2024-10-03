import pandas as pd
import os
import json

def read_csv(file_path):
    return pd.read_csv(file_path)

def get_optimal_charging_stations(melted_results_path):
    df = read_csv(melted_results_path)
    optimal_row = df.loc[df['weighted_score'].idxmax()]
    optimal_L2 = optimal_row['L2']
    optimal_L3 = optimal_row['L3']
    return optimal_L2, optimal_L3

def generate_statistics(raw_output_path, optimal_L2, optimal_L3):
    df = read_csv(raw_output_path)
    # Filter the data based on the optimal L2 and L3 values
    df_filtered = df[(df['L2'] == optimal_L2) & (df['L3'] == optimal_L3)].copy()

    # Convert 'time' column to datetime
    df_filtered['time'] = pd.to_datetime(df_filtered['time'])

    # Aggregate the charging rate by time
    aggregated_charging_rate = df_filtered.groupby('time')['charging_rate'].sum().reset_index()
    
    # Time as index
    aggregated_charging_rate.set_index('time', inplace=True)

    # Calculate consumed electricity (sum of charging rates over time)
    consumed_electricity = aggregated_charging_rate['charging_rate'].sum()

    # Calculate peak demand (maximum charging rate at any time)
    peak_demand = aggregated_charging_rate['charging_rate'].max()

    # Calculate load factor (average load divided by peak load)
    average_load = aggregated_charging_rate['charging_rate'].mean()
    load_factor = average_load / peak_demand

    # Convert aggregated time series charging rate to JSON format for the frontend
    aggregated_charging_rate.reset_index(inplace=True) # Reset index to convert to JSON
    aggregated_charging_rate['time'] = aggregated_charging_rate['time'].dt.strftime('%Y-%m-%d %H:%M:%S')
    aggregated_charging_rate_list = aggregated_charging_rate.to_dict(orient='records')

    # Generate statistics
    stats = {
        'consumed_electricity': round(consumed_electricity, 0),
        'peak_demand': round(peak_demand, 0),
        'average_load': round(average_load, 2),
        'load_factor': round(load_factor, 2)
    }
    return stats, aggregated_charging_rate_list

def main():
    # Get the current working directory
    base_dir = os.getcwd()

    # Define the relative path to the 'python-backend/tests' directory
    relative_path = os.path.join('python-backend', 'tests')

    # Combine the base directory with the relative path
    test_dir = os.path.join(base_dir, relative_path)

    melted_results_path = os.path.join(test_dir, 'melted_results_adoption_rate.csv')
    raw_output_path = os.path.join(test_dir, 'vehicle_status_normal_0.36.csv')

    optimal_L2, optimal_L3 = get_optimal_charging_stations(melted_results_path)
    
    stats, aggregated_charging_rate_list = generate_statistics(raw_output_path, optimal_L2, optimal_L3)
    
    result = {
        'optimal_L2': optimal_L2,
        'optimal_L3': optimal_L3,
        'statistics': stats,
        'aggregated_charging_rate': aggregated_charging_rate_list
    }
    
    print(json.dumps(result))  # Print the result as a JSON string

if __name__ == "__main__":
    main()