export class UI {
    constructor() {
        this.healthEl = document.getElementById('health');
        this.weaponEl = document.getElementById('weapon');
        this.lastFoughtEl = document.getElementById('last-fought');
        this.cardsLeftEl = document.getElementById('cards-left');
        this.roomContainer = document.getElementById('room-container');
        this.messageArea = document.getElementById('message-area');
        this.resetBtn = document.getElementById('reset-btn');

        this.onCardClick = null;
    }

    bindNewGame(handler) {
        this.resetBtn.addEventListener('click', handler);
    }

    bindCardClick(handler) {
        this.onCardClick = handler;
    }

    updateStats(health, weapon, lastFought, cardsLeft) {
        this.healthEl.textContent = health;
        this.weaponEl.textContent = weapon ? `${weapon.rank}${weapon.suit} (${weapon.value})` : 'None';
        this.lastFoughtEl.textContent = lastFought;
        this.cardsLeftEl.textContent = cardsLeft;
    }

    renderRoom(cards) {
        this.roomContainer.innerHTML = '';
        cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = `card ${card.color}`;
            cardEl.innerHTML = `
                <div class="card-top">
                    <span>${card.rank}</span>
                    <span>${card.suit}</span>
                </div>
                <div class="card-center">${card.suit}</div>
                <div class="card-bottom">
                    <span>${card.rank}</span>
                    <span>${card.suit}</span>
                </div>
            `;

            cardEl.addEventListener('click', () => {
                if (this.onCardClick) {
                    this.onCardClick(index);
                }
            });

            this.roomContainer.appendChild(cardEl);
        });
    }

    showMessage(msg) {
        this.messageArea.textContent = msg;
    }

    showGameOver(won, score) {
        this.roomContainer.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <h2>${won ? 'VICTORY!' : 'DEFEAT'}</h2>
                <p>Score: ${score}</p>
            </div>
        `;
    }
}
