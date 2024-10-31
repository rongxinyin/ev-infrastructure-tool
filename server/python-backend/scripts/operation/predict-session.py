import os
import sys
import numpy as np
import pandas as pd
import h2o
from h2o.automl import H2OAutoML
from h2o.model.regression import h2o_mean_squared_error
import matplotlib.pyplot as plt

# Initialize H2O only once, outside the function
h2o.init(ip="localhost", port="54323")

def predict_session_data(csv_file_path, output_json_path, timezone_str=None):
    # Load and prepare data
    df = pd.read_csv(csv_file_path, low_memory=False)
    df['date_time'] = pd.to_datetime(df['datetime']).dt.tz_localize(timezone_str, ambiguous='NaT', errors='coerce')
    df['electricity_usage'] = pd.to_numeric(df['charge_energy'], errors='coerce')
    df = df[['date_time', 'electricity_usage']].set_index('date_time').sort_index()
    
    # Resample data and create lag features
    df_hour = df.resample('1H').mean()
    df_hour['electricity_usage'] = df_hour['electricity_usage'].fillna(method='ffill')
    
    # Create lag features for past 8 hours
    for i in range(1, 9):
        df_hour[f'electricity_usage_{i}hr_lag'] = df_hour['electricity_usage'].shift(i)
    
    # Add month as a feature for seasonality
    df_hour['month'] = df_hour.index.month
    df_hour = df_hour.dropna()

    # Split data into training and testing sets
    sample_size = df_hour.shape[0] - 200
    df_train = df_hour.iloc[:sample_size].copy()
    df_test = df_hour.iloc[sample_size:].copy()
    
    # Convert data to H2OFrame for training
    h2o_frame_train = h2o.H2OFrame(df_train)
    x = h2o_frame_train.columns
    y = 'electricity_usage'
    x.remove(y)

    # Train model using H2O AutoML
    h2o_automl = H2OAutoML(sort_metric='mse', max_runtime_secs=5*60, seed=666)
    h2o_automl.train(x=x, y=y, training_frame=h2o_frame_train)
    
    # Predict on test data
    h2o_frame_test = h2o.H2OFrame(df_test)
    y_pred = h2o_automl.predict(h2o_frame_test)
    y_actual = h2o.H2OFrame(df_test[['electricity_usage']])

    # Calculate mean squared error
    mse = h2o_mean_squared_error(y_actual, y_pred)
    print(f"Mean Squared Error: {mse}")

    # Compare actual vs predicted and plot
    h2o_compare = pd.DataFrame(data={
        'actual': df_test['electricity_usage'],
        'predicted': y_pred.as_data_frame().to_numpy().ravel()
    })
    h2o_compare.plot(figsize=(10, 5))
    plt.title("Actual vs Predicted Electricity Usage")
    plt.ylabel("Electricity Usage")
    plt.xlabel("Time")
    plt.savefig(output_json_path.replace('.json', '_plot.png'), dpi=300)
    
    # Save results to JSON
    h2o_compare.to_json(output_json_path, orient='records')
    print(f"Results saved to {output_json_path}")

# Run main function
if __name__ == "__main__":
    # Get base directory and setup paths
    base_dir = os.getcwd()
    relative_path = os.path.join('python-backend', 'tests')
    output_json_path = os.path.join(relative_path, "charging_session_metrics.json")

    # Define the CSV file path and get timezone from command line arguments
    csv_file_path = os.path.join(relative_path, "Duke_plug_in_sessions_2024.csv")
    timezone_str = sys.argv[1] if len(sys.argv) > 1 else None

    # Call predict_session_data
    predict_session_data(csv_file_path, output_json_path, timezone_str)
