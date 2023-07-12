import socketio
from spherov2 import scanner
from spherov2.sphero_edu import SpheroEduAPI
import time
from spherov2.sphero_edu import EventType
from spherov2.types import Color
from spherov2.sphero_edu import IntEnum

import concurrent

sio = socketio.Client()
bot = None

# @sio.event
# def connect():
#     print('Connected to server')

# @sio.event
# def disconnect():
#     print('Disconnected from server')

# @sio.event
# def sendMessage():
#     print("Sending")
#     print("Sent")

# @sio.event
# def on_ball_control(data):
#     print("Received control: ", data)
#     data = int(data)
#     print(data)

if __name__ == '__main__':
    print("Connecting to server")
    sio.connect('https://server-bbd-vac-week.onrender.com')
    
    while True:
        print("Connecting to ball:")
        bot = scanner.find_BB8()
        print(f"BB8: {bot.name} found")

        with SpheroEduAPI(bot) as api:
            try:
                @sio.event
                def connect():
                    print('Connected to server')

                @sio.event
                def disconnect():
                    print('Disconnected from server')

                @sio.event
                def sendMessage():
                    print("Sending")
                    print("Sent")

                @sio.event
                def on_ball_control(data):
                    try:
                        print("Received control: ", data)
                        data = int(data)
                        print(data)
                        # api.spin(data, 1)
                        api.set_heading(data)
                        api.set_speed(50)
                    except concurrent.futures._base.TimeoutError:
                        print("qwertyuiop")


                api.spin(360, 1)
                sio.wait()
            except concurrent.futures._base.TimeoutError:
                print("reconnecting to the ball.")
                continue
