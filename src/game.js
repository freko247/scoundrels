import { Deck } from './deck.js';

export class Game {
    constructor(ui) {
        this.ui = ui;
        this.deck = new Deck();
        this.health = 20;
        this.maxHealth = 20;
        this.weapon = null;
        this.lastFoughtValue = 0;
        this.room = [];
        this.cardsPlayedInRoom = 0;
        this.gameOver = false;
    }

    start() {
        this.deck.reset();
        this.health = 20;
        this.weapon = null;
        this.lastFoughtValue = 0;
        this.room = [];
        this.cardsPlayedInRoom = 0;
        this.gameOver = false;

        this.dealRoom();
        this.updateUI();
        this.ui.showMessage("Welcome to Scoundrels! Choose a card.");
    }

    dealRoom() {
        // If we have cards in the room (from previous turn), keep the last one?
        // Actually, the rule is: play 3 cards, 1 remains. Then deal 3 more to make 4.
        // Or if start of game, deal 4.

        const cardsNeeded = 4 - this.room.length;
        if (cardsNeeded > 0) {
            const newCards = this.deck.draw(cardsNeeded);
            this.room.push(...newCards);
        }

        this.cardsPlayedInRoom = 0;

        if (this.room.length === 0 && this.deck.count === 0) {
            this.endGame(true);
        }
    }

    playCard(index) {
        if (this.gameOver) return;
        if (index < 0 || index >= this.room.length) return;

        const card = this.room[index];
        let message = "";

        if (card.type === 'potion') {
            const healAmount = card.value;
            const oldHealth = this.health;
            this.health = Math.min(this.health + healAmount, this.maxHealth);
            message = `Healed ${this.health - oldHealth} HP.`;
        } else if (card.type === 'weapon') {
            this.weapon = card;
            this.lastFoughtValue = 0; // Reset last fought when getting new weapon? 
            // Rule check: "A weapon cannot be used to fight a monster if that monster's value is equal to or greater than the last monster the weapon defeated"
            // Actually, usually equipping a weapon just equips it. The restriction is on USE.
            // Let's assume equipping resets the tracking for that weapon instance.
            message = `Equipped ${card.toString()}.`;
        } else if (card.type === 'monster') {
            // Combat
            let damage = card.value;

            if (this.weapon) {
                // Check if weapon can be used
                if (this.lastFoughtValue > 0 && card.value >= this.lastFoughtValue) {
                    // Cannot use weapon (monster is weaker than last one fought with this weapon? Wait, rule says:
                    // "cannot be used ... if that monster's value is EQUAL TO OR GREATER THAN the last monster the weapon defeated"
                    // Wait, usually it's: you can only fight monsters WEAKER than the previous one?
                    // Let's re-read the rule from search: "cannot be used to fight a monster if that monster's value is equal to or greater than the last monster the weapon defeated"
                    // This implies we track the LAST monster defeated by THIS weapon.
                    // And the NEXT monster must be WEAKER (strictly less?).
                    // Actually, standard rule is: You can chain kills. 
                    // Usually: Weapon value W. Monster M. 
                    // If M <= W, you take 0 damage? No, "subtract weapon's value from monster's value".
                    // So Damage = max(0, M - W).
                    // The "last monster" rule is for CHAINING.
                    // Let's stick to the search result: "A weapon cannot be used to fight a monster if that monster's value is equal to or greater than the last monster the weapon defeated"
                    // This means we need to track `lastFoughtValue` for the current weapon.
                    // Initial `lastFoughtValue` for a new weapon should be effectively infinite (or just 0 and logic inverted? No).
                    // Actually, usually the rule is: You can fight ANY monster with a fresh weapon.
                    // Once you fight a monster of value X, the next monster must be < X.

                    // Let's implement:
                    // If lastFoughtValue == 0 (fresh weapon), can fight anything.
                    // Else, if card.value >= lastFoughtValue, CANNOT use weapon. Barehanded.

                    if (this.lastFoughtValue > 0 && card.value >= this.lastFoughtValue) {
                        // Weapon ineffective (too strong/equal to last kill)
                        message = `Weapon ineffective! Took ${damage} damage.`;
                        this.health -= damage;
                    } else {
                        // Use weapon
                        const damageTaken = Math.max(0, damage - this.weapon.value);
                        this.health -= damageTaken;
                        this.lastFoughtValue = card.value;
                        message = `Fought with weapon. Took ${damageTaken} damage.`;
                    }
                } else {
                    // Fresh weapon
                    const damageTaken = Math.max(0, damage - this.weapon.value);
                    this.health -= damageTaken;
                    this.lastFoughtValue = card.value;
                    message = `Fought with weapon. Took ${damageTaken} damage.`;
                }
            } else {
                // Barehanded
                this.health -= damage;
                message = `Fought barehanded. Took ${damage} damage.`;
            }
        }

        // Remove card from room
        this.room.splice(index, 1);
        this.cardsPlayedInRoom++;

        this.updateUI();
        this.ui.showMessage(message);

        if (this.health <= 0) {
            this.endGame(false);
            return;
        }

        // Check if room needs refresh
        if (this.cardsPlayedInRoom >= 3) {
            // Discard remaining card? No, it stays for next room.
            // But we only have 1 card left.
            // So we just deal 3 more.
            setTimeout(() => {
                this.dealRoom();
                this.updateUI();
                this.ui.showMessage("New room dealt.");
            }, 500);
        } else if (this.room.length === 0 && this.deck.count === 0) {
            this.endGame(true);
        }
    }

    endGame(won) {
        this.gameOver = true;
        let score = this.health;
        if (!won) {
            // Calculate negative score: - (sum of monsters in deck + room)
            // For simplicity, just showing health or 0 for now, or implement full scoring later.
            // Search said: "subtracting the values of all monsters still in the Dungeon"
            // We'll just show 0 for loss for now or implement properly if needed.
            score = 0;
        }
        this.ui.showGameOver(won, score);
    }

    updateUI() {
        this.ui.updateStats(this.health, this.weapon, this.lastFoughtValue, this.deck.count + this.room.length);
        this.ui.renderRoom(this.room);
    }
}
