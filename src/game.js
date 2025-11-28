import { Deck } from './deck.js';
import { Storage } from './storage.js';
import { t } from './i18n.js';

export class Game {
    constructor(ui) {
        this.ui = ui;
        this.deck = new Deck();
        this.storage = new Storage();
        this.health = 20;
        this.maxHealth = 20;
        this.weapon = null;
        this.lastFoughtValue = 0;
        this.room = [];
        this.cardsPlayedInRoom = 0;
        this.canSkipRoom = true;
        this.gameOver = false;
    }

    start() {
        this.deck.reset();
        this.health = 20;
        this.weapon = null;
        this.lastFoughtValue = 0;
        this.room = [];
        this.cardsPlayedInRoom = 0;
        this.canSkipRoom = true;
        this.gameOver = false;

        this.dealRoom();
        this.updateUI();
        this.ui.showMessage(t('WELCOME_MSG'));
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

    skipRoom() {
        if (!this.canSkipRoom || this.gameOver) return;

        // Move current room cards to bottom of deck
        this.deck.addBottom(this.room);
        this.room = [];

        // Disable skipping for next turn
        this.canSkipRoom = false;

        this.dealRoom();
        this.updateUI();
        this.ui.showMessage(t('ROOM_SKIPPED_MSG'));
    }

    playCard(index, useWeapon = false) {
        if (this.gameOver) return;
        if (index < 0 || index >= this.room.length) return;

        const card = this.room[index];
        let message = "";

        if (card.type === 'potion') {
            const healAmount = card.value;
            const oldHealth = this.health;
            this.health = Math.min(this.health + healAmount, this.maxHealth);
            message = t('HEALED_MSG', { amount: this.health - oldHealth });
            this.finishTurn(index, message);
        } else if (card.type === 'weapon') {
            this.weapon = card;
            this.lastFoughtValue = 0;
            message = t('EQUIPPED_MSG', { card: card.toString() });
            this.finishTurn(index, message);
        } else if (card.type === 'monster') {
            // Combat
            // useWeapon is passed directly from UI

            // Validation (double check)
            if (useWeapon && this.weapon) {
                const weaponIneffective = (this.lastFoughtValue > 0 && card.value >= this.lastFoughtValue);
                if (weaponIneffective) {
                    // Should be disabled in UI, but fallback to barehanded or error
                    // Let's treat as barehanded for safety or just process as ineffective weapon usage?
                    // Rule: "You cannot use a weapon..." -> implies action is invalid.
                    // But let's assume UI handles it and if they somehow click it, it fails or goes barehanded.
                    // Let's stick to the logic: if they try to use it and it's ineffective, they take full damage (as per previous logic, but maybe that was just 'ineffective weapon' flavor text).
                    // Actually, previous logic was: if ineffective, AUTOMATICALLY fight barehanded/take full damage.
                    // Now user explicitly chooses.

                    // If they explicitly chose weapon but it's ineffective, we can either block it or punish.
                    // Given UI disables the button, this is a fallback.
                    this.resolveCombat(card, index, false, true); // Treat as ineffective
                } else {
                    this.resolveCombat(card, index, true, false);
                }
            } else {
                // Barehanded
                this.resolveCombat(card, index, false, false);
            }
        }
    }

    resolveCombat(card, index, useWeapon, weaponIneffective) {
        let message = "";
        let damage = card.value;

        if (weaponIneffective) {
            message = t('WEAPON_INEFFECTIVE_MSG', { damage: damage });
            this.health -= damage;
        } else if (useWeapon) {
            const damageTaken = Math.max(0, damage - this.weapon.value);
            this.health -= damageTaken;
            this.lastFoughtValue = card.value;
            message = t('FOUGHT_WEAPON_MSG', { damage: damageTaken });
        } else {
            // Barehanded (voluntary or no weapon)
            this.health -= damage;
            message = t('FOUGHT_BAREHAND_MSG', { damage: damage });
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
                this.canSkipRoom = true; // Re-enable skipping after clearing a room
                this.dealRoom();
                this.updateUI();
                this.ui.showMessage(t('NEW_ROOM_MSG'));
            }, 500);
        } else if (this.room.length === 0 && this.deck.count === 0) {
            this.endGame(true);
        }
    }

    endGame(won) {
        this.gameOver = true;
        let score = this.health;
        if (!won) {
            const deckMalus = this.deck.getRemainingMonsterValue();
            const roomMalus = this.room.reduce((total, card) => {
                return total + (card.type === 'monster' ? card.value : 0);
            }, 0);
            score = -(deckMalus + roomMalus);
        }

        // Save score
        this.storage.saveScore(score, this.deck.count + this.room.length);

        this.ui.showGameOver(won, score);

        // Update stats only, do NOT call updateUI() which re-renders room
        const highScore = this.storage.getHighScore();
        this.ui.updateStats(this.health, this.weapon, this.lastFoughtValue, this.deck.count + this.room.length, highScore);
    }

    updateUI() {
        const highScore = this.storage.getHighScore();
        this.ui.updateStats(this.health, this.weapon, this.lastFoughtValue, this.deck.count + this.room.length, highScore);
        this.ui.renderRoom(this.room, this.weapon, this.lastFoughtValue);
        this.ui.updateSkipButton(this.canSkipRoom);
    }
}
