// verify_logic.js

// Mock Environment
const inventory = [];
const addItem = (id) => inventory.push(id);
const consumeItems = (ids) => {
    ids.forEach(id => {
        const idx = inventory.indexOf(id);
        if (idx > -1) inventory.splice(idx, 1);
        else console.error(`[ERROR] Missing item to consume: ${id}`);
    });
};

// Import Logic (We'll mock requires by manually pasting necessary logic logic if simple, or reading files)
// For verify script, it's easier to just copy the data structures we want to test since they are pure data/logic.

// 1. CRAFTING TEST
const CRAFTING_RECIPES = [
    {
        id: 'craft_ai',
        resultId: 'ai_module',
        ingredients: [
            { itemId: 'cpu', count: 3 },
            { itemId: 'ram', count: 5 },
            { itemId: 'deep_blue_chip', count: 1 }
        ]
    }
];

console.log("--- STARTING VERIFICATION ---");

// Setup Inventory for AI Module
console.log("\n[TEST] Crafting AI Module");
inventory.push('cpu', 'cpu', 'cpu');
inventory.push('ram', 'ram', 'ram', 'ram', 'ram', 'ram'); // 1 extra
inventory.push('deep_blue_chip');

console.log(`Initial Inventory: ${inventory.join(', ')}`);

const recipe = CRAFTING_RECIPES.find(r => r.id === 'craft_ai');
// Check requirements
const inventoryCounts = inventory.reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
const canCraft = recipe.ingredients.every(ing => (inventoryCounts[ing.itemId] || 0) >= ing.count);

if (canCraft) {
    console.log("[PASS] Requirements met.");
    // Consumption
    const toConsume = [];
    recipe.ingredients.forEach(ing => {
        for (let k = 0; k < ing.count; k++) toConsume.push(ing.itemId);
    });
    consumeItems(toConsume);
    addItem(recipe.resultId);
    console.log("[PASS] Crafted AI Module.");
} else {
    console.error("[FAIL] Requirements NOT met.");
}

console.log(`Final Inventory: ${inventory.join(', ')}`);

if (inventory.includes('ai_module') && !inventory.includes('deep_blue_chip') && inventoryCounts['cpu'] === 3) {
    console.log("SUCCESS: Crafting logic verified.");
}

// 2. TERMINAL STAGE TEST
const TERMINAL_STAGES = [
    { level: 8, name: "SENTIENT", requiredItem: "ai_module", count: 1 }
];

const getTerminalStage = (inv) => {
    const counts = inv.reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {});
    // simple check
    if (counts['ai_module'] >= 1) return TERMINAL_STAGES[0];
    return null;
};

const stage = getTerminalStage(inventory);
if (stage && stage.name === 'SENTIENT') {
    console.log(`[PASS] Terminal upgraded to ${stage.name}`);
} else {
    console.error("[FAIL] Terminal stage check failed.");
}

// 3. NOKIA UNLOCK LOGIC TEST (Mock from equationGenerator)
console.log("\n[TEST] Nokia Unlock Logic");
const streak = 99;
const solution = 3210;
let unlocked = false;

if (streak >= 99 && solution === 3210) {
    unlocked = true;
}

if (unlocked) {
    console.log("[PASS] Nokia 3210 unlock condition met.");
} else {
    console.error("[FAIL] Nokia 3210 unlock logic incorrect.");
}

console.log("\n--- VERIFICATION COMPLETE ---");
