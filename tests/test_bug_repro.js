import { Game } from '../src/game.js';
import { Card } from '../src/card.js';

// Mock UI
class MockUI {
    updateStats() { }
    renderRoom(cards, weapon, lastFoughtValue) {
        console.log(`renderRoom called. Weapon: ${weapon}, LastFought: ${lastFoughtValue}`);
        cards.forEach(card => {
            if (card.type === 'monster') {
                const canUse = weapon && (lastFoughtValue === 0 || card.value < lastFoughtValue);
                console.log(`Monster ${card.toString()} (val ${card.value}): Can use weapon? ${canUse}`);
            }
        });
    }
    showMessage() { }
    showGameOver() { }
    bindNewGame() { }
    bindCardClick() { }
    bindSkipRoom() { }
    updateSkipButton() { }
    bindRules() { }
}

const game = new Game(new MockUI());
game.start();

// 1. Set up room with Weapon and Monster
const weaponCard = new Card('♦', '7');
const monsterCard = new Card('♠', '5');
game.room = [weaponCard, monsterCard];

console.log("Initial state:");
game.updateUI();

// 2. Pick up weapon (index 0)
console.log("Picking up weapon...");
game.playCard(0);
