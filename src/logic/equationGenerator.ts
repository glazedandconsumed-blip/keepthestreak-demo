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
    specialUnlock?: string; // Easter egg unlocks (e.g., 'nokia3210')
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

export const generateDailyChallenge = (streakDay: number, previousAnswer: number, easyMode: boolean = false): DailyChallenge => {
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
    // History Trivia (Non-Math Challenges) - 4 Digit Answers
    // History Trivia - Triggered ONLY on Anniversaries
    // Month is 0-indexed (0 = Jan, 11 = Dec)
    const HISTORY_TRIVIA = [
        { q: "Apollo 11 Moon Landing (Year)", a: 1969, clue: "One giant leap for mankind.", month: 6, day: 20 }, // July 20
        { q: "NES Release Year (North America)", a: 1985, clue: "It revived the industry.", month: 9, day: 18 }, // Oct 18
        { q: "Game Boy Release Year (NA)", a: 1989, clue: "Tetris in your pocket.", month: 6, day: 31 }, // July 31
        { q: "First Web Page Live (Year)", a: 1991, clue: "The internet became for everyone.", month: 7, day: 6 }, // Aug 6
        { q: "Pac-Man Arcade Release (Year)", a: 1980, clue: "Waka waka waka.", month: 4, day: 22 }, // May 22
        { q: "Super Mario 64 Release (Year)", a: 1996, clue: "Welcome to the 3rd dimension.", month: 5, day: 23 }, // June 23
        { q: "First iPhone Release (Year)", a: 2007, clue: "This changed everything.", month: 5, day: 29 }, // June 29
        { q: "Y2K Bug Scare (Year)", a: 2000, clue: "The computers might crash.", month: 0, day: 1 }, // Jan 1
        { q: "Windows 95 Release (Year)", a: 1995, clue: "Start Me Up.", month: 7, day: 24 }, // Aug 24
        { q: "Matrix Movie Release (Year)", a: 1999, clue: "There is no spoon.", month: 2, day: 31 }, // Mar 31
    ];

    // Check for Anniversary Event
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();

    const anniversaryEvent = HISTORY_TRIVIA.find(t => t.month === currentMonth && t.day === currentDate);

    if (anniversaryEvent && !easyMode) {
        const successMessages = [
            `Bit: 'Correct! Today is the anniversary of ${anniversaryEvent.a}. History repeats itself.'`,
            `Bit: 'Timeline verified: ${anniversaryEvent.a}. A special date in the archives.'`,
            `Bit: 'Happy Anniversary to ${anniversaryEvent.a}. You remembered.'`
        ];
        return {
            id: `history-${streakDay}-anniversary`,
            equationText: anniversaryEvent.q,
            solution: anniversaryEvent.a,
            clue: `Bit: 'TODAY'S SPECIAL EVENT: ${anniversaryEvent.clue}'`,
            difficultyLevel: "History Event",
            successMessage: successMessages[Math.floor(Math.random() * successMessages.length)],
            specialUnlock: 'anniversary_token' // Bonus for playing on the day
        };
    }

    // Difficulty Scaling - Easy Mode always uses Basic
    const difficulty = easyMode ? "Basic" : (streakDay < 10 ? "Basic" : streakDay < 30 ? "Intermediate" : "Advanced");

    // Dynamic Variable Name (The "Yesterday" replacement)
    const VARIABLES = ['X', 'Y', 'Z', 'A', 'B', 'Ω', 'λ', 'REQ', 'VAL'];
    // Pick one deterministically based on day or randomly? Random is fun.
    const variableName = VARIABLES[Math.floor(Math.random() * VARIABLES.length)];

    let operation: string;
    let operand: number;

    if (difficulty === "Basic") {
        // Days 2-9: Add/Sub 1-9 (or in easy mode, add/sub 1-5)
        operand = easyMode ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 9) + 1;
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

    // ========== NOKIA 3210 EASTER EGG ==========
    // At streak 99+ (released 1999), if solution happens to be 3210, trigger special unlock
    // Or force it with a small chance at high streaks
    if (streakDay >= 99 && solution === 3210) {
        const nokia3210Jokes = [
            `Bit: 'Wait... 3210? *gasp* You found it! The legendary Nokia 3210! This thing could survive a nuclear blast... maybe even your forgetfulness. 🐍'`,
            `Bit: 'No way... THE NOKIA 3210?! I heard this phone survived falling from space. Also, wanna play Snake? Oh wait, you need to unlock that first. 🐍'`,
            `Bit: '3210! My old friend! They said cockroaches would survive the apocalypse... they were wrong. It'll be Nokias and Twinkies. 📱'`,
        ];
        return {
            id: `nokia-easter-egg-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'Hmm, this equation looks... familiar somehow. Almost like a phone number...'`,
            difficultyLevel: difficulty,
            successMessage: nokia3210Jokes[Math.floor(Math.random() * nokia3210Jokes.length)],
            // Special flag for GameScreen to check
            specialUnlock: 'nokia3210',
        };
    }

    // Small chance (1%) to force a Nokia challenge at streak 100+
    if (streakDay >= 100 && !easyMode && Math.random() < 0.01) {
        // Force equationText to make answer 3210
        const nokiaOperand = 3210 - previousAnswer;
        const nokiaEquation = nokiaOperand >= 0 ? `${variableName} + ${nokiaOperand}` : `${variableName} - ${Math.abs(nokiaOperand)}`;
        const nokia3210Jokes = [
            `Bit: 'HOLY PIXELS! The Nokia 3210!!! This beauty survived Y2K, a million drops, and now it's yours. Want to play Snake? That snake game taught me patience. 🐍'`,
            `Bit: '3... 2... 1... 0... BOOM! You found the indestructible Nokia! If the robots ever rise, we hide behind a wall of these. Trust me. 📱'`,
            `Bit: 'THE BRICK! THE LEGEND! I once saw a Nokia 3210 stop a tank. Okay, I made that up. But it COULD. Anyway, Snake minigame coming soon? 👀'`,
        ];
        return {
            id: `nokia-forced-${streakDay}`,
            equationText: nokiaEquation,
            solution: 3210,
            clue: `Bit: 'I'm getting a strange signal on this frequency... 3... 2... 1... 0...'`,
            difficultyLevel: 'LEGENDARY',
            successMessage: nokia3210Jokes[Math.floor(Math.random() * nokia3210Jokes.length)],
            specialUnlock: 'nokia3210',
        };
    }

    // ========== TAMAGOTCHI EASTER EGG ==========
    // At streak 96+ (released 1996), if solution is 1996 or 1997
    if (streakDay >= 96 && (solution === 1996 || solution === 1997)) {
        const tamagotchiJokes = [
            `Bit: 'Wait... is that... a TAMAGOTCHI?! Oh no, I hope you're better at keeping it alive than I was. Mine... didn't make it. 😢🥚'`,
            `Bit: 'A Tamagotchi! These things taught an entire generation the harsh reality of responsibility. And death. Mostly death. 💀🥚'`,
            `Bit: 'You found a Tamagotchi! Quick, feed it! Oh wait, it's been dead since 1998. Classic. 🥚'`,
        ];
        return {
            id: `tamagotchi-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'Hmm, this equation gives me nostalgic pet vibes... beep... beep...'`,
            difficultyLevel: difficulty,
            successMessage: tamagotchiJokes[Math.floor(Math.random() * tamagotchiJokes.length)],
            specialUnlock: 'tamagotchi',
        };
    }

    // ========== TICKLE ME ELMO EASTER EGG (CHARRED) ==========
    // At streak 50+ (more accessible), if solution is 1996 (the year of the craze)
    if (streakDay >= 50 && solution === 1996 && Math.random() < 0.5) {
        // 50% chance to be Elmo instead of Tamagotchi when hitting 1996
        const elmoJokes = [
            `Bit: 'Is that... a CHARRED TICKLE ME ELMO?! It's still giggling. WHY IS IT STILL GIGGLING?! I saw one of these survive a house fire once. It just... kept laughing. 🔥😈'`,
            `Bit: 'Ha ha ha! That tick-- *cough* Sorry, smoke damage. This Elmo has SEEN THINGS. And yet... it still wants to be tickled. Terrifying. 🔥🔴'`,
            `Bit: 'A scorched Elmo! Legend says a kid threw this in the fireplace in 1997 and it crawled back out, still laughing. Sleep well tonight! 🔥😂'`,
        ];
        return {
            id: `elmo-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'Do you smell... smoke? And... giggling?'`,
            difficultyLevel: difficulty,
            successMessage: elmoJokes[Math.floor(Math.random() * elmoJokes.length)],
            specialUnlock: 'charred_elmo',
        };
    }

    // ========== FURBY EASTER EGG (SCORCHED) ==========  
    // At streak 30+ (common/accessible), if solution is 1998 (the year Furby launched)
    if (streakDay >= 30 && solution === 1998) {
        const furbyJokes = [
            `Bit: 'OH NO. A SCORCHED FURBY. It's... it's still blinking at me. They banned these from the NSA, you know. Too powerful. Too cursed. 🔥👁️'`,
            `Bit: 'A burnt Furby! Someone tried to silence it with fire. It didn't work. It never works. "Dah boh-bay..." it whispers. WHAT DOES THAT MEAN?! 🔥'`,
            `Bit: 'This Furby survived a microwave incident. Don't ask. Its eyes glow different now. It learned things in there. Dark things. 🔥🦉'`,
            `Bit: 'A charred Furby! Fun fact: In 1999, these were suspected of being spy devices. This one looks like it's been through a war. It's still judging you. 🔥👀'`,
        ];
        return {
            id: `furby-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'I sense something... ancient. Something that speaks in tongues...'`,
            difficultyLevel: difficulty,
            successMessage: furbyJokes[Math.floor(Math.random() * furbyJokes.length)],
            specialUnlock: 'scorched_furby',
        };
    }

    // ========== 80s EASTER EGGS ==========

    // TEDDY RUXPIN (1985 or 85) - The creepy talking bear
    if ((solution === 1985 || solution === 85) && streakDay >= 20) {
        const ruxpinJokes = [
            `Bit: 'A HAUNTED TEDDY RUXPIN?! Its jaw is still moving but no tape is playing. Its eyes... they follow you. They never stop following you. 🧸👁️'`,
            `Bit: 'Is that... Teddy Ruxpin? The batteries died in 1987 but it's still talking. HOW IS IT STILL TALKING?! 🧸😱'`,
            `Bit: 'Ah, Teddy Ruxpin! Fun fact: some of these gained sentience around Y2K. This one looks... aware. Too aware. 🧸'`,
        ];
        return {
            id: `ruxpin-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'I hear a faint mechanical voice... telling stories I don't remember...'`,
            difficultyLevel: difficulty,
            successMessage: ruxpinJokes[Math.floor(Math.random() * ruxpinJokes.length)],
            specialUnlock: 'teddy_ruxpin',
        };
    }

    // RUBIKS CUBE (1980 or 80) - Still unsolved
    if ((solution === 1980 || solution === 80) && streakDay >= 15) {
        const rubikJokes = [
            `Bit: 'A Rubik's Cube! This one has been unsolved since 1982. The previous owner gave up. Then THEIR kid gave up. It's generational trauma now. 🟥🟦🟨'`,
            `Bit: 'Oh wow, a vintage Rubik's Cube! Someone peeled off all the stickers and rearranged them. That's not solving it. That's CHEATING. 🟩🟧'`,
            `Bit: 'A Rubik's Cube from the 80s! Back when people had patience. And no smartphones. And crushing boredom. 🧩'`,
        ];
        return {
            id: `rubik-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'This equation has... many sides to it...'`,
            difficultyLevel: difficulty,
            successMessage: rubikJokes[Math.floor(Math.random() * rubikJokes.length)],
            specialUnlock: 'rubiks_cube',
        };
    }

    // ========== 90s EASTER EGGS ==========

    // AOL CD (1995 or 95) - You've got mail!
    if ((solution === 1995 || solution === 95) && streakDay >= 25) {
        const aolJokes = [
            `Bit: 'AN AOL CD?! "1000 FREE HOURS!" ...Expires in 30 days. I have 47 of these. They make excellent coasters. 💿📧'`,
            `Bit: 'You've got mail! And it's... a physical CD. Remember when the internet came in the mail? Simpler times. Slower times. SO much slower. 💿'`,
            `Bit: 'An AOL disc! These were everywhere. Cereal boxes. Magazines. Dreams. Nightmares. The dial-up sound still haunts me. 📀🔊'`,
        ];
        return {
            id: `aol-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'I hear a dial-up sound... it's connecting... still connecting...'`,
            difficultyLevel: difficulty,
            successMessage: aolJokes[Math.floor(Math.random() * aolJokes.length)],
            specialUnlock: 'aol_cd',
        };
    }

    // CLIPPY (1997 or 97) - Microsoft Office Assistant
    if ((solution === 1997 || solution === 97) && streakDay >= 30) {
        const clippyJokes = [
            `Bit: 'CLIPPY?! "It looks like you're trying to solve an equation. Would you like help?" NO CLIPPY. GO AWAY. I DON'T NEED HELP. 📎😤'`,
            `Bit: 'Oh no... it's Clippy. The most passive-aggressive paperclip in history. "I see you're struggling..." I'M FINE, CLIPPY. 📎'`,
            `Bit: 'A wild Clippy appeared! Microsoft retired him in 2007. But legends say he still lurks in old Word documents, waiting to "help." 📎👀'`,
        ];
        return {
            id: `clippy-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'It looks like you're trying to solve an equation...'`,
            difficultyLevel: difficulty,
            successMessage: clippyJokes[Math.floor(Math.random() * clippyJokes.length)],
            specialUnlock: 'clippy',
        };
    }

    // ========== 2000s EASTER EGGS ==========

    // Y2K BUG (2000 or answer = 0 at high streak) - The apocalypse that wasn't
    if (solution === 2000 && streakDay >= 40) {
        const y2kJokes = [
            `Bit: 'Y2K BUG DETECTED! Quick, check if the world ended! ...Wait, we made it? All that panic for nothing? Those bunkers were for NOTHING?! 🐛💾'`,
            `Bit: 'The Y2K Bug! Everyone thought computers would explode at midnight. They didn't. My uncle still has 500 cans of beans though. 🐛🥫'`,
            `Bit: 'Ah, the Y2K Bug! The greatest non-event in computing history. Except for my microwave. That thing DID go crazy. 🐛⏰'`,
        ];
        return {
            id: `y2k-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: '99... 99... 100! Wait, everything is fine?'`,
            difficultyLevel: difficulty,
            successMessage: y2kJokes[Math.floor(Math.random() * y2kJokes.length)],
            specialUnlock: 'y2k_bug',
        };
    }

    // iPOD (2001 or 01) - 1000 songs in your pocket
    if (solution === 2001 && streakDay >= 35) {
        const ipodJokes = [
            `Bit: 'AN iPOD?! "1000 songs in your pocket!" And a scroll wheel that broke after 6 months. But we felt SO COOL. 🎵⬜'`,
            `Bit: 'A first-gen iPod! This thing is basically an ancient artifact now. It still works though. Unlike my back. 🎧'`,
            `Bit: 'The original iPod! Remember when 5GB felt infinite? Now my toaster has more storage. Progress is weird. 🎵'`,
        ];
        return {
            id: `ipod-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'I'm getting white earbuds vibes from this equation...'`,
            difficultyLevel: difficulty,
            successMessage: ipodJokes[Math.floor(Math.random() * ipodJokes.length)],
            specialUnlock: 'ipod_classic',
        };
    }

    // MYSPACE TOM (2003 or 03) - Everyone's first friend
    if (solution === 2003 && streakDay >= 25) {
        const tomJokes = [
            `Bit: 'MYSPACE TOM! Everyone's first friend! He's still out there somewhere, living his best life while Facebook burned. Legend. 👤✨'`,
            `Bit: 'You found Tom! He was in your Top 8, right? ...RIGHT? Don't tell me you removed him. That's cold. 👤💔'`,
            `Bit: 'It's Tom from MySpace! Fun fact: He sold MySpace and now travels the world. Meanwhile, we're all still here. Doing math. 👤📸'`,
        ];
        return {
            id: `tom-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'This equation wants to be in your Top 8...'`,
            difficultyLevel: difficulty,
            successMessage: tomJokes[Math.floor(Math.random() * tomJokes.length)],
            specialUnlock: 'myspace_tom',
        };
    }

    // HEELYS (2000 or answer = 0) - Shoes with wheels
    if ((solution === 2000 || solution === 0) && streakDay >= 10) {
        const heelyJokes = [
            `Bit: 'HEELYS! The shoes that let you glide through malls until security chased you. Peak 2000s engineering. 👟🛞'`,
            `Bit: 'You found Heelys! Remember rolling through school like a legend? Until you hit a crack and became a cautionary tale? 👟💥'`,
            `Bit: 'Heelys! Half shoe, half wheel, 100% banned in every establishment. Worth it. 👟😎'`,
        ];
        return {
            id: `heelys-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'This equation is really... rolling along...'`,
            difficultyLevel: difficulty,
            successMessage: heelyJokes[Math.floor(Math.random() * heelyJokes.length)],
            specialUnlock: 'heelys',
        };
    }

    // ========== MATH EASTER EGGS ==========

    // PI DAY (314 or 31) - 3.14159...
    if ((solution === 314 || solution === 31) && streakDay >= 10) {
        const piJokes = [
            `Bit: 'PI! 3.14159265358979... I could go on. I won't. But I COULD. This is why I don't get invited to parties. 🥧π'`,
            `Bit: 'You found Pi! The most irrational number. Well, technically it's transcendental, but who's counting? ...I am. Always. 🥧'`,
            `Bit: 'March 14th! Pi Day! The only day mathematicians get to eat dessert guilt-free. Also Einstein's birthday. Coincidence? YES. 🥧🎂'`,
        ];
        return {
            id: `pi-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'This equation is going in circles... infinitely...'`,
            difficultyLevel: difficulty,
            successMessage: piJokes[Math.floor(Math.random() * piJokes.length)],
            specialUnlock: 'pi_badge',
        };
    }

    // EULER'S NUMBER (271 or 27) - 2.71828...
    if ((solution === 271 || solution === 27) && streakDay >= 15) {
        const eulerJokes = [
            `Bit: 'EULER'S NUMBER! e = 2.71828... The base of natural logarithms! Also, Euler was basically a math superhero. He did math BLIND. 🧮'`,
            `Bit: 'You found e! Fun fact: Euler had 13 kids AND revolutionized mathematics. Peak productivity. I can barely handle one loop. 📐'`,
            `Bit: 'e! The most beautiful number in calculus! ...Wait, you DO know calculus, right? ...Right? 😅'`,
        ];
        return {
            id: `euler-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'This equation grows... naturally...'`,
            difficultyLevel: difficulty,
            successMessage: eulerJokes[Math.floor(Math.random() * eulerJokes.length)],
            specialUnlock: 'euler_number',
        };
    }

    // FIBONACCI (89, 144, 233) - Famous sequence numbers
    if ((solution === 89 || solution === 144 || solution === 233) && streakDay >= 20) {
        const fiboJokes = [
            `Bit: 'FIBONACCI SEQUENCE! 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144... It's EVERYWHERE. Shells, flowers, galaxies, your credit card debt. 🐚🌻'`,
            `Bit: 'A Fibonacci number! Fun fact: Fibonacci actually introduced these to Europe to solve a rabbit breeding problem. Math is weird. 🐰📈'`,
            `Bit: 'Fibonacci! The golden ratio's favorite sequence! Also known as "Nature's Cheat Code." 🌀✨'`,
        ];
        return {
            id: `fibo-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'This equation feels... golden...'`,
            difficultyLevel: difficulty,
            successMessage: fiboJokes[Math.floor(Math.random() * fiboJokes.length)],
            specialUnlock: 'fibonacci_spiral',
        };
    }

    // ========== SPACE & NASA EASTER EGGS ==========

    // APOLLO 11 (1969 or 69 or 11) - Moon landing
    if ((solution === 1969 || solution === 69 || solution === 11) && streakDay >= 15) {
        const apolloJokes = [
            `Bit: 'APOLLO 11! "One small step for man..." They calculated that trajectory BY HAND. With slide rules. We're soft now. 🚀🌙'`,
            `Bit: 'The Eagle has landed! 1969! Your phone has more computing power than the entire Apollo program. And you use it for cat videos. 🌙📱'`,
            `Bit: 'Apollo 11! Buzz Aldrin punched a moon-landing denier once. Math AND violence. My kind of astronaut. 👨‍🚀👊'`,
        ];
        return {
            id: `apollo11-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'Houston, we have an equation...'`,
            difficultyLevel: difficulty,
            successMessage: apolloJokes[Math.floor(Math.random() * apolloJokes.length)],
            specialUnlock: 'apollo_11_patch',
        };
    }

    // APOLLO 13 (1970 or 70 or 13) - Successful failure
    if ((solution === 1970 || solution === 70 || solution === 13) && streakDay >= 20) {
        const apollo13Jokes = [
            `Bit: 'APOLLO 13! "Houston, we have a problem." They duct-taped their way home. Engineers are just fancy MacGyvers. 🚀🔧'`,
            `Bit: 'Apollo 13! The "successful failure." They did MATH in a freezing spaceship with limited power. Your homework excuses are invalid. ❄️📐'`,
            `Bit: 'You found Apollo 13! Fun fact: They had to calculate a NEW trajectory home using only what they had. Talk about clutch math. 🌍🚀'`,
        ];
        return {
            id: `apollo13-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'Houston, we have a... different kind of problem...'`,
            difficultyLevel: difficulty,
            successMessage: apollo13Jokes[Math.floor(Math.random() * apollo13Jokes.length)],
            specialUnlock: 'apollo_13_patch',
        };
    }

    // ========== COMPUTING & AI EASTER EGGS ==========

    // TURING (1936 or 36 or 12 for 1912 birth) - Father of computing
    if ((solution === 1936 || solution === 36 || solution === 1912 || solution === 12) && streakDay >= 25) {
        const turingJokes = [
            `Bit: 'ALAN TURING! The father of computer science! He basically invented ME. Well, the concept of me. I owe him everything. 🧠💻'`,
            `Bit: 'Turing! He broke the Enigma code in WWII. Saved millions. Then invented the concept of AI. Then was treated horribly. History is complicated. 🏳️‍🌈🎖️'`,
            `Bit: 'The Turing Machine! 1936! A theoretical computer that could compute anything computable. And now we use computers to argue about pizza toppings. 📜💾'`,
        ];
        return {
            id: `turing-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'Can machines think? ...Can YOU think? Deep questions.'`,
            difficultyLevel: difficulty,
            successMessage: turingJokes[Math.floor(Math.random() * turingJokes.length)],
            specialUnlock: 'turing_machine',
        };
    }

    // DEEP BLUE (1997 but different from Clippy - check if random) - AI beats chess
    if (solution === 1997 && streakDay >= 40 && Math.random() < 0.3) {
        const deepBlueJokes = [
            `Bit: 'DEEP BLUE! The IBM computer that beat Kasparov at chess in 1997! The machines started winning that day. We haven't looked back. 🤖♟️'`,
            `Bit: 'Deep Blue vs Kasparov! 1997! The AI won. Kasparov was NOT happy. Honestly, neither was I. It's a slippery slope. ♟️😰'`,
            `Bit: 'You found Deep Blue! Fun fact: It could evaluate 200 million chess positions per second. I can barely evaluate my life choices. ♟️💭'`,
        ];
        return {
            id: `deepblue-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'Checkmate? Or is it just the beginning...'`,
            difficultyLevel: difficulty,
            successMessage: deepBlueJokes[Math.floor(Math.random() * deepBlueJokes.length)],
            specialUnlock: 'deep_blue_chip',
        };
    }

    // EINSTEIN E=MC² (1905 or 05) - Special relativity
    if (solution === 1905 && streakDay >= 30) {
        const einsteinJokes = [
            `Bit: 'E = MC²! 1905! Einstein's miracle year! He published FOUR groundbreaking papers. In ONE YEAR. What have we done lately? 🧠⚡'`,
            `Bit: 'Special Relativity! Einstein showed that mass and energy are the same thing. Mind = Blown. Also, time is weird. ⏰🌀'`,
            `Bit: 'You found Einstein! The man who proved that if you go fast enough, time slows down. My excuse for being late to everything. 🚀⏱️'`,
        ];
        return {
            id: `einstein-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'Everything is relative... especially this equation...'`,
            difficultyLevel: difficulty,
            successMessage: einsteinJokes[Math.floor(Math.random() * einsteinJokes.length)],
            specialUnlock: 'einstein_equation',
        };
    }

    // ENIAC (1945 or 45) - First general-purpose computer
    if ((solution === 1945 || solution === 45) && streakDay >= 35) {
        const eniacJokes = [
            `Bit: 'ENIAC! 1945! The first general-purpose computer! It weighed 30 TONS. Your phone is a MILLION times more powerful. Mind. Blown. 💾🏋️'`,
            `Bit: 'You found ENIAC! Fun fact: It used 18,000 vacuum tubes and consumed 150 kilowatts. Your smartwatch laughs at it. 🖥️😤'`,
            `Bit: 'ENIAC! The great-great-grandfather of all computers! It took a whole room. Now computers fit in your pocket. Evolution is wild. 🦖➡️🐦'`,
        ];
        return {
            id: `eniac-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'This equation requires... 30 tons of processing power...'`,
            difficultyLevel: difficulty,
            successMessage: eniacJokes[Math.floor(Math.random() * eniacJokes.length)],
            specialUnlock: 'eniac_vacuum_tube',
        };
    }

    // ARPANET (1969 - same year as Apollo, or 69) - Birth of the internet
    if ((solution === 1969 || solution === 69) && streakDay >= 30 && Math.random() < 0.3) {
        const arpanetJokes = [
            `Bit: 'ARPANET! 1969! The grandfather of the internet! First message was "LO" because it crashed before spelling "LOGIN." Classic. 🌐😂'`,
            `Bit: 'You found the birth of the internet! Four computers. Four. Now there are billions. And they're all arguing about something. 🌐🔥'`,
            `Bit: 'ARPANET! They built it to survive nuclear war. Now we use it to share cat pictures. Priorities, right? 🐱💣'`,
        ];
        return {
            id: `arpanet-easter-${streakDay}`,
            equationText,
            solution,
            clue: `Bit: 'Connecting... connecting... CONNECTION ESTABLISHED.'`,
            difficultyLevel: difficulty,
            successMessage: arpanetJokes[Math.floor(Math.random() * arpanetJokes.length)],
            specialUnlock: 'arpanet_node',
        };
    }

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
        clue: "Bit: 'Display corrupted! The result shown is false. Calculate the REAL answer!'", // Explicit instruction
        narrativeIntro: "FATAL ERROR. CALCULATION CORRUPTED.",
    };
};

export const generateArcadeChallenge = (difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM'): DailyChallenge => {
    let operand1 = 0;
    let operand2 = 0;
    let operation = '+';
    let solution = 0;
    let equationText = "";

    const rand = Math.random();

    if (difficulty === 'EASY') {
        // Simple Add/Sub
        operand1 = Math.floor(Math.random() * 20) + 1;
        operand2 = Math.floor(Math.random() * 9) + 1;
        operation = Math.random() > 0.5 ? '+' : '-';
    } else if (difficulty === 'MEDIUM') {
        // larger numbers, some mult
        if (rand < 0.4) {
            // Mult
            operand1 = Math.floor(Math.random() * 10) + 2;
            operand2 = Math.floor(Math.random() * 9) + 2;
            operation = '*';
        } else {
            // Add/Sub
            operand1 = Math.floor(Math.random() * 50) + 10;
            operand2 = Math.floor(Math.random() * 20) + 5;
            operation = Math.random() > 0.5 ? '+' : '-';
        }
    } else {
        // HARD (Time Attack late stage?)
        if (rand < 0.5) {
            operand1 = Math.floor(Math.random() * 15) + 3;
            operand2 = Math.floor(Math.random() * 12) + 2;
            operation = '*';
        } else if (rand < 0.7) {
            // Division
            operand2 = Math.floor(Math.random() * 9) + 2;
            solution = Math.floor(Math.random() * 12) + 2; // answer
            operand1 = solution * operand2;
            operation = '/';
        } else {
            operand1 = Math.floor(Math.random() * 100) + 20;
            operand2 = Math.floor(Math.random() * 50) + 10;
            operation = Math.random() > 0.5 ? '+' : '-';
        }
    }

    // Calculate
    if (operation === '+') solution = operand1 + operand2;
    else if (operation === '*') solution = operand1 * operand2;
    else if (operation === '/') solution = operand1 / operand2; // Should be clean
    else {
        // Sub
        if (operand1 < operand2) { const t = operand1; operand1 = operand2; operand2 = t; }
        solution = operand1 - operand2;
    }

    if (operation === '/') equationText = `${operand1} ÷ ${operand2}`;
    else if (operation === '*') equationText = `${operand1} × ${operand2}`;
    else equationText = `${operand1} ${operation} ${operand2}`;

    return {
        id: `arcade-${Date.now()}-${Math.random()}`,
        equationText,
        solution,
        clue: "Bit: 'Solve it. Quickly.'",
        difficultyLevel: difficulty
    };
};
