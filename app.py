from flask import Flask, jsonify, request, render_template
from time import gmtime, strftime

import json
import requests
import math
import random
from datetime import datetime, timedelta
from settings import *

app = Flask(__name__, static_folder='static', static_url_path='')

base = "/weather/<city>/<date>/<hour_minute>/"

@app.route("/", methods = ['GET'])
def request_front_end():
        return render_template('front-end.html', title='project')


@app.route("/weather/", methods=['GET'])
@app.route(base, methods=['GET'])
def request_general(city, date, hour_minute):
    time_input = datetime.strptime(date + hour_minute, '%Y%m%d%H%M')
    if (time_input < datetime.now()):
        return "You've Asked For History Weather! Please Change The Date."
    else:
        r = requests.get(WEATHER_API.format(city))
        json_data = json.loads(r.text)
        for element in json_data['list']:
            if( (time_input + timedelta( hours = 3)) < datetime.strptime(element['dt_txt'], '%Y-%m-%d %H:%M:%S')):
                return jsonify(description = element['weather'][0]['description'],
                        temprature = str(math.ceil(element['main']['temp'])) + 'C',
                        pressure = str(element['main']['pressure']),
                        humidity = str(element['main']['humidity']) + '%')
        return "Out of current data range!"

@app.route(base + "<detail>/", methods=['GET'])
def request_detail(city, date, hour_minute, detail):
    time_input = datetime.strptime( date + hour_minute, '%Y%m%d%H%M')
    if (time_input < datetime.now()):
        return "You asked for history temprature"
    else:
        r = requests.get(WEATHER_API.format(city))
        json_data = json.loads(r.text)
        for element in json_data['list']:
            if ( (time_input + timedelta( hours = 3)) < datetime.strptime(element['dt_txt'], '%Y-%m-%d %H:%M:%S')):
                if (detail == 'temprature'):
                    return jsonify( temprature = str(math.ceil(element['main']['temp'])) + 'C')
                elif (detail == 'pressure'):
                    return jsonify( pressure = str(element['main']['pressure']))
                elif (detail == 'humidity'):
                    return jsonify(humidity = str(element['main']['humidity']) + '%')
                else:
                    return show_error(time_input)
        return "Out of current data range!"


def show_error(time_input):
    return jsonify( {'status': 'error', 'message': "No data for "+ str(time_input) })
