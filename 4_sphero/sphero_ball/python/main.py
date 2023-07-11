import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('Connected to server')
    sendMessage()

@sio.event
def disconnect():
    print('Disconnected from server')

@sio.event
def message(data):
    print('Received message:', data)

def sendMessage():
    sio.emit('message', "Olla :)")


if __name__ == '__main__':
    sio.connect('https://server-bbd-vac-week.onrender.com')
    sio.wait()
