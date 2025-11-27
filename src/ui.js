export class UI {
    constructor() {
        this.healthEl = document.getElementById('health');
        this.weaponEl = document.getElementById('weapon');
        this.lastFoughtEl = document.getElementById('last-fought');
        this.cardsLeftEl = document.getElementById('cards-left');
        this.roomContainer = document.getElementById('room-container');
        this.messageArea = document.getElementById('message-area');
        this.resetBtn = document.getElementById('reset-btn');
        this.skipBtn = document.getElementById('skip-btn');

        this.rulesOverlay = document.getElementById('rules-overlay');
        this.rulesBtn = document.getElementById('rules-btn');
        this.closeRulesBtn = document.getElementById('close-rules-btn');

        this.onCardClick = null;
    }

    bindNewGame(handler) {
        this.resetBtn.addEventListener('click', handler);
    }

    bindSkipRoom(handler) {
        this.skipBtn.addEventListener('click', handler);
    }

    bindRules() {
        this.rulesBtn.addEventListener('click', () => {
            this.rulesOverlay.classList.remove('hidden');
        });
        this.closeRulesBtn.addEventListener('click', () => {
            this.rulesOverlay.classList.add('hidden');
        });
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

    updateSkipButton(canSkip) {
        this.skipBtn.disabled = !canSkip;
        if (canSkip) {
            this.skipBtn.classList.remove('disabled');
        } else {
            this.skipBtn.classList.add('disabled');
        }
    }

    renderRoom(cards, weapon, lastFoughtValue) {
        this.roomContainer.innerHTML = '';
        cards.forEach((card, index) => {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'card-wrapper';

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

            // Common card wrapper
            cardWrapper.appendChild(cardEl);

            const actionsEl = document.createElement('div');
            actionsEl.className = 'card-actions';

            if (card.type === 'monster') {
                const weaponBtn = document.createElement('button');
                weaponBtn.className = 'action-btn weapon-btn';
                weaponBtn.textContent = 'Use Weapon';

                // Check if weapon can be used
                const canUseWeapon = weapon && (lastFoughtValue === 0 || card.value < lastFoughtValue);
                weaponBtn.disabled = !canUseWeapon;

                weaponBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.onCardClick) this.onCardClick(index, true);
                });

                const bareBtn = document.createElement('button');
                bareBtn.className = 'action-btn bare-btn';
                bareBtn.textContent = 'Fight barehand';
                bareBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.onCardClick) this.onCardClick(index, false);
                });

                actionsEl.appendChild(weaponBtn);
                actionsEl.appendChild(bareBtn);
            } else if (card.type === 'potion') {
                const healBtn = document.createElement('button');
                healBtn.className = 'action-btn heal-btn';
                healBtn.textContent = 'Heal';
                healBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.onCardClick) this.onCardClick(index);
                });
                actionsEl.appendChild(healBtn);
            } else if (card.type === 'weapon') {
                const equipBtn = document.createElement('button');
                equipBtn.className = 'action-btn equip-btn';
                equipBtn.textContent = 'Equip';
                equipBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.onCardClick) this.onCardClick(index);
                });
                actionsEl.appendChild(equipBtn);
            }

            cardWrapper.appendChild(actionsEl);
            this.roomContainer.appendChild(cardWrapper);
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

    showGameOver(won, score) {
        this.roomContainer.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <h2>${won ? 'VICTORY!' : 'DEFEAT'}</h2>
                <p>Score: ${score}</p>
            </div>
        `;
    }
}
