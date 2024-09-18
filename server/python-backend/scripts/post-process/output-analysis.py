import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def clean_dataframe(site_path, input_file):
    """Cleans the input CSV file and adds relevant columns."""
    df = pd.read_csv(os.path.join(site_path, input_file), low_memory=False)
    df['low_soc'] = df['soc'].apply(lambda x: 1 if x < 15 else 0)
    df['charging-ports'] = list(zip(df['L2'], df['L3']))
    df['connected'] = df['charging_station'].fillna(0).apply(lambda x: 1 if x != 0 else 0)
    return df

def normalize_utilization_scores(numbers, target=0.2, max_score=5):
    """Normalizes utilization rates to a score between 1 and 5."""
    differences = np.abs(np.array(numbers) - target)
    max_difference = max(differences)
    inverted_scores = max_difference - differences
    normalized_scores = 1 + (inverted_scores / max(inverted_scores)) * (max_score - 1)
    return normalized_scores

def calc_weighted_score(df, weights=None):
    """Calculates weighted scores based on KPIs."""
    weights = weights or {
        "cost": -0.25,
        "waiting_for_station": -0.25,
        "peak_demand": -0.25,
        "utilization": 0.25,
    }

    for kpi, weight in weights.items():
        if kpi == 'waiting_for_station':
            df[f"{kpi}_score"] = np.where(df[kpi] == 0, 5, 1)
        elif kpi == 'utilization':
            df[f"{kpi}_score"] = normalize_utilization_scores(df[kpi])
        else:
            min_val, max_val = df[kpi].min(), df[kpi].max()
            df[f"{kpi}_score"] = np.interp(df[kpi], (min_val, max_val), (5, 1) if weight < 0 else (1, 5))
    
    df["weighted_score"] = sum(df[f"{kpi}_score"] * np.abs(weight) for kpi, weight in weights.items())
    return df

def generate_figures(df, site_path, scenario):
    """Generates and saves figures based on the analysis."""
    sns.set_style("ticks")
    sns.set_context("paper")

    try:
        waiting_df = df[df['status'] == 'Waiting for station'].groupby(['charging-ports', 'vehicle_id'])['low_soc'].count().unstack().fillna(0)
        fig, ax = plt.subplots(figsize=(10, 6))
        waiting_df.plot(kind='bar', stacked=True, ax=ax)
        ax.set_xlabel('Charging ports (L2, L3)')
        ax.set_ylabel('Counts of waiting for station')
        ax.legend(ncol=5)
        sns.despine()
        ax.set_xticklabels(ax.get_xticklabels(), rotation=0)
        fig.savefig(os.path.join(site_path, f'waiting_charging_station_NoParkingLimit_{scenario}.png'), dpi=300, bbox_inches='tight')
    except KeyError:
        print('No waiting for station data available.')

    try:
        pivot_table = df[(df['time'] > '2024-02-15') & (df['time'] < '2024-03-01')].pivot_table(index=['charging-ports', 'time'], columns='vehicle_id', values='connected')
        utilization = (pivot_table.sum(axis=1) / pivot_table.index.get_level_values(0).map(lambda x: sum(x))).reset_index()
        utilization['time'] = pd.to_datetime(utilization['time'])
        utilization['hour'] = utilization['time'].dt.hour
        utilization['weekday'] = utilization['time'].dt.weekday
        utilization = utilization[utilization['weekday'] < 5].groupby(['charging-ports', 'hour'])['connected'].mean().reset_index()

        plot_data = utilization[utilization['charging-ports'].isin([(2, 0), (4, 0), (6, 0), (8, 0)])].reset_index()
        plot_data['charging-ports'] = plot_data['charging-ports'].apply(str)

        fig, ax = plt.subplots(figsize=(8, 4))
        sns.barplot(data=plot_data, x='hour', y='connected', hue='charging-ports', palette="Spectral", ax=ax)
        ax.set_title('Charging ports utilization on weekdays')
        ax.set_xlabel('Hour')
        ax.set_ylabel('Utilization rate')
        ax.legend(ncol=2)
        ax.set_ylim(0, 1)
        sns.despine()
        fig.savefig(os.path.join(site_path, f'charging_ports_utilization_NoParkingLimit_{scenario}.png'), dpi=600, bbox_inches='tight')
    except Exception as e:
        print(f"Error generating figures: {e}")

def output_results_to_csv(df, site_path, scenario):
    """Outputs analyzed results to CSV files."""
    number_of_vehicles = df['vehicle_id'].nunique()

    try:
        demand_df = df.pivot_table(index=['L2', 'L3', 'time'], columns='vehicle_id', values='charging_rate').sum(axis=1).reset_index()
        demand_df.rename(columns={0: 'total_charging_power'}, inplace=True)
        demand_df = demand_df.groupby(['L2', 'L3'])['total_charging_power'].max().fillna(0).reset_index()
        pivot_df = demand_df.pivot_table(index=['L3'], columns='L2', values='total_charging_power').fillna(0)
        pivot_df.insert(0, 'number_of_vehicles', number_of_vehicles)
        pivot_df.insert(0, 'metrics', 'peak_demand')
        pivot_df.to_csv(os.path.join(site_path, f'pivot_peak_demand_{scenario}.csv'))
    except KeyError:
        print('No charging rate data available.')

    waiting_df = df.groupby(['L2', 'L3', 'status'])['low_soc'].count().unstack().fillna(0).reset_index()
    try:
        pivot_waiting = waiting_df.pivot_table(index=['L3'], columns='L2', values='Waiting for station').fillna(0)
        pivot_waiting.insert(0, 'number_of_vehicles', number_of_vehicles)
        pivot_waiting.insert(0, 'metrics', 'waiting_for_station')
        pivot_waiting.to_csv(os.path.join(site_path, f'pivot_waiting_for_station_{scenario}.csv'))
    except KeyError:
        pivot_waiting = pd.DataFrame(0, index=pivot_df.index, columns=pivot_df.columns)
        pivot_waiting['number_of_vehicles'] = number_of_vehicles
        pivot_waiting['metrics'] = 'waiting_for_station'
        pivot_waiting.to_csv(os.path.join(site_path, f'pivot_waiting_for_station_{scenario}.csv'))

    utilization_df = df[(df['time'] > '2024-02-15') & (df['time'] < '2024-03-01')].pivot_table(index=['L2', 'L3', 'time'], columns='vehicle_id', values='connected').sum(axis=1).reset_index()
    utilization_df.rename(columns={0: 'connected'}, inplace=True)
    utilization_df['total_charging_ports'] = utilization_df['L2'] + utilization_df['L3']
    utilization_df['utilization'] = utilization_df['connected'] / utilization_df['total_charging_ports']
    utilization_df['time'] = pd.to_datetime(utilization_df['time'])
    utilization_df['hour'] = utilization_df['time'].dt.hour.astype(int)
    utilization_df['weekday'] = utilization_df['time'].dt.weekday
    utilization_df = utilization_df[utilization_df['weekday'] < 5].groupby(['L2', 'L3', 'hour'])['utilization'].mean().reset_index()
    pivot_utilization = utilization_df.pivot_table(index=['L3'], columns='L2', values='utilization').fillna(0)
    pivot_utilization.insert(0, 'number_of_vehicles', number_of_vehicles)
    pivot_utilization.insert(0, 'metrics', 'utilization')
    pivot_utilization.to_csv(os.path.join(site_path, f'pivot_utilization_{scenario}.csv'))

    cost_df = utilization_df.groupby(['L2', 'L3']).mean().reset_index()
    cost_df['installation_cost'] = cost_df['L2'] * 10000 + cost_df['L3'] * 25000
    pivot_cost = cost_df.pivot_table(index=['L3'], columns='L2', values='installation_cost').fillna(0)
    pivot_cost.insert(0, 'number_of_vehicles', number_of_vehicles)
    pivot_cost.insert(0, 'metrics', 'cost')
    pivot_cost.to_csv(os.path.join(site_path, f'pivot_cost_{scenario}.csv'))

def process_site_data(site, site_path, adoption_rates):
    """Processes data for a specific site and saves results."""
    for adoption_rate in adoption_rates:
        df = clean_dataframe(site_path, f'vehicle_status_normal_{adoption_rate}.csv')
        df['L2'], df['L3'] = df['L2'] / 2, df['L3'] / 3
        output_results_to_csv(df, site_path, adoption_rate)
        
    combined_df = pd.concat(
        [pd.read_csv(os.path.join(site_path, f'pivot_{metric}_{rate}.csv')).assign(adoption_rate=rate) 
         for metric in ['cost', 'waiting_for_station', 'peak_demand', 'utilization'] 
         for rate in adoption_rates], 
        ignore_index=True
    )

    combined_df =  combined_df.melt(id_vars=['adoption_rate', 'metrics', 'number_of_vehicles', 'L3'], var_name='L2', value_name='value').pivot_table(
        index=['adoption_rate', 'number_of_vehicles', 'L3', 'L2'], columns='metrics', values='value').reset_index()
    
    # Remove the rows with 'L2' and 'L3' values all equal to 0
    combined_df['L2'] = combined_df['L2'].astype(float)
    combined_df['L3'] = combined_df['L3'].astype(float)
    combined_df = combined_df.loc[(combined_df['L2'] > 0) | (combined_df['L3'] > 0)]
    combined_df.pipe(calc_weighted_score).to_csv(os.path.join(site_path, 'melted_results_adoption_rate.csv'), index=False)

    print(f"Analysis completed for site {site}")


if __name__ == "__main__":
    temp_dir = os.getcwd() + "\\python-backend\\scripts\\post-process\\temp" # NOTE: base directory is in the server directory
    print(temp_dir)
    process_site_data("site", os.path.join(temp_dir), ['temp'])
