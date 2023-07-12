import socketio
from spherov2 import scanner
from spherov2.sphero_edu import SpheroEduAPI
import time
from spherov2.sphero_edu import EventType
from spherov2.types import Color
from spherov2.sphero_edu import IntEnum


sio = socketio.Client()
toy = None

@sio.event
def connect():
    print('Connected to server')
    sendMessage()

@sio.event
def disconnect():
    print('Disconnected from server')

@sio.event
def on_ball_control(data):
    data = int(data) + 1
    print(data)
    print(type(data))


    if toy==None:
        print("No ball")
    try:
        with SpheroEduAPI(toy) as api:
            terminalSpeed = 100
            api.set_speed(0)
            print('rolling')
            api.set_heading(data)
            api.set_speed(terminalSpeed)
            time.sleep(0.2)
            for k in range(terminalSpeed, 0, -5):
                api.set_speed(k)
                time.sleep(0.005)
            api.set_speed(0)
            print("Done")
            return
    except:
        print("Error")
        pass
    print("Done wrong somehow")

@sio.event
def sendMessage():
    print("Sending")
    sio.emit('move_ball', '1')
    print("Sent")


def setColour(api, color):
    try:
    
        api.set_main_led(color)
    
    except:
        print("Cant set colour")


def spinnySpin(api, angle, duration):
    try:
        with SpheroEduAPI(toy) as api:
            api.spin(angle, duration)
    
    except:
        print("Cant spin")

def playAnim(int):
    try:
        with SpheroEduAPI(toy) as api:
            api.play_animation(IntEnum.EMOTE_ALARM)

    except:
        print("Cant play anim")

def on_collision(api):
    try:
        setColour(api, Color(r= 255, g= 255, b= 255))
        api.play_animation(IntEnum.EMOTE_ALARM)

    except:
        print("Collion fail")
        


if __name__ == '__main__':
    toy = scanner.find_BB8()
    if toy == None:
        print("No toy found")
    else:
        print(f"Toy: {toy.name} found")
        SpheroEduAPI(toy).register_event(EventType.on_collision, on_collision)
        busyRunning = False
        sio.connect('https://server-bbd-vac-week.onrender.com')
        sio.wait()
