from spherov2 import scanner
from spherov2.sphero_edu import SpheroEduAPI

toy = scanner.find_BB8()

if toy == None:
    print("No toy found")
else:
    # print(f"Toy: {toy.type} found")
    print(f"Toy: {toy.name} found")

speed = 255
time = 0.5
with SpheroEduAPI(toy) as api:
    # api.spin(360, 0.1)
    api.set_speed(0)
    print(1)
    input()
    api.roll(1, speed, time)

    api.set_speed(0)
    print(2)
    input()
    api.roll(90, speed, time)

    api.set_speed(0)
    print(3)
    input()
    api.roll(180, speed, time)

    api.set_speed(0)
    print(4)
    input()
    api.roll(270, speed, time)
