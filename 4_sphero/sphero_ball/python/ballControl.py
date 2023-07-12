from spherov2 import scanner
from spherov2.sphero_edu import SpheroEduAPI
import time

toy = scanner.find_BB8()

global g_api

if toy == None:
    print("No toy found")
else:
    print(f"Toy {toy.name} found")


maxSpeed = 50
sleepTime = 5
print("olla")
time.sleep(10)
with SpheroEduAPI(toy) as api:
    print("casted, right")
    api.set_speed(0)
    api.set_heading(90)
    api.set_speed(50)
    time.sleep(2)

    api.set_speed(0)
    api.set_heading(0)

    print("left")
    api.set_heading(270)
    api.set_speed(50)
    time.sleep(2)
    

    # api.set_heading(0)
    # api.set_speed(150)
    # time.sleep(5)
    # api.play_animation(3)
    # print("zoom")
    # api.set_speed(150)
    # print("zoomed")
    # # time.sleep(3)
    # api.spin(360, 2)
    # print("done")
    # print("Starting While")
    # api.spin(360, 0.1)
    # api.set_speed(0)
    # print(1)
    # # input()
    # api.roll(1, speed, time)
    # api.set_speed(0)
    # print(2)
    # input()
    # api.roll(90, speed, time)

    # api.set_speed(0)
    # print(3)
    # input()
    # api.roll(180, speed, time)

    # api.set_speed(0)
    # print(4)
    # input()
    # api.roll(270, speed, time)
