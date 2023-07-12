import socketio
from spherov2 import scanner
from spherov2.sphero_edu import SpheroEduAPI

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
    # input()
    if toy==None:
        print("No ball")
    try:
        with SpheroEduAPI(toy) as api:
            speed = 255
            api.set_speed(0)
            print('rolling')
            api.roll(data, 255, 1)
    except:
        print("Error")
        pass
    print("Done")

@sio.event
def sendMessage():
    print("Sending")
    sio.emit('move_ball', '1')
    print("Sent")


if __name__ == '__main__':
    toy = scanner.find_BB8()
    if toy == None:
        print("No toy found")
    else:
        print(f"Toy: {toy.name} found")

    sio.connect('https://server-bbd-vac-week.onrender.com')
    sio.wait()
