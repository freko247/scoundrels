import { Game } from '../src/game.js';
import { Card } from '../src/card.js';

// Mock UI
class MockUI {
    updateStats() { }
    renderRoom() { }
    showMessage() { }
    showGameOver() { }
    bindNewGame() { }
    bindCardClick() { }
    bindSkipRoom() { }
    updateSkipButton() { }
    bindRules() { }
}

const game = new Game(new MockUI());

console.log("Starting Inline Combat Tests...");

// Test 1: Direct Combat Choice (Weapon)
game.start();
game.health = 20;
const weapon = new Card('♦', '7'); // Weapon 7
game.room = [weapon];
game.playCard(0); // Equip

const monster = new Card('♠', '5'); // 5 damage
game.room = [monster];

// Simulate clicking "Weapon" button (useWeapon = true)
game.playCard(0, true);

if (game.health === 20) {
    console.log("Test 1 Passed: Took 0 damage with weapon (inline choice)");
} else {
    console.error(`Test 1 Failed: Health is ${game.health}, expected 20`);
}

// Test 2: Direct Combat Choice (Barehanded)
game.start();
game.health = 20;
const weapon2 = new Card('♦', '7');
game.room = [weapon2];
game.playCard(0); // Equip

const monster2 = new Card('♠', '5');
game.room = [monster2];

// Simulate clicking "Barehand" button (useWeapon = false)
game.playCard(0, false);

if (game.health === 15) {
    console.log("Test 2 Passed: Took 5 damage barehanded (inline choice)");
} else {
    console.error(`Test 2 Failed: Health is ${game.health}, expected 15`);
}

console.log("Tests finished.");
