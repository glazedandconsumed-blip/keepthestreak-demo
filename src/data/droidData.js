// Central registry of all droids and their unlock conditions
// 3 chassis types × 4 evolution tiers = 12 droids total

export const DROID_CHASSIS = {
    'box-orb': {
        id: 'box-orb',
        name: 'BOX-ORB UNIT',
        description: 'Standard maintenance droid. Spherical head on cubic chassis.',
        traits: ['Reliable', 'Observant', 'Patient'],
        unlockStreak: 0,
        chassisType: 'box-orb',
    },
    'bipedal': {
        id: 'bipedal',
        name: 'BIPEDAL MODEL',
        description: 'Humanoid service unit. Mobile and expressive.',
        traits: ['Agile', 'Expressive', 'Helpful'],
        unlockStreak: 3,
        chassisType: 'bipedal',
    },
    'tank': {
        id: 'tank',
        name: 'TANK CHASSIS',
        description: 'Heavy-duty platform. Built for persistence.',
        traits: ['Durable', 'Steady', 'Tireless'],
        unlockStreak: 7,
        chassisType: 'tank',
    },
    'minimal-core': {
        id: 'minimal-core',
        name: 'MINIMAL CORE',
        description: 'Stripped-down efficiency unit. Only essentials.',
        traits: ['Efficient', 'Focused', 'Silent'],
        unlockStreak: 14,
        chassisType: 'minimal-core',
    },
    'scout': {
        id: 'scout',
        name: 'SCOUT DRONE',
        description: 'Lightweight reconnaissance unit. Fast and nimble.',
        traits: ['Swift', 'Alert', 'Curious'],
        unlockStreak: 21,
        chassisType: 'scout',
    },
    'heavy': {
        id: 'heavy',
        name: 'HEAVY FRAME',
        description: 'Reinforced industrial chassis. Maximum durability.',
        traits: ['Tough', 'Resolute', 'Unwavering'],
        unlockStreak: 30,
        chassisType: 'heavy',
    },
    'stealth': {
        id: 'stealth',
        name: 'STEALTH UNIT',
        description: 'Low-profile covert operations frame.',
        traits: ['Quiet', 'Precise', 'Invisible'],
        unlockStreak: 45,
        chassisType: 'stealth',
    },
    'titan': {
        id: 'titan',
        name: 'TITAN CLASS',
        description: 'Military-grade autonomous platform.',
        traits: ['Powerful', 'Commanding', 'Elite'],
        unlockStreak: 50,
        chassisType: 'titan',
    },
    'quantum': {
        id: 'quantum',
        name: 'QUANTUM CORE',
        description: 'Experimental quantum-state processor.',
        traits: ['Unpredictable', 'Brilliant', 'Evolving'],
        unlockStreak: 60,
        chassisType: 'quantum',
    },
    'orbital': {
        id: 'orbital',
        name: 'ORBITAL FRAME',
        description: 'Zero-gravity optimized satellite unit.',
        traits: ['Weightless', 'Expansive', 'Eternal'],
        unlockStreak: 70,
        chassisType: 'orbital',
    },
    'nexus': {
        id: 'nexus',
        name: 'NEXUS PRIME',
        description: 'Network hub droid. Connected to all systems.',
        traits: ['Connected', 'Omniscient', 'Harmonious'],
        unlockStreak: 80,
        chassisType: 'nexus',
    },
    'genesis-droid': {
        id: 'genesis-droid',
        name: 'GENESIS',
        description: 'The final evolution. System architect.',
        traits: ['Transcendent', 'Creative', 'Infinite'],
        unlockStreak: 90,
        chassisType: 'genesis-droid',
    },
};

// All droid IDs in unlock order
export const ALL_DROID_IDS = Object.keys(DROID_CHASSIS);

// Get droids unlocked at a given streak
export const getUnlockedDroids = (streak) => {
    return ALL_DROID_IDS.filter(id => DROID_CHASSIS[id].unlockStreak <= streak);
};

// Get count string like "3/12 UNLOCKED"
export const getUnlockCountText = (streak) => {
    const unlocked = getUnlockedDroids(streak).length;
    return `${unlocked}/${ALL_DROID_IDS.length} UNLOCKED`;
};

// Droid dialog lines for different game states
export const DROID_DIALOG = {
    systemOnline: (eraName) => `System online. Maintenance required.`,
    yesterdayNotLogged: (eraName) => `Yesterday's work is not logged. I trust you remember what's needed. When you're ready.`,
    waitingForInput: () => `I'll wait here. Take your time. The system is patient.`,
    maintenanceDeferred: () => `No judgment. Memory is hard. The system will still be here.`,
    maintenanceComplete: () => `Maintenance logged. System integrity improving. Well done.`,
    streakBroken: () => `System reset detected. We start fresh. That's okay.`,
    newEra: (eraName) => `Evolution complete. Welcome to the ${eraName} era.`,
};
