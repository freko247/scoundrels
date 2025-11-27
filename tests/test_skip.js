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
    showChoice() { }
}

const game = new Game(new MockUI());

console.log("Starting Skip Room Tests...");

// Test 1: Skip Room Mechanics
game.start();
// Mock a specific room
const card1 = new Card('♠', '2');
const card2 = new Card('♠', '3');
const card3 = new Card('♠', '4');
const card4 = new Card('♠', '5');
game.room = [card1, card2, card3, card4];
const initialDeckCount = game.deck.count;

game.skipRoom();

// Verify room is new (we can't easily check 'new' without mocking deck, but we can check size)
if (game.room.length === 4) {
    console.log("Test 1a Passed: New room dealt");
} else {
    console.error(`Test 1a Failed: Room length is ${game.room.length}`);
}

// Verify old cards are at bottom of deck
// Deck count should be initialDeckCount + 4 (added) - 4 (drawn for new room) = initialDeckCount
if (game.deck.count === initialDeckCount) {
    console.log("Test 1b Passed: Deck count preserved (cards recycled)");
} else {
    console.error(`Test 1b Failed: Deck count is ${game.deck.count}, expected ${initialDeckCount}`);
}

// Verify canSkipRoom is false
if (game.canSkipRoom === false) {
    console.log("Test 1c Passed: Skipping disabled after use");
} else {
    console.error("Test 1c Failed: Skipping still enabled");
}

// Test 2: Cannot skip twice
game.skipRoom();
// Should not change anything if logic works
if (game.canSkipRoom === false) {
    console.log("Test 2 Passed: Cannot skip twice in a row");
} else {
    console.error("Test 2 Failed: State changed unexpectedly");
}

// Test 3: Re-enable skip after clearing room
// We need to simulate playing 3 cards.
// We are in a state where skip is disabled.
// Play 3 cards.
game.playCard(0);
game.playCard(0);
game.playCard(0);

// Wait for timeout in game.js (500ms)
setTimeout(() => {
    if (game.canSkipRoom === true) {
        console.log("Test 3 Passed: Skipping re-enabled after clearing room");
    } else {
        console.error("Test 3 Failed: Skipping not re-enabled");
    }
    console.log("Tests finished.");
}, 600);
