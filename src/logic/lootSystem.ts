export type LootType = 'COMPONENT' | 'CONSUMABLE' | 'ARTIFACT';
export type LootTier = 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY';

export interface LootItem {
    id: string;
    name: string;
    type: LootType;
    tier: LootTier;
    description: string;
    icon: string; // PixelIcon name or emoji for now
}

export const LOOT_TABLE: LootItem[] = [
    // --- COMPONENTS ---
    // COMMON (60%)
    { id: 'resistor', name: 'Carbon Resistor', type: 'COMPONENT', tier: 'COMMON', description: 'Basic resistance.', icon: 'chip' },
    { id: 'capacitor', name: 'Flux Capacitor', type: 'COMPONENT', tier: 'COMMON', description: 'Stores charge.', icon: 'chip' },
    { id: 'wire', name: 'Copper Wire', type: 'COMPONENT', tier: 'COMMON', description: 'Conducts electricity.', icon: 'chip' },
    { id: 'screw', name: 'Rusty Screw', type: 'COMPONENT', tier: 'COMMON', description: 'Holds things together.', icon: 'chip' },

    // UNCOMMON (30%)
    { id: 'fan', name: 'Cooling Fan', type: 'COMPONENT', tier: 'UNCOMMON', description: 'Keeps it frosty.', icon: 'fan' },
    { id: 'ram', name: 'SDRAM Stick', type: 'COMPONENT', tier: 'UNCOMMON', description: 'Volatile memory.', icon: 'memory' },
    { id: 'floppy', name: 'Floppy Disk', type: 'COMPONENT', tier: 'UNCOMMON', description: '1.44MB of storage.', icon: 'save' },

    // RARE (9%)
    { id: 'cpu', name: 'Central Processor', type: 'COMPONENT', tier: 'RARE', description: 'The brain.', icon: 'cpu' },
    { id: 'hdd', name: 'Hard Drive', type: 'COMPONENT', tier: 'RARE', description: 'Spinning rust.', icon: 'hdd' },
    // Nokia 3210 is a SPECIAL unlock - not in random loot table

    // LEGENDARY (1%)
    { id: 'gpu', name: 'Voodoo Card', type: 'COMPONENT', tier: 'LEGENDARY', description: '3D acceleration!', icon: 'gpu' },

    // --- CONSUMABLES (Roguelite Drops) ---
    { id: 'extra_life', name: '1-Up Mushroom', type: 'CONSUMABLE', tier: 'RARE', description: 'Grants +1 Life.', icon: 'heart' },
    { id: 'streak_freeze', name: 'Cryo Freeze', type: 'CONSUMABLE', tier: 'LEGENDARY', description: 'Protects streak from next game over.', icon: 'snowflake' },
    { id: 'hint_token', name: 'Cheat Code', type: 'CONSUMABLE', tier: 'UNCOMMON', description: 'Bit reveals the answer.', icon: 'key' },
    { id: 'easy_mode', name: 'Debug Mode', type: 'CONSUMABLE', tier: 'UNCOMMON', description: 'Simplifies next equation.', icon: 'chip' },
    { id: 'memory_jog', name: 'RAM Boost', type: 'CONSUMABLE', tier: 'COMMON', description: 'Bit reminds you yesterdays number.', icon: 'memory' },
    // --- EASTER EGG ARTIFACTS (Unlocked via specific conditions) ---
    { id: 'nokia3210', name: 'The Indestructible', type: 'ARTIFACT' as LootType, tier: 'LEGENDARY', description: 'Survives nuclear blasts and bad reception. (1999)', icon: 'bit' },
    { id: 'tamagotchi', name: 'Digital Pet', type: 'ARTIFACT' as LootType, tier: 'RARE', description: 'Don\'t let it die. Again. (1996)', icon: 'bit' },
    { id: 'charred_elmo', name: 'Charred Elmo', type: 'ARTIFACT' as LootType, tier: 'RARE', description: 'It still giggles when you burn it. (1996)', icon: 'bit' },
    { id: 'scorched_furby', name: 'Scorched Furby', type: 'ARTIFACT' as LootType, tier: 'RARE', description: 'It sees you. It judges you. (1998)', icon: 'bit' },
    { id: 'teddy_ruxpin', name: 'Haunted Bear', type: 'ARTIFACT' as LootType, tier: 'RARE', description: 'Telling stories from the void. (1985)', icon: 'bit' },
    { id: 'rubiks_cube', name: 'The Cube', type: 'ARTIFACT' as LootType, tier: 'UNCOMMON', description: 'Frustration in 6 colors. (1980)', icon: 'bit' },
    { id: 'aol_cd', name: '1000 Free Hours', type: 'ARTIFACT' as LootType, tier: 'COMMON', description: 'Excellent coaster. (1995)', icon: 'bit' },
    { id: 'clippy', name: 'Paperclip Assistant', type: 'ARTIFACT' as LootType, tier: 'LEGENDARY', description: 'It looks like you\'re struggling. (1997)', icon: 'bit' },
    { id: 'y2k_bug', name: 'Y2K Bug', type: 'ARTIFACT' as LootType, tier: 'LEGENDARY', description: 'The apocalypse that wasn\'t. (2000)', icon: 'bit' },
    { id: 'ipod_classic', name: '1000 Songs', type: 'ARTIFACT' as LootType, tier: 'RARE', description: 'Click wheel goodness. (2001)', icon: 'bit' },
    { id: 'myspace_tom', name: 'Top Friend', type: 'ARTIFACT' as LootType, tier: 'RARE', description: 'Everyone\'s first friend. (2003)', icon: 'bit' },
    { id: 'heelys', name: 'Wheel Shoes', type: 'ARTIFACT' as LootType, tier: 'UNCOMMON', description: 'Banned in schools everywhere. (2000)', icon: 'bit' },
    { id: 'pi_badge', name: 'Slice of Pi', type: 'ARTIFACT' as LootType, tier: 'RARE', description: '3.14159... delicious. (Math)', icon: 'bit' },
    { id: 'euler_number', name: 'Euler\'s Number', type: 'ARTIFACT' as LootType, tier: 'RARE', description: '2.718... Naturally beautiful. (Math)', icon: 'bit' },
    { id: 'fibonacci_spiral', name: 'Golden Spiral', type: 'ARTIFACT' as LootType, tier: 'RARE', description: 'Nature\'s cheat code. (Math)', icon: 'bit' },
    { id: 'apollo_11_patch', name: 'Moon Lander', type: 'ARTIFACT' as LootType, tier: 'LEGENDARY', description: 'One small step. (1969)', icon: 'bit' },
    { id: 'apollo_13_patch', name: 'Successful Failure', type: 'ARTIFACT' as LootType, tier: 'LEGENDARY', description: 'Houston, we have a solution. (1970)', icon: 'bit' },
    { id: 'turing_machine', name: 'Universal Machine', type: 'ARTIFACT' as LootType, tier: 'LEGENDARY', description: 'The theoretical ancestor. (1936)', icon: 'bit' },
    { id: 'deep_blue_chip', name: 'Deep Blue', type: 'ARTIFACT' as LootType, tier: 'LEGENDARY', description: 'Checkmate, humanity. (1997)', icon: 'bit' },
    { id: 'einstein_equation', name: 'Relativity', type: 'ARTIFACT' as LootType, tier: 'LEGENDARY', description: 'E=MC². Fast. (1905)', icon: 'bit' },
    { id: 'eniac_vacuum_tube', name: 'Vacuum Tube', type: 'ARTIFACT' as LootType, tier: 'RARE', description: 'Smells like burning ozone. (1945)', icon: 'bit' },
    { id: 'arpanet_node', name: 'First Node', type: 'ARTIFACT' as LootType, tier: 'LEGENDARY', description: 'LO...GIN. (1969)', icon: 'bit' },

    // --- CRAFTED ITEMS (Not dropped, but needed for UI) ---
    { id: 'motherboard', name: 'Logic Board', type: 'COMPONENT' as LootType, tier: 'UNCOMMON', description: 'The base for computation.', icon: 'chip' },
    { id: 'cooling_system', name: 'Cryo Cooling', type: 'COMPONENT' as LootType, tier: 'UNCOMMON', description: 'Keeps temperatures absolute zero.', icon: 'fan' },
    { id: 'mainframe_core', name: 'Mainframe Core', type: 'COMPONENT' as LootType, tier: 'RARE', description: 'Heavy duty processing.', icon: 'server' },
    { id: 'quantum_core', name: 'Quantum Core', type: 'COMPONENT' as LootType, tier: 'LEGENDARY', description: 'Processing power that bends reality.', icon: 'atom' },
    { id: 'server_rack', name: 'Server Rack', type: 'COMPONENT' as LootType, tier: 'RARE', description: 'Industrial grade computation.', icon: 'server' },
    { id: 'ai_module', name: 'AI Module', type: 'COMPONENT' as LootType, tier: 'LEGENDARY', description: 'It can think. Hopefully it\'s friendly.', icon: 'brain' },
    { id: 'time_machine', name: 'Temporal Unit', type: 'COMPONENT' as LootType, tier: 'LEGENDARY', description: 'Great Scott!', icon: 'clock' },
];

export const generateLoot = (forcedType?: LootType): LootItem => {
    const rand = Math.random();
    let tier: LootTier = 'COMMON';

    if (rand > 0.99) tier = 'LEGENDARY';
    else if (rand > 0.90) tier = 'RARE';
    else if (rand > 0.60) tier = 'UNCOMMON';

    // Filter by Tier AND Type (if provided)
    // EXCLUDE ARTIFACTS from random generation unless explicitly requested (which we won't for now)
    let pool = LOOT_TABLE.filter(item => item.tier === tier && item.type !== 'ARTIFACT');

    if (forcedType) {
        pool = LOOT_TABLE.filter(item => item.type === forcedType && item.tier === tier);
        // Fallback if tier is too high and no items exist for that type/tier combo
        if (pool.length === 0) {
            pool = LOOT_TABLE.filter(item => item.type === forcedType);
        }
    }

    // Safety fallback
    if (pool.length === 0) pool = LOOT_TABLE.filter(item => item.type !== 'ARTIFACT');

    return pool[Math.floor(Math.random() * pool.length)];
};
