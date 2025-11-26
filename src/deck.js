import { Card } from './card.js';

export class Deck {
    constructor() {
        this.cards = [];
        this.reset();
    }

    reset() {
        this.cards = [];
        const suits = ['♠', '♣', '♥', '♦'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        for (const suit of suits) {
            for (const rank of ranks) {
                // Remove Red Face Cards and Red Aces
                if ((suit === '♥' || suit === '♦') && ['J', 'Q', 'K', 'A'].includes(rank)) {
                    continue;
                }
                // Remove Jokers (not in ranks array anyway)

                this.cards.push(new Card(suit, rank));
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(count) {
        const drawn = [];
        for (let i = 0; i < count; i++) {
            if (this.cards.length > 0) {
                drawn.push(this.cards.pop());
            }
        }
        return drawn;
    }

    get count() {
        return this.cards.length;
    }

    add(cards) {
        this.cards.push(...cards);
    }

    getRemainingMonsterValue() {
        return this.cards.reduce((total, card) => {
            return total + (card.type === 'monster' ? card.value : 0);
        }, 0);
    }
}
