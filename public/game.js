export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    };

    const observers = [];

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    };

    function notifyAll(command) {
        for (const observerFunction of observers) {
            console.log(`Seu comando foi ${observers}`)
            observerFunction(command);
        };
    };

    function setState(newState) {
        Object.assign(state, newState);
    };

    function addPlayer(command) {
        const playerId = command.playerId;
        const playerX = "playerX" in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
        const playerY = "playerY" in command ? command.playerY : Math.floor(Math.random() * state.screen.height);

        state.players[playerId] = {
            x: playerX,
            y: playerY
        };
        notifyAll({
            type: 'addPlayer',
            playerId,
            playerX,
            playerY
        });

    };

    function removePlayer(command) {
        const playerId = command.playerId;

        delete state.players[playerId];


        notifyAll({
            type: 'removePlayer',
            playerId
        });
    };


    function addFruit(command) {
        const fruitId = command.fruitId;
        const fruitX = command.fruitX;
        const fruitY = command.fruitY;

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }
    };
    function removeFruit(command) {
        const fruitId = command.fruitId;

        delete state.fruits[fruitId];
    };

    function movePlayer(command) {
        console.log(`game.movePlayer() => Moving ${command.playerId} with ${command.keyPressed}`)
        notifyAll(command);

        const acceptedMoves = {
            ArrowUp(player) {
                //console.log('game.movePlayer().ArrowUp() => Moving player up')
                if (player.y - 1 >= 0) {
                    player.y = player.y - 1;
                    console.log(`Y=${player.y}`);
                };
            },
            ArrowDown(player) {
                //console.log('game.movePlayer().ArrowDown() => Moving player Down')
                if (player.y + 1 < state.screen.height) {
                    player.y = player.y + 1;
                    console.log(`Y=${player.y}`);
                }
            },
            ArrowLeft(player) {
                //console.log('game.movePlayer().ArrowLeft() => Moving player Left')
                if (player.x - 1 >= 0) {
                    player.x = player.x - 1;
                    console.log(`X=${player.x}`);
                }
            },
            ArrowRight(player) {
                //console.log('game.movePlayer().ArrowRight() => Moving player Right')
                if (player.x + 1 < state.screen.width) {
                    player.x = player.x + 1;
                    console.log(`X=${player.x}`);
                }
            },
        };

        const keyPressed = command.keyPressed;
        const playerId = command.playerId
        const player = state.players[command.playerId];
        const moveFunction = acceptedMoves[keyPressed];

        if (player && moveFunction) {
            moveFunction(player);
            checkForFruitCollision(playerId);
        };

    };

    function checkForFruitCollision(playerId) {

        const player = state.players[playerId]

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId];
            console.log(`Checking ${playerId} and ${fruitId}`);

            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`Collision between ${playerId} and ${fruitId}`)
                removeFruit({ fruitId })
            };
        }

    };

    return {
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state,
        setState,
        subscribe
    };
};