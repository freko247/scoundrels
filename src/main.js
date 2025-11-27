import { Game } from './game.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const game = new Game(ui);

    // Bind UI events to Game actions
    ui.bindNewGame(() => game.start());
    ui.bindSkipRoom(() => game.skipRoom());
    ui.bindCardClick((index, useWeapon) => game.playCard(index, useWeapon));

    // Bind rules button
    ui.bindRules();

    // Start the game
    game.start();
});
