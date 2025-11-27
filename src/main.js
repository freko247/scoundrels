import { Game } from './game.js';
import { UI } from './ui.js';
import { Tutorial } from './tutorial.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const game = new Game(ui);
    const tutorial = new Tutorial(game, ui);

    // Bind UI events to Game actions
    ui.bindNewGame(() => game.start());
    ui.bindSkipRoom(() => game.skipRoom());
    ui.bindCardClick((index) => game.playCard(index));

    // Bind tutorial button
    document.getElementById('tutorial-btn').addEventListener('click', () => {
        tutorial.start();
    });

    // Start the game
    game.start();
});
