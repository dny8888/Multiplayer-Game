export default function renderScreen(screen, game, requestAnimationFrame) {
    const context = screen.getContext('2d');

    const tamRect = 1;

    context.clearRect(0, 0, 10, 10);
    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];
        context.fillStyle = 'black';
        context.fillRect(player.x, player.y, tamRect, tamRect);
    }
    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];
        context.fillStyle = 'red';
        context.fillRect(fruit.x, fruit.y, tamRect, tamRect);
    }
    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame)
    });
};