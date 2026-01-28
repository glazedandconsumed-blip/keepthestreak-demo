export interface LeaderboardEntry {
    id: string;
    name: string;
    streak: number;
    failures: number; // 0 = Perfect Run
    isPlayer: boolean;
}

const MOCK_NAMES = ["AlgebraAlf", "MathWhiz99", "StreakKing", "Pithon", "GeoMetric"];

export const getLeaderboardData = (playerStreak: number, playerFailures: number): LeaderboardEntry[] => {
    // Generate some static-ish fake data
    const bots: LeaderboardEntry[] = MOCK_NAMES.map((name, index) => ({
        id: `bot-${index}`,
        name,
        streak: 50 - (index * 8) + (Math.floor(Math.random() * 5)), // e.g. 50, 42, 34...
        failures: index === 0 ? 0 : Math.floor(Math.random() * 5), // Top bot is perfect
        isPlayer: false,
    }));

    const playerEntry: LeaderboardEntry = {
        id: 'player',
        name: 'YOU',
        streak: playerStreak,
        failures: playerFailures,
        isPlayer: true,
    };

    const all = [...bots, playerEntry];
    // Sort by Streak desc
    return all.sort((a, b) => b.streak - a.streak);
};
