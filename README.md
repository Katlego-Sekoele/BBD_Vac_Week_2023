# Methods
## getMap(image)
Returns a map of the current environment in a digital format.
Format: 
```json
{
    "ball": {x, y},
    "cones": [
        "Player1": {x, y},
        "Player2": {x, y},
        "Player3": {x, y},
        "Player4": {x, y}
    ],
    "dimension": {width, height}
}
```

NOTE: If a player has been eliminated, their cone coordinates will be $[-1, -1]$