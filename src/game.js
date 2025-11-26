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
            this.finishTurn(index, message);
        } else if (card.type === 'weapon') {
            this.weapon = card;
            this.lastFoughtValue = 0;
            message = `Equipped ${card.toString()}.`;
            this.finishTurn(index, message);
        } else if (card.type === 'monster') {
            // Combat
            if (this.weapon) {
                // Check if weapon can be used
                // Rule: Cannot use weapon if monster value >= last monster defeated by weapon
                const weaponIneffective = (this.lastFoughtValue > 0 && card.value >= this.lastFoughtValue);

                if (weaponIneffective) {
                    // Must fight barehanded (or weapon is ineffective)
                    this.resolveCombat(card, index, false, true); // ineffective = true
                } else {
                    // Weapon IS effective. User has a CHOICE.
                    this.ui.showChoice((useWeapon) => {
                        this.resolveCombat(card, index, useWeapon, false);
                    });
                    return; // Stop execution here, wait for callback
                }
            } else {
                // No weapon, fight barehanded
                this.resolveCombat(card, index, false, false);
            }
        }
    }

    resolveCombat(card, index, useWeapon, weaponIneffective) {
        let message = "";
        let damage = card.value;

        if (weaponIneffective) {
            message = `Weapon ineffective! Took ${damage} damage.`;
            this.health -= damage;
        } else if (useWeapon) {
            const damageTaken = Math.max(0, damage - this.weapon.value);
            this.health -= damageTaken;
            this.lastFoughtValue = card.value;
            message = `Fought with weapon. Took ${damageTaken} damage.`;
        } else {
            // Barehanded (voluntary or no weapon)
            this.health -= damage;
            message = `Fought barehanded. Took ${damage} damage.`;
        }

        this.finishTurn(index, message);
    }

    finishTurn(index, message) {
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
            score = 0;
        }
        this.ui.showGameOver(won, score);
    }

    updateUI() {
        this.ui.updateStats(this.health, this.weapon, this.lastFoughtValue, this.deck.count + this.room.length);
        this.ui.renderRoom(this.room);
    }
}
