import { Game } from './game.js';
import { UI } from './ui.js';
import { setLocale } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const game = new Game(ui);

    // Bind UI events to Game actions
    ui.bindNewGame(() => game.start());
    ui.bindSkipRoom(() => game.skipRoom());
    ui.bindCardClick((index, useWeapon) => game.playCard(index, useWeapon));

    // Bind rules button
    ui.bindRules();

    // Bind history button
    ui.bindHistory(() => game.storage.getHistory());

    // Bind language selector
    const languageSelector = document.getElementById('language-selector');
    languageSelector.addEventListener('change', (e) => {
        setLocale(e.target.value);
        // Re-render current state to update dynamic strings
        game.updateUI();
    });

    // Initialize language
    setLocale('en');

    // Start the game
    game.start();
});
