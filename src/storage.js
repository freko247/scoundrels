export class Storage {
    constructor() {
        this.storageKey = 'scoundrels_scores';
    }

    saveScore(score, cardsLeft) {
        const history = this.getHistory();
        const record = {
            score: score,
            cardsLeft: cardsLeft,
            date: new Date().toISOString()
        };
        history.unshift(record); // Add to beginning
        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    getHistory() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    getHighScore() {
        const history = this.getHistory();
        if (history.length === 0) return 0;
        return Math.max(...history.map(r => r.score));
    }
}
