import { Game } from './game.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const game = new Game(ui);
    
    // Bind UI events to Game actions
    ui.bindNewGame(() => game.start());
    ui.bindCardClick((index) => game.playCard(index));
    
    // Start the game
    game.start();
});
