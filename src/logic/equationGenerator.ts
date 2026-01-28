// Simple Seeded RNG (Linear Congruential Generator)
class SeededRNG {
    private seed: number;
    constructor(seed: number) {
        this.seed = seed;
    }
    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
}

// Convert "YYYY-MM-DD" to a numeric seed
const getDateSeed = (dateString: string): number => {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

const NARRATIVES = [
    "Bit: 'I found a corruption in Sector 7... code looks like this.'",
    "Bit: 'The timeline is fraying. Stitch it back together.'",
    "Bit: 'System Alert: Logic failure detected. Please resolve.'",
    "Bit: 'Is this... algebra? I hate algebra. You do it.'",
    "Bit: 'Bypassing the MegaDrive security protocol...'",
    "Bit: 'Watch out for the Blue Shell logic bomb.'",
    "Bit: 'It\\'s dangerous to go alone! Take this equation.'",
    "Bit: 'Calculating jump trajectory... Press A to jump.'",
    "Bit: 'Error 404: Answer not found. Just kidding, it is here.'",
    "Bit: 'Up, Up, Down, Down, Left, Right... wait, that is not it.'",
    "Bit: 'Blow into the cartridge if it doesn\\'t load.'",
    "Bit: 'Prepare for Blast Processing!'",
    "Bit: 'The cake is a lie, but this math is real.'",
    "Bit: 'All your base are belong to... this division problem.'",
    "Bit: 'Snake? Snake?! SNAAAAAAAKE! (He failed the division).'",
    "Bit: 'I buried this equation in the desert with E.T.'",
    "Bit: 'Developers, Developers, Developers, Developers...'",
    "Bit: 'A winner is you! (If you solve this).'",
    "Bit: 'Hold Reset while turning off the power to save.'",
    "Bit: 'This logic is Vaporware. Make it real.'",
    "Bit: 'Press F to pay respects to the wrong answer.'",
    "Bit: 'War. War never changes. But math does.'",
    "Bit: 'Hey! Listen! Solving this equation is key.'",
    "Bit: 'It is a secret to everybody.'",
    "Bit: 'The cake is a lie, but the remainder is 0.'",
    // Scavenger Storyline
    "Bit: 'Scavenged a pristine 6502 processor. Beautiful.'",
    "Bit: 'Found a Dreamcast in the rubble. It is still thinking.'",
    "Bit: 'Harvesting capacitors from a dead GameGear.'",
    "Bit: 'We need more RAM. Check that N64 Expansion Pak.'",
    "Bit: 'My connectors are dusty... Blow on the cartridge?'",
    "Bit: 'Salvaged a BLAST PROCESSING unit. High speed math incoming.'",
];

export interface DailyChallenge {
    id: string; // Unique ID for finding stats
    equationText: string;
    solution: number;
    clue?: string;
    difficultyLevel: string;
    narrativeIntro?: string; // Story snippet from Bit
}

export const generateGlobalDailyChallenge = (dateString: string): DailyChallenge => {
    const seed = getDateSeed(dateString);
    const rng = new SeededRNG(seed);

    // Story Beats happen on specific days or randomly
    // For now, let's just make a cool math puzzle
    const difficultyRoll = rng.next();
    const difficultyLevel = difficultyRoll < 0.3 ? "Basic" : difficultyRoll < 0.8 ? "Intermediate" : "Advanced";

    let operand1 = Math.floor(rng.next() * 20) + 5;
    let operand2 = Math.floor(rng.next() * 10) + 2;
    let operation = rng.next() > 0.5 ? '+' : '-';

    if (difficultyLevel === "Intermediate") {
        operation = rng.next() > 0.5 ? '*' : '/';
    } else if (difficultyLevel === "Advanced") {
        operand1 = Math.floor(rng.next() * 50) + 10;
        operand2 = Math.floor(rng.next() * 12) + 3;
        operation = '*';
    }

    let solution = 0;
    let equationText = "";

    // ensure logic
    if (operation === '/') {
        // Force clean division
        solution = operand1;
        const total = operand1 * operand2;
        equationText = `${total} ÷ ${operand2}`;
    } else if (operation === '*') {
        solution = operand1 * operand2;
        equationText = `${operand1} × ${operand2}`;
    } else if (operation === '-') {
        // avoid negative for now
        if (operand1 < operand2) {
            const temp = operand1; operand1 = operand2; operand2 = temp;
        }
        solution = operand1 - operand2;
        equationText = `${operand1} - ${operand2}`;
    } else {
        solution = operand1 + operand2;
        equationText = `${operand1} + ${operand2}`;
    }

    const narrativeIndex = Math.floor(rng.next() * NARRATIVES.length);

    return {
        id: `daily-${dateString}`,
        equationText: equationText,
        solution: solution,
        clue: NARRATIVES[narrativeIndex],
        difficultyLevel,
        narrativeIntro: "System Override Initiated..."
    };
};

export const generateDailyChallenge = (streakDay: number, previousAnswer: number): DailyChallenge => {
    // Picking a random narrative for personal streak too
    const narrativeIndex = Math.floor(Math.random() * NARRATIVES.length);
    const randomNarrative = NARRATIVES[narrativeIndex];

    // Day 1 Special Case
    if (streakDay === 1) {
        return {
            id: 'legacy-day-1',
            equationText: "The Answer is 1",
            solution: 1,
            clue: "Welcome! Remember: The answer is 1.",
            difficultyLevel: "Tutorial",
        };
    }

    // ... (rest of legacy logic for now, returning simplified object)
    // Difficulty Scaling
    const difficulty = streakDay < 10 ? "Basic" : streakDay < 30 ? "Intermediate" : "Advanced";

    // Dynamic Variable Name (The "Yesterday" replacement)
    const VARIABLES = ['X', 'Y', 'Z', 'A', 'B', 'Ω', 'λ', 'REQ', 'VAL'];
    // Pick one deterministically based on day or randomly? Random is fun.
    const variableName = VARIABLES[Math.floor(Math.random() * VARIABLES.length)];

    let operation: string;
    let operand: number;

    if (difficulty === "Basic") {
        // Days 2-9: Add/Sub 1-9
        operand = Math.floor(Math.random() * 9) + 1;
        operation = Math.random() > 0.5 ? '+' : '-';
    } else if (difficulty === "Intermediate") {
        // Days 10-29: Mul/Div/Add/Sub with larger numbers
        // 40% Mul, 20% Div, 40% Add/Sub
        const rand = Math.random();
        if (rand < 0.4) {
            operation = '*';
            operand = Math.floor(Math.random() * 5) + 2; // * 2 to 6
        } else if (rand < 0.6) {
            operation = '/'; // Ensure divisibility below
            operand = Math.floor(Math.random() * 3) + 2; // / 2 to 4
        } else {
            operation = Math.random() > 0.5 ? '+' : '-';
            operand = Math.floor(Math.random() * 20) + 5; // Larger Add/Sub
        }
    } else {
        // Advanced (Day 30+): TBD - placeholder for now, stick to Intermediate logic but harder
        operation = '*';
        operand = Math.floor(Math.random() * 9) + 2;
    }

    let solution: number;
    let equationText: string;

    if (operation === '+') {
        solution = previousAnswer + operand;
        equationText = `${variableName} + ${operand}`;
    } else if (operation === '-') {
        if (previousAnswer < operand) {
            // Avoid negative if complex, or allow it. Let's allow simple negatives.
            // Actually for game flow, keeping it positive is often nicer for "Memory".
            // Let's swap operation if negative
            solution = previousAnswer + operand;
            equationText = `${variableName} + ${operand}`;
        } else {
            solution = previousAnswer - operand;
            equationText = `${variableName} - ${operand}`;
        }
    } else if (operation === '*') {
        solution = previousAnswer * operand;
        equationText = `${variableName} × ${operand}`;
    } else if (operation === '/') {
        // Ensure clean division. If not divisible, fallback to + or *
        if (previousAnswer % operand === 0 && previousAnswer !== 0) {
            solution = previousAnswer / operand;
            equationText = `${variableName} ÷ ${operand}`;
        } else {
            // Fallback
            operand = Math.floor(Math.random() * 5) + 2;
            solution = previousAnswer * operand;
            equationText = `${variableName} × ${operand}`;
        }
    } else {
        // Default safety
        solution = previousAnswer + 1;
        equationText = `${variableName} + 1`;
    }

    // Success Message for tomorrow
    const successMessages = [
        `Bit: 'Good. ${variableName} is set to ${solution}. Don't forget it.'`,
        `Bit: 'System patched. Variable ${variableName} holding value ${solution}.'`,
        `Bit: 'Memory updated. ${variableName} = ${solution}.'`,
        `Bit: 'Keep ${solution} in your buffer. We need it tomorrow.'`,
        `Bit: 'Nice. ${variableName} is now ${solution}. Write it down.'`,
        // Cheeky variants (with tone indicators)
        `Bit: 'I saw you reach for a pen. Don't write ${solution} down, cheat. ;)'`,
        `Bit: 'Store ${solution} in your hippocampus, not on your hand. Haha.'`,
        `Bit: 'I bet you'll forget ${solution} by tomorrow. Just kidding (mostly).'`,
        `Bit: 'If you screenshot this ${solution}, I will know. 👀'`,
        `Bit: '${variableName} = ${solution}. This will be on the test. *wink*'`,
        `Bit: 'Don't even think about using a calculator for ${variableName}. 🤖'`,
        `Bit: '${solution}. If you forget, I uninstall myself. Kidding!'`,
        `Bit: 'Memorize ${solution}. Your streak depends on it. No pressure. 😂'`,
        `Bit: 'Psst... the answer is ${solution}. Keep it secret. 🤫'`,
        `Bit: '${variableName} is ${solution}. I'd write it on a sticky note if I had hands.'`,
        `Bit: 'System Log: User memorized ${solution}. Trust level increasing... maybe.'`,
        `Bit: 'Error: ${solution} is too easy to forget. Try harder! 😜'`,
    ];
    const successMessage = successMessages[Math.floor(Math.random() * successMessages.length)];

    return {
        id: `streak-${streakDay}`,
        equationText,
        solution,
        clue: randomNarrative.replace("Yesterday", variableName), // Just in case narrative uses it
        difficultyLevel: difficulty,
        // We'll attach the variable info if needed by UI, but it's baked into text now
        // But we return a "successMessage" for the UI to display AFTER unlock
        successMessage: successMessage,
    };
};

// Extend interface to include the new optional field
declare module "./equationGenerator" {
    interface DailyChallenge {
        successMessage?: string;
    }
}

export interface GlitchChallenge extends DailyChallenge {
    isGlitch: boolean;
    brokenEquation: string; // The visual "lie"
}

// Glitch Mode: The equation shown is WRONG. User must type the CORRECT answer to "fix" it.
export const generateGlitchChallenge = (streakDay: number, previousAnswer: number): GlitchChallenge => {
    // 1. Generate a standard challenge to get a valid solution
    const baseChallenge = generateDailyChallenge(streakDay, previousAnswer);

    // 2. Corrupt the text
    // Example: Real: "4 + 4", Solution: 8
    // Glitch: "4 + 4 = 77" -> User must type "8"
    // OR Glitch: "4 + 5" (when it should be 4+4) -> Result 9? No that's confusing.
    // Best Glitch: Show an EQUALITY that is FALSE.
    // "10 + 5 = 99"
    // User sees equation, sees it's wrong, calculates real result.

    // Make a fake result
    const fakeResult = Math.floor(Math.random() * 50) + baseChallenge.solution + 3;

    return {
        ...baseChallenge,
        isGlitch: true,
        brokenEquation: `${baseChallenge.equationText} = ${fakeResult}`,
        clue: "Bit: 'ERROR! LOGIC MISMATCH! OVERRIDE REQUIRED!'", // System panic
        narrativeIntro: "FATAL ERROR. CALCULATION CORRUPTED.",
    };
};
