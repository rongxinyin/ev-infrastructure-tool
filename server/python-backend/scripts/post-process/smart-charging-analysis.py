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
    df_filtered = df[(df['L2'] == optimal_L2) & (df['L3'] == optimal_L3)]
    
    # Generate statistics
    stats = {
        'total_sessions': len(df_filtered),
        'total_energy': df_filtered['energy'].sum(),
        'average_energy_per_session': df_filtered['energy'].mean(),
        'total_duration': df_filtered['duration'].sum(),
        'average_duration_per_session': df_filtered['duration'].mean(),
        'L2_sessions': len(df_filtered[df_filtered['station_type'] == 'L2']),
        'L3_sessions': len(df_filtered[df_filtered['station_type'] == 'L3']),
    }
    return stats

def main():
    base_dir = os.getcwd() + '/server/python-backend/tests'
    melted_results_path = os.path.join(base_dir, 'melted_results_adoption_rate.csv')
    raw_output_path = os.path.join(base_dir, 'vehicle_status_normal_0.36.csv')

    optimal_L2, optimal_L3 = get_optimal_charging_stations(melted_results_path)
    
    # stats = generate_statistics(raw_output_path, optimal_L2, optimal_L3)
    
    result = {
        'optimal_L2': optimal_L2,
        'optimal_L3': optimal_L3,
        # 'statistics': stats
    }
    
    print(json.dumps(result))  # Print the result as a JSON string

if __name__ == "__main__":
    main()