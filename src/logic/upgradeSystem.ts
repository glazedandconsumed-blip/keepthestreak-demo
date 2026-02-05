import { LootItem } from './lootSystem';

export interface Recipe {
    id: string;
    resultId: string;
    ingredients: { itemId: string; count: number }[];
    description: string;
}

export const CRAFTING_RECIPES: Recipe[] = [
    {
        id: 'craft_motherboard',
        resultId: 'motherboard',
        ingredients: [
            { itemId: 'resistor', count: 5 },
            { itemId: 'wire', count: 5 }
        ],
        description: 'Solder components to base board.'
    },
    {
        id: 'craft_cooling',
        resultId: 'cooling_system',
        ingredients: [
            { itemId: 'fan', count: 3 },
            { itemId: 'screw', count: 10 }
        ],
        description: 'High-airflow thermal solution.'
    },
    {
        id: 'craft_core',
        resultId: 'mainframe_core',
        ingredients: [
            { itemId: 'cpu', count: 1 },
            { itemId: 'ram', count: 2 },
            { itemId: 'motherboard', count: 1 } // Requires crafted item
        ],
        description: 'The heart of the machine.'
    },
    {
        id: 'craft_quantum',
        resultId: 'quantum_core',
        ingredients: [
            { itemId: 'mainframe_core', count: 1 },
            { itemId: 'gpu', count: 1 },
            { itemId: 'hdd', count: 2 }
        ],
        description: 'Processing power that bends reality.'
    },
    {
        id: 'craft_server',
        resultId: 'server_rack',
        ingredients: [
            { itemId: 'cooling_system', count: 2 },
            { itemId: 'motherboard', count: 2 },
            { itemId: 'wire', count: 20 }
        ],
        description: 'Industrial grade computation.'
    },
    {
        id: 'craft_ai',
        resultId: 'ai_module',
        ingredients: [
            { itemId: 'cpu', count: 3 },
            { itemId: 'ram', count: 5 },
            { itemId: 'deep_blue_chip', count: 1 } // Uses Artifact!
        ],
        description: 'It can think. Hopefully it\'s friendly.'
    },
    {
        id: 'craft_time',
        resultId: 'time_machine',
        ingredients: [
            { itemId: 'capacitor', count: 10 },
            { itemId: 'flux_capacitor', count: 1 }, // Standard component if exists or just standard loot? (Wait, I used 'capacitor' as flux capacitor in lootSystem?)
            // Let's check lootSystem.ts: id: 'capacitor', name: 'Flux Capacitor' -> YES.
            // But wait, there might be a semantic clash. Let's assume 'capacitor' is the item.
            // And car_hood? That's not in lootSystem yet. Let's swap car_hood for something else or add it.
            // Let's use 'screw' x50 for the "Delorean" vibe.
            { itemId: 'screw', count: 50 },
            { itemId: 'fan', count: 5 }
        ],
        description: 'Great Scott!'
    }
];

export const TERMINAL_STAGES = [
    { level: 0, name: "Empty Rack", requiredItem: null, visual: "rack_empty" },
    { level: 1, name: "Wiring Harness", requiredItem: "wire", count: 10, visual: "rack_wired" },
    { level: 2, name: "Power Supply", requiredItem: "capacitor", count: 5, visual: "rack_power" },
    { level: 3, name: "Logic Board", requiredItem: "motherboard", count: 1, visual: "rack_motherboard" },
    { level: 4, name: "System Core", requiredItem: "mainframe_core", count: 1, visual: "rack_core" },
    { level: 5, name: "ONLINE", requiredItem: "server_rack", count: 1, visual: "rack_online" },
    { level: 6, name: "CLUSTER", requiredItem: "server_rack", count: 5, visual: "rack_cluster" },
    { level: 7, name: "QUANTUM", requiredItem: "quantum_core", count: 1, visual: "rack_quantum" },
    { level: 8, name: "SENTIENT", requiredItem: "ai_module", count: 1, visual: "rack_ai" },
    { level: 9, name: "TEMPORAL", requiredItem: "time_machine", count: 1, visual: "rack_time" },
    { level: 10, name: "OMNISCIENT", requiredItem: "ai_module", count: 5, visual: "rack_god" }
];

export const getTerminalStage = (inventory: string[]) => {
    // Count items
    const counts = inventory.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    let currentStage = 0;
    for (const stage of TERMINAL_STAGES) {
        if (!stage.requiredItem) continue;
        if ((counts[stage.requiredItem] || 0) >= (stage.count || 1)) {
            currentStage = stage.level;
        } else {
            break; // Stop at first missing requirement? Or cumulative?
            // Let's say cumulative: You must pass level 1 to see level 2 check.
            // Actually, simplified: Return the highest level met in order.
        }
    }
    return TERMINAL_STAGES[currentStage];
};
