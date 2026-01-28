export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string; // e.g., "🔥", "📐"
    condition: (streak: number) => boolean;
    data?: {
        year?: string;
        type?: 'console' | 'hardware' | 'other';
        [key: string]: any;
    };
}

const isPrime = (num: number) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const isPerfectSquare = (num: number) => Number.isInteger(Math.sqrt(num));

// Pre-calculate fibonacci set for reasonable game range (up to ~1000 days for checks)
const fibSet = new Set([1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987]);

export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
    // Streak Milestones
    {
        id: 'streak-3',
        title: 'Insert Coin',
        description: 'Maintained a streak for 3 days. The arcade is open.',
        icon: '🪙',
        condition: (s) => s === 3,
    },
    {
        id: 'streak-7',
        title: '8-Bit Hero',
        description: '7 days. Now you\'re playing with power!',
        icon: '👾',
        condition: (s) => s === 7,
    },
    {
        id: 'streak-16',
        title: 'Blast Processing',
        description: '16 days. High definition graphics!',
        icon: '🦔',
        condition: (s) => s === 16,
    },
    {
        id: 'streak-30',
        title: '64-Bit Era',
        description: '30 days. Welcome to the third dimension.',
        icon: '🧊',
        condition: (s) => s === 30,
    },
    {
        id: 'streak-100',
        title: 'The Wizard',
        description: '100 days. I love the Power Glove. It\'s so bad.',
        icon: '🥊',
        condition: (s) => s === 100,
    },

    // Artifact Milestones (Console Scavenger)
    {
        id: 'artifact-abacus',
        title: 'The Abacus',
        description: 'Before pixels, there were beads. (~2700 BC)',
        icon: '🧮',
        condition: (s) => s === 5,
        data: { year: '2700 BC', type: 'hardware' }
    },
    {
        id: 'artifact-mechanism',
        title: 'Antikythera',
        description: 'First analog computer. Found in a shipwreck. (100 BC)',
        icon: '⚙️',
        condition: (s) => s === 12,
        data: { year: '100 BC', type: 'hardware' }
    },
    {
        id: 'artifact-nes',
        title: '8-Bit Console',
        description: 'It revived the industry. Blow on it. (1985)',
        icon: '🕹️',
        condition: (s) => s === 19,
        data: { year: '1985', type: 'console' }
    },
    {
        id: 'artifact-gb',
        title: 'Pocket Power',
        description: 'Green screens and AA batteries. Tetris machine. (1989)',
        icon: '📱',
        condition: (s) => s === 25,
        data: { year: '1989', type: 'console' }
    },
    {
        id: 'artifact-snes',
        title: 'Super Power',
        description: 'Mode 7 graphics and 16-bit sound. (1990)',
        icon: '🎮',
        condition: (s) => s === 42,
        data: { year: '1990', type: 'console' }
    },
    {
        id: 'artifact-calc',
        title: 'Ti-83',
        description: 'The ultimate tool for math and Snake. (1996)',
        icon: '📟',
        condition: (s) => s === 50,
        data: { year: '1996', type: 'hardware' }
    },

    // Math Milestones
    {
        id: 'prime_time',
        title: 'Prime Time',
        description: 'Reached a Prime Number day',
        icon: '🔢',
        condition: (s) => isPrime(s) && s > 1, // Start rewarding from 2
    },
    {
        id: 'perfect_square',
        title: 'Perfect Square',
        description: 'Reached a Perfect Square day',
        icon: '📐',
        condition: (s) => isPerfectSquare(s) && s > 1,
    },
    {
        id: 'fibonacci_friend',
        title: 'Fibonacci Friend',
        description: 'Reached a Fibonacci sequence day',
        icon: '🐚',
        condition: (s) => fibSet.has(s),
    },
];

export const checkAchievements = (streak: number, existingIds: string[]): Achievement[] => {
    const unlocked: Achievement[] = [];

    // Note: Some achievements are "milestones" (trigger once at exact value), 
    // others might be "recurring" types (like Prime Time triggering repeatedly).
    // For recurring types like Primes, we might not want to store them in "existingIds" 
    // if we want to show the celebration every time.
    // HOWEVER, usually "Achievements" in games are one-off.
    // Let's treat distinct values (Prime 3, Prime 5) as separate events logic-wise only for notification,
    // but if we treat "Prime Time" as a single trophy, it's weird.
    // approach: We return the definition if condition matches. The store decides if it's "new" or just a "recurring bonus".
    // For simplicity, let's just trigger notifications.

    return ACHIEVEMENT_DEFINITIONS.filter(ach => ach.condition(streak));
};
