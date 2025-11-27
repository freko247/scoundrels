import { Game } from '../src/game.js';
import { Card } from '../src/card.js';
import { Storage } from '../src/storage.js';

// Mock localStorage
global.localStorage = {
    getItem: () => null,
    setItem: () => { },
    clear: () => { }
};

// Mock UI
class MockUI {
    constructor() {
        this.roomContainerHTML = '';
    }
    updateStats() { }
    renderRoom() {
        this.roomContainerHTML = 'CARDS_RENDERED';
        console.log("UI: Rendered Room");
    }
    showMessage() { }
    showGameOver(won, score) {
        this.roomContainerHTML = won ? 'VICTORY' : 'DEFEAT';
        console.log(`UI: Show Game Over (${this.roomContainerHTML})`);
    }
    bindNewGame() { }
    bindCardClick() { }
    bindSkipRoom() { }
    updateSkipButton() { }
    bindRules() { }
    bindHistory() { }
}

const ui = new MockUI();
const game = new Game(ui);

console.log("Starting Game Over Bug Test...");

game.start();
game.health = 5;
// Monster with 10 damage
const monster = new Card('♠', '10');
game.room = [monster];

// Fight barehanded -> Take 10 damage -> Health -5 -> Game Over
game.playCard(0, false);

// Check UI state
if (ui.roomContainerHTML === 'DEFEAT') {
    console.log("Test Passed: Game Over message is visible");
} else if (ui.roomContainerHTML === 'CARDS_RENDERED') {
    console.error("Test Failed: Game Over message was overwritten by renderRoom");
} else {
    console.error(`Test Failed: Unexpected UI state: ${ui.roomContainerHTML}`);
}
