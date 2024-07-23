import sys
import json
import pandas as pd
import numpy as np
import googlemaps
import urllib
import simplejson
import yaml
import requests
import random
import os
from datetime import datetime


# Setup google maps config and credentials

script_dir = os.path.dirname(__file__)
config_path = os.path.join(script_dir, "config.yaml")

try:
    with open(config_path, 'r') as ymlfile:
        cfg = yaml.safe_load(ymlfile)
except Exception as e:
    print(json.dumps({"status": "error", "message": f"Configuration error: {e}"}))
    sys.exit(1)
maps_config = cfg.get('google', {})
ryin_api = maps_config.get('api_key')
travel_base_url = maps_config.get('url')
gmaps = googlemaps.Client(key=ryin_api)

def get_travel_distance(empl, dest):
    # add employee geocode
    empl_geocode = gmaps.geocode(empl['zip_code'])

    try:
        empl_loc = empl_geocode[0]['geometry']['location']
        empl['geocode'] = "{},{}".format(empl_loc['lat'], empl_loc['lng'])
    except:
        print('No employee location found.')
        empl['geocode'] = None
    # add dest geo location to each employee data
    empl['dest'] = dest
    # get travel distance between employee home and workplace
    empl.update(getDistance(empl['geocode'], empl['dest'])['rows'][0]['elements'][0])

    return empl

def getDistance(origin, dest):

    url = travel_base_url.format(origin, dest)+'&key={}'.format(ryin_api)
    response = simplejson.load(urllib.request.urlopen(url))
    # print(response)

    return response

def process_data(data):
    # Note - no space between lat and lng
    dest_geocode = "37.871666,-122.272781" # geocode - Berkeley, CA

    # Create a list of json data for each vehicle and dump to json file
    empl_commute = []
    for empl in data:
        empl_commute.append(get_travel_distance(empl, dest_geocode))
    
    # return the processed data
    result = {"status": "success", "data": empl_commute}
    return result

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        output_data = process_data(input_data)
        print(json.dumps(output_data))
    except Exception as e:
        error_message = {"status": "error", "message": str(e)}
        print(json.dumps(error_message), file=sys.stderr)
        sys.exit(1)
