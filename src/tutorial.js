import { Card } from './card.js';

export class Tutorial {
    constructor(game, ui) {
        this.game = game;
        this.ui = ui;
        this.currentChapter = 0;
        this.currentStep = 0;
        this.active = false;

        this.overlay = document.getElementById('tutorial-overlay');
        this.chaptersContainer = document.getElementById('tutorial-chapters');
        this.textContainer = document.getElementById('tutorial-text');
        this.prevBtn = document.getElementById('tutorial-prev-btn');
        this.nextBtn = document.getElementById('tutorial-next-btn');
        this.exitBtn = document.getElementById('tutorial-exit-btn');

        this.chapters = this.defineChapters();
        this.renderChapterList();
        this.bindEvents();
    }

    defineChapters() {
        return [
            {
                title: "1. Introduction",
                steps: [
                    {
                        text: `<h2>Welcome to Scoundrels!</h2>
                        <p>Scoundrels is a card-based dungeon crawler where you must survive through an entire deck of cards.</p>
                        <p><strong>Goal:</strong> Clear all cards from the deck while keeping your health above 0.</p>
                        <p><strong>Victory:</strong> Your score equals your remaining health.</p>
                        <p><strong>Defeat:</strong> Your score is negative, based on remaining monsters.</p>`,
                        deck: null,
                        highlight: null
                    }
                ]
            },
            {
                title: "2. Health & Potions",
                steps: [
                    {
                        text: `<h2>Health & Potions</h2>
                        <p>You start with <strong>20 health</strong>. If it reaches 0, you lose!</p>
                        <p><strong>Red Hearts (♥)</strong> are potions that heal you.</p>
                        <p>The number on the card shows how much health you gain (up to max 20).</p>
                        <p>Let's try it! Click the potion card below.</p>`,
                        deck: [new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '2'), new Card('♥', '5')],
                        highlight: '#room-container',
                        autoAdvance: true,
                        nextHighlight: '#health',
                        allowedCardIndex: 0  // Only allow clicking the first card (potion)
                    },
                    {
                        text: `<h2>Great!</h2>
                        <p>You healed for 5 HP. Notice your health stayed at 20 because you were already at maximum.</p>
                        <p>Potions are valuable - use them wisely!</p>`,
                        deck: null,
                        highlight: '#health'
                    }
                ]
            },
            {
                title: "3. Weapons",
                steps: [
                    {
                        text: `<h2>Weapons</h2>
                        <p><strong>Red Diamonds (♦)</strong> are weapons that reduce damage from monsters.</p>
                        <p>When you click a weapon, you equip it.</p>
                        <p>The weapon's value is how much damage it blocks.</p>
                        <p>Try equipping this 6♦ weapon!</p>`,
                        deck: [new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '2'), new Card('♦', '6')],
                        highlight: '#room-container',
                        autoAdvance: true,
                        nextHighlight: '#weapon',
                        allowedCardIndex: 0  // Only allow clicking the first card (weapon)
                    },
                    {
                        text: `<h2>Weapon Equipped!</h2>
                        <p>Notice the "Weapon" stat now shows your equipped weapon.</p>
                        <p>You can only have one weapon at a time. Equipping a new weapon replaces the old one.</p>`,
                        deck: null,
                        highlight: '#weapon'
                    }
                ]
            },
            {
                title: "4. Monsters",
                steps: [
                    {
                        text: `<h2>Monsters</h2>
                        <p><strong>Black cards (♠ and ♣)</strong> are monsters you must fight.</p>
                        <p>Without a weapon, you take full damage equal to the monster's value.</p>
                        <p>Fight this 4♠ monster barehanded!</p>`,
                        deck: [new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '4')],
                        highlight: '#room-container',
                        autoAdvance: true,
                        allowedCardIndex: 0
                    },
                    {
                        text: `<h2>Ouch!</h2>
                        <p>You took 4 damage fighting barehanded. Your health is now 16/20.</p>
                        <p>Now let's see how weapons help! First, equip this weapon.</p>`,
                        deck: [new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '2'), new Card('♦', '7')],
                        highlight: '#room-container',
                        autoAdvance: true,
                        allowedCardIndex: 0
                    },
                    {
                        text: `<h2>Weapon Ready!</h2>
                        <p>Now fight this 5♠ monster. With your 7♦ weapon, you'll take much less damage!</p>
                        <p>A modal will appear asking if you want to use your weapon or fight barehanded.</p>`,
                        deck: [new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '5')],
                        highlight: '#room-container',
                        allowedCardIndex: 0
                    }
                ]
            },
            {
                title: "5. Weapon Effectiveness",
                steps: [
                    {
                        text: `<h2>Weapon Effectiveness Rule</h2>
                        <p>Here's the tricky part: <strong>Weapons have a chaining rule!</strong></p>
                        <p>After defeating a monster with a weapon, you can only use that weapon against <strong>weaker monsters</strong>.</p>
                        <p>Let's see this in action. Equip this 8♦ weapon.</p>`,
                        deck: [new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '2'), new Card('♦', '8')],
                        highlight: '#room-container',
                        autoAdvance: true,
                        allowedCardIndex: 0
                    },
                    {
                        text: `<h2>First Fight</h2>
                        <p>Fight this 6♠ monster with your weapon. You'll take 0 damage (6-8 < 0).</p>
                        <p>After this, your "Last Fought" will be 6.</p>`,
                        deck: [new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '6')],
                        highlight: '#room-container',
                        allowedCardIndex: 0
                    },
                    {
                        text: `<h2>Weapon Now Limited</h2>
                        <p>Now try to fight this 6♣ monster.</p>
                        <p>Since it's equal to your last fought (6), the weapon is <strong>ineffective</strong>!</p>
                        <p>You'll be forced to fight barehanded.</p>`,
                        deck: [new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '2'), new Card('♣', '6')],
                        highlight: '#room-container',
                        autoAdvance: true,
                        allowedCardIndex: 0
                    },
                    {
                        text: `<h2>Still Effective Against Weaker Monsters</h2>
                        <p>But your weapon still works against weaker monsters!</p>
                        <p>Fight this 3♠ monster. The modal will appear because 3 < 6.</p>`,
                        deck: [new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '3')],
                        highlight: '#room-container',
                        allowedCardIndex: 0
                    }
                ]
            },
            {
                title: "6. Combat Choices",
                steps: [
                    {
                        text: `<h2>Choosing Your Strategy</h2>
                        <p>When your weapon is effective, you get to choose:</p>
                        <ul>
                            <li><strong>Use Weapon:</strong> Reduce damage, but update "Last Fought"</li>
                            <li><strong>Fight Barehanded:</strong> Take full damage, but keep weapon effective</li>
                        </ul>
                        <p>Sometimes it's strategic to save your weapon for a bigger threat!</p>
                        <p>Equip this 10♦ weapon.</p>`,
                        deck: [new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '2'), new Card('♦', '10')],
                        highlight: '#room-container',
                        autoAdvance: true,
                        allowedCardIndex: 0
                    },
                    {
                        text: `<h2>Strategic Choice</h2>
                        <p>You have a 4♠ and a 9♠ coming up.</p>
                        <p>If you use your weapon on the 4, you can't use it on the 9 (9 > 4).</p>
                        <p>Try fighting the 4♠ <strong>barehanded</strong> to save your weapon!</p>`,
                        deck: [new Card('♠', '2'), new Card('♠', '2'), new Card('♠', '9'), new Card('♠', '4')],
                        highlight: '#room-container',
                        allowedCardIndex: 0
                    }
                ]
            },
            {
                title: "7. Winning & Scoring",
                steps: [
                    {
                        text: `<h2>Victory Conditions</h2>
                        <p><strong>Win:</strong> Clear all cards with health > 0</p>
                        <p><strong>Victory Score:</strong> Your remaining health</p>
                        <p><strong>Defeat Score:</strong> Negative sum of remaining monster values</p>
                        <p>Strategy tips:</p>
                        <ul>
                            <li>Heal early to maximize final score</li>
                            <li>Use weapons wisely - save them for big threats</li>
                            <li>Remember the chaining rule!</li>
                        </ul>
                        <p>You're ready to play! Good luck, Scoundrel!</p>`,
                        deck: null,
                        highlight: null
                    }
                ]
            }
        ];
    }

    renderChapterList() {
        this.chaptersContainer.innerHTML = '';
        this.chapters.forEach((chapter, index) => {
            const btn = document.createElement('button');
            btn.className = 'tutorial-chapter-btn';
            btn.textContent = chapter.title;
            btn.addEventListener('click', () => this.goToChapter(index));
            this.chaptersContainer.appendChild(btn);
        });
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.previousStep());
        this.nextBtn.addEventListener('click', () => this.nextStep());
        this.exitBtn.addEventListener('click', () => this.exit());
    }

    start(chapterIndex = 0) {
        this.active = true;
        this.currentChapter = chapterIndex;
        this.currentStep = 0;
        this.resetGameState();
        this.overlay.classList.remove('hidden');
        this.showCurrentStep();
    }

    goToChapter(index) {
        this.currentChapter = index;
        this.currentStep = 0;
        this.resetGameState();
        this.showCurrentStep();
    }

    resetGameState() {
        this.game.health = 20;
        this.game.weapon = null;
        this.game.lastFoughtValue = 0;
        this.game.room = [];
        this.game.cardsPlayedInRoom = 0;
        this.game.gameOver = false;
        this.game.updateUI(); // Ensure UI reflects reset state immediately
    }

    showCurrentStep() {
        const chapter = this.chapters[this.currentChapter];
        const step = chapter.steps[this.currentStep];

        // Update chapter buttons
        const btns = this.chaptersContainer.querySelectorAll('.tutorial-chapter-btn');
        btns.forEach((btn, i) => {
            btn.classList.toggle('active', i === this.currentChapter);
        });

        // Update text
        this.textContainer.innerHTML = step.text;

        // Update navigation buttons
        this.prevBtn.disabled = this.currentChapter === 0 && this.currentStep === 0;
        this.nextBtn.disabled = this.currentChapter === this.chapters.length - 1 &&
            this.currentStep === chapter.steps.length - 1;

        // Load tutorial deck if specified
        if (step.deck) {
            this.game.deck.cards = [...step.deck];
            this.game.room = [];
            this.game.cardsPlayedInRoom = 0;
            this.game.gameOver = false;
            this.game.dealRoom();
            this.game.updateUI();

            // Set up auto-advance if specified
            if (step.autoAdvance) {
                this.setupAutoAdvance(step.nextHighlight);
            }

            // Apply visual restrictions if specified
            if (step.allowedCardIndex !== undefined) {
                this.applyCardRestrictions(step.allowedCardIndex);
            }
        }

        // Highlight element if specified
        this.clearHighlights();
        if (step.highlight) {
            const el = document.querySelector(step.highlight);
            if (el) {
                el.classList.add('tutorial-highlight');
            }
        }
    }

    applyCardRestrictions(allowedIndex) {
        const cards = document.querySelectorAll('#room-container .card');
        cards.forEach((card, index) => {
            if (index !== allowedIndex) {
                card.classList.add('tutorial-disabled');
                card.style.opacity = '0.3';
                card.style.cursor = 'not-allowed';
            }
        });
    }

    setupAutoAdvance(nextHighlight) {
        // Remove previous listener if any
        if (this.autoAdvanceListener) {
            this.ui.onCardClick = this.originalCardClick;
        }

        // Store original card click handler
        if (!this.originalCardClick) {
            this.originalCardClick = this.ui.onCardClick;
        }

        // Create new handler that auto-advances
        this.autoAdvanceListener = (index) => {
            // Check if this card is allowed to be clicked
            const step = this.chapters[this.currentChapter].steps[this.currentStep];
            if (step.allowedCardIndex !== undefined && index !== step.allowedCardIndex) {
                // Ignore clicks on non-allowed cards
                return;
            }

            // Call original handler
            this.originalCardClick(index);

            // Wait a bit for the action to complete, then advance
            setTimeout(() => {
                this.clearHighlights();
                if (nextHighlight) {
                    const el = document.querySelector(nextHighlight);
                    if (el) {
                        el.classList.add('tutorial-highlight');
                    }
                }

                // Only auto-advance if there is a next step in this chapter
                const chapter = this.chapters[this.currentChapter];
                if (this.currentStep < chapter.steps.length - 1) {
                    this.nextStep();
                }
            }, 500);
        };

        this.ui.onCardClick = this.autoAdvanceListener;
    }

    nextStep() {
        const chapter = this.chapters[this.currentChapter];
        if (this.currentStep < chapter.steps.length - 1) {
            this.currentStep++;
            this.showCurrentStep();
        } else if (this.currentChapter < this.chapters.length - 1) {
            this.currentChapter++;
            this.currentStep = 0;
            this.resetGameState(); // Reset state when moving to next chapter
            this.showCurrentStep();
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
        } else if (this.currentChapter > 0) {
            this.currentChapter--;
            this.currentStep = this.chapters[this.currentChapter].steps.length - 1;
        }
        this.showCurrentStep();
    }

    clearHighlights() {
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
    }

    exit() {
        this.active = false;
        this.overlay.classList.add('hidden');
        this.clearHighlights();

        // Restore original card click handler
        if (this.originalCardClick) {
            this.ui.onCardClick = this.originalCardClick;
        }

        this.game.start(); // Reset game to normal state
    }
}
