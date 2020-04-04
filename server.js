import express from 'express';
import http from 'http';
import createGame from './public/game.js';
import socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

app.use(express.static('public'));


const game = createGame();
game.start();

game.subscribe((command) => {
    console.log(`> Emitting ${command.type}`)
    sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
    const playerId = socket.id;
    console.log(`> Player connected on server with id: ${playerId}`);

    game.addPlayer({ playerId });
    console.log(game.state);

    socket.emit('setup', game.state);

    socket.on('disconnect', () => {
        game.removePlayer({ playerId });
        console.log(`> Player with id: ${playerId} disconnected`);
    });

    socket.on('movePlayer', (command) => {
        command.playerId = playerId
        command.type = 'movePlayer'

        game.movePlayer(command)
    })
})


server.listen(3000, '192.168.1.9', () => {
    console.log(`> Server listening on port: 3000`)
})