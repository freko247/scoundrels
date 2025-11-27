import { Game } from '../src/game.js';
import { Storage } from '../src/storage.js';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        }
    };
})();

global.localStorage = localStorageMock;

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
    bindHistory() { }
}

const game = new Game(new MockUI());

console.log("Starting Score History Tests...");

// Test 1: Save Score
game.start();
game.health = 0; // Force game over
game.endGame(false);

const history = game.storage.getHistory();
if (history.length === 1 && history[0].score <= 0) {
    console.log("Test 1 Passed: Score saved to history");
} else {
    console.error("Test 1 Failed: Score not saved correctly", history);
}

// Test 2: High Score
game.start();
game.health = 20;
game.endGame(true); // Win with 20 HP

const highScore = game.storage.getHighScore();
if (highScore === 20) {
    console.log("Test 2 Passed: High score updated correctly");
} else {
    console.error(`Test 2 Failed: High score is ${highScore}, expected 20`);
}

// Test 3: Multiple Scores
game.start();
game.health = 10;
game.endGame(true); // Win with 10 HP

const history2 = game.storage.getHistory();
if (history2.length === 3) {
    console.log("Test 3 Passed: Multiple scores saved");
    // Check order (newest first)
    if (history2[0].score === 10 && history2[1].score === 20) {
        console.log("Test 3b Passed: History order correct");
    } else {
        console.error("Test 3b Failed: History order incorrect", history2);
    }
} else {
    console.error(`Test 3 Failed: History length is ${history2.length}, expected 3`);
}

console.log("Tests finished.");
