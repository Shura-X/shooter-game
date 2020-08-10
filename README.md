# shooter-game
This is one of my projects to polish my JS-skills. But it is still a playable game to spend some time.

## Installation
This project works in browser environment. But staic server is required to run the module system.
See more [here](https://www.npmjs.com/package/static-server#getting-started).

* Install [Node.js](https://nodejs.org/en/)
* Install npm package globally
* Go to the folder with the game ```npm -g install static-server```
* Run the server with the command ```static-server```

## File system
The entry point for the app is the ```index.html``` file. It depends on following modules:

1. ```player.js``` - this module defines player's movement on the field, reaction to the mouse movements
and renders player's texture. This module exports ```Player``` constructor, which receives start
positions X and Y and the context of HTML Canvas element. ```player.js``` has no dependencies. API:
* ```wasd_down(event)``` - event handler for the keydown event
* ```wasd_up(event)``` - event handler for the keyup event
* ```mousemouve(event)``` - event handler for the mousemove event (or pointermove)
* ```doc_unfocus(event)``` - event handler for the blur event on the ```window``` object
* ```render()``` - method for rendering the player in ```window.requestAnimationFrame()```

2. ```enemies.js``` - this module defines enemies' movements on the field, generation of the enemies,
their 'death' and it renders the enemies. This module exports ```Enemies``` constructor, which receives
player object and the context of the HTML Canvas element. ```enemies.js``` has no dependencies. API:
* ```go()``` - method for rendering the enemies in ```window.requestAnimationFrame()```

3. ```shots.js``` - this modules defines shot's movement on the field, their generation and their interaction
with the player and the enemies. This module exports ```Shots``` constructor, whick receives player and enemies
objects and the context of the HTML Canvas element. ```shots.js``` has no dependencies. API:
* ```on_click(event)``` - event hanlder for the click event
* ```go()``` - method for rendering the shots in ```window.requestAnimationFrame()```