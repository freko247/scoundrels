# Scoundrels - Card Dungeon Crawler

A strategic card-based dungeon crawler game where you fight monsters, equip weapons, and heal with potions to survive a deck of cards.

## 🎮 Features

- **Strategic Gameplay**: Manage your health and weapon durability to survive.
- **Weapon Chaining**: Unique mechanic where weapons become less effective as you use them on stronger monsters.
- **Interactive Tutorial**: A 7-chapter guided tutorial to learn the game mechanics step-by-step.
- **Responsive UI**: Smooth animations and clear visual feedback.
- **Combat Choices**: Strategic decision-making when fighting monsters (use weapon vs. barehanded).

## 📜 Game Rules

### Goal
Clear all cards from the deck while keeping your health above 0.

### Cards
- **♥ Potions (Red Hearts)**: Heal you for the card's value (up to max 20 HP).
- **♦ Weapons (Red Diamonds)**: Equip to reduce damage from monsters.
- **♠/♣ Monsters (Black Cards)**: Enemies you must defeat.

### Combat & Weapons
- **Fighting Barehanded**: You take damage equal to the monster's value.
- **Using a Weapon**: Damage is reduced by the weapon's value (Damage = Monster Value - Weapon Value).
- **Chaining Rule**: Once you use a weapon to kill a monster, you can only use that same weapon against **weaker** monsters in the future.
    - *Example*: If you kill a 6♠ with your weapon, you can next use it on a 5♠, but NOT on a 7♠.
- **Ineffective Weapons**: If a monster is stronger than or equal to the last monster you fought with your current weapon, the weapon is ineffective and you must fight barehanded (or equip a new weapon).

### Scoring
- **Victory**: Your score is your remaining Health.
- **Defeat**: Your score is the negative sum of all remaining monsters in the deck and room.

## 🛠️ Development with Antigravity

This game was developed using **Antigravity**, an agentic AI coding assistant. The development process followed a structured workflow:

### 1. Planning & Design
- **Task Tracking**: Used `task.md` to break down features into manageable steps (e.g., "Implement Core Logic", "Create Tutorial").
- **Implementation Plans**: Created detailed plans (like `implementation_plan.md`) before writing code to ensure architectural integrity.

### 2. Iterative Implementation
- **Core Logic**: Started with `Card`, `Deck`, and `Game` classes to establish the rules engine.
- **UI Development**: Built a responsive HTML/CSS interface with `UI` class handling DOM updates.
- **Feature Expansion**: Added complex features like the **Weapon Choice Modal** and **Interactive Tutorial** based on user requests.

### 3. Verification & Debugging
- **Browser Testing**: Used a browser subagent to verify features (e.g., testing the tutorial flow).
- **Bug Fixing**: Solved real-world issues discovered during testing:
    - *Modal Visibility*: Fixed z-index stacking issues where the tutorial overlay covered the combat modal.
    - *Tutorial Logic*: Fixed bugs where the tutorial would auto-advance chapters unexpectedly or persist game state.
    - *Visual Feedback*: Added card dimming and cursor changes to guide users during the tutorial.

### 4. Artifacts
- **Walkthroughs**: Maintained `walkthrough.md` to document changes and verification results, including screenshots of fixed bugs.

## 🚀 How to Run

1. Start a local server:
   ```bash
   python3 -m http.server 8080
   ```
2. Open your browser to `http://localhost:8080`.
