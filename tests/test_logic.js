import { Game } from '../src/game.js';
import { Card } from '../src/card.js';
import { Deck } from '../src/deck.js';

// Mock UI
class MockUI {
    updateStats() { }
    renderRoom() { }
    showMessage() { }
    showGameOver() { }
    bindNewGame() { }
    bindCardClick() { }
}

const game = new Game(new MockUI());

// Test 1: Deck initialization
game.start();
// 52 - 12 (red face) - 2 (red aces) = 38?
// Wait. 
// Suits: 4. Ranks: 13. Total: 52.
// Red Face: J, Q, K of Hearts, Diamonds. 3 * 2 = 6.
// Red Aces: A of Hearts, Diamonds. 1 * 2 = 2.
// Total removed: 6 + 2 = 8.
// 52 - 8 = 44.
if (game.deck.cards.length + game.room.length === 44) {
    console.log(`Test 1 Passed: Deck size is ${game.deck.cards.length + game.room.length}`);
} else {
    console.error(`Test 1 Failed: Deck size is ${game.deck.cards.length + game.room.length}`);
}

// Test 2: Damage calculation
game.start();
game.health = 20;
// Mock a monster card
const monster = new Card('♠', '5'); // 5 damage
game.room = [monster];
game.playCard(0);
if (game.health === 15) {
    console.log("Test 2 Passed: Took 5 damage from monster");
} else {
    console.error(`Test 2 Failed: Health is ${game.health}, expected 15`);
}

// Test 3: Weapon usage
game.start();
game.health = 20;
const weapon = new Card('♦', '7'); // Weapon 7
game.room = [weapon];
game.playCard(0); // Equip
if (game.weapon === weapon) {
    console.log("Test 3a Passed: Weapon equipped");
} else {
    console.error("Test 3a Failed: Weapon not equipped");
}

const monster2 = new Card('♠', '5'); // 5 damage
game.room = [monster2];
game.playCard(0); // Fight with weapon (7) vs monster (5). Damage = max(0, 5-7) = 0.
if (game.health === 20) {
    console.log("Test 3b Passed: Took 0 damage with weapon");
} else {
    console.error(`Test 3b Failed: Health is ${game.health}, expected 20`);
}

// Test 4: Weapon restriction
// Last fought was 5. Next monster must be < 5.
const monsterStrong = new Card('♠', '8'); // 8 damage.
// Rule: "cannot be used ... if that monster's value is EQUAL TO OR GREATER THAN the last monster the weapon defeated"
// Last defeated: 5.
// New monster: 8. 8 >= 5. So CANNOT use weapon.
// Damage taken: 8 (barehanded).
game.room = [monsterStrong];
game.playCard(0);
if (game.health === 12) { // 20 - 8 = 12
    console.log("Test 4 Passed: Weapon restricted, took full damage");
} else {
    console.error(`Test 4 Failed: Health is ${game.health}, expected 12`);
}

// Test 5: Healing
game.health = 10;
const potion = new Card('♥', '5');
game.room = [potion];
game.playCard(0);
if (game.health === 15) {
    console.log("Test 5 Passed: Healed 5 HP");
} else {
    console.error(`Test 5 Failed: Health is ${game.health}, expected 15`);
}

console.log("All tests completed.");
