export class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    get value() {
        if (this.rank === 'J') return 11;
        if (this.rank === 'Q') return 12;
        if (this.rank === 'K') return 13;
        if (this.rank === 'A') return 14;
        return parseInt(this.rank);
    }

    get type() {
        if (this.suit === '♥') return 'potion';
        if (this.suit === '♦') return 'weapon';
        return 'monster'; // ♠ or ♣
    }

    get color() {
        return (this.suit === '♥' || this.suit === '♦') ? 'red' : 'black';
    }

    toString() {
        return `${this.rank}${this.suit}`;
    }
}
