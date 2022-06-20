from flask import Flask, render_template
from waterRefillDetection import run1
from dirtyPlateDetection import run2
from freeOccupiedDetection import freeOccupied
from colours import colours
from decision import decision
from flask_socketio import SocketIO, emit
from random import random
from time import sleep
from flask_cors import CORS
import cv2
import urllib.request
import numpy as np
import time
url='http://192.168.1.74/capture?_cb=1649747186380'


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
cors = CORS(app)

# app.register_blueprint(water)
values = {
    'slider1': 25,
    'slider2': 0,
}

@app.route("/capture")
def capture_photo():
    img_resp=urllib.request.urlopen(url)
    imgnp=np.array(bytearray(img_resp.read()),dtype=np.uint8)
    img = cv2.imdecode(imgnp,-1)
    img_name = "base_photo_.png"
    cv2.imwrite(img_name, img)
    print("{} written!".format(img_name))
    return img

@app.route("/")
def index():
    return render_template('index.html', **values)

@socketio.on('connect')
def test_connect():
    emit('after connect',  {'data':'Connected'})

@socketio.on('Slider value changed')
def value_changed(message, ):
    t0 = time.time()
    t1 = time.time()
    waterqueue = []
    platequeue = []
    occupancyqueue = []
    decisionqueue=[]
    calibration_img = capture_photo()
    i = 0
    tempTest = [
        {'status': "Available" , 'colour': "green"},
        {'status': "Occupied" , 'colour': "blue"},
        {'status': "Need refill" , 'colour': "red"}
    ]
    print("In here")
    while True:
        # if (time.time() > t1+5):
        #     i = i%3
        #     emit('update value', tempTest[i], broadcast=True)
        #     t1 = time.time()
        #     i += 1
        img_resp=urllib.request.urlopen(url)
        imgnp=np.array(bytearray(img_resp.read()),dtype=np.uint8)
        img = cv2.imdecode(imgnp,-1)
        # print(img)
        if not img.all():
            water_level = run1(img)
            waterqueue.append(water_level) 
            occupancy = freeOccupied(img)
            occupancyqueue.append(occupancy)
            plateStatus  = run2(img)
            platequeue.append(plateStatus)
            if (time.time() > t0+5):
                people = max(set(occupancyqueue), key=occupancyqueue.count)
                # emit('update value', people, broadcast=True)
                decisionqueue.append(people)
                print(people)
                waterlevelavg = max(set(waterqueue), key=waterqueue.count)
                # emit('update value', waterlevelavg, broadcast=True)
                decisionqueue.append(waterlevelavg)
                print(waterlevelavg)
                plate_stat = max(set(platequeue), key=platequeue.count)
                decisionqueue.append(plate_stat)
                print(plate_stat)
                occupancyqueue.clear()
                waterqueue.clear()
                platequeue.clear()
                t0 = time.time()
                if len(decisionqueue) == 3:
                    print(decisionqueue)
                    decision_status = decision(decisionqueue)
                    objectcolours = colours(decision_status)
                    emit('update value', objectcolours, broadcast=True)
                    decisionqueue.clear()



def randomString():
    #infinite loop of magical random numbers
    number = round(random()*10, 3)
    return str(number)


@app.route("/status")
def status():
    return{"status": "Available"}

@app.route("/message")
def message():

    return{"message": "Need Refill of Water"}


if __name__ == "__main__":
    socketio.run(app, debug=True)
