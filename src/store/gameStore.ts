import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameState {
    streak: number;
    lives: number;
    credits: number;
    currentDay: number;
    lastAnswer: number | null; // The number to remember
    todayEquation: string | null; // The equation to solve today
    unlockedAchievements: string[]; // List of Achievement IDs unlocked (conceptually, mostly for one-offs)
    inventory: string[]; // Array of LootItem IDs
    latestUnlock: string | null; // For showing UI notification
    streakProtected: boolean; // Cryo Freeze active
    isPro: boolean; // Shareware unlock status

    // Profile Stats
    peakStreak: number;
    totalFailures: number;

    // Actions
    loseLife: () => void;
    addCredit: () => void;
    incrementStreak: (nextAnswer: number) => void;
    clearLatestUnlock: () => void;
    resetGame: () => void;
    addItem: (itemId: string) => void;
    consumeItems: (itemIds: string[]) => void;
    useConsumable: (itemId: string) => { success: boolean; effect?: string };
    addLife: () => void;
    activateStreakProtection: () => void;
    unlockPro: () => void;
}

import { checkAchievements } from '../logic/achievementSystem';

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            streak: 0,
            lives: 3,
            credits: 1, // Start with 1 credit
            currentDay: 1,
            lastAnswer: 1, // Day 1 starts with answer 1 (the clue)
            todayEquation: 'The Answer is 1', // Day 1 special case
            unlockedAchievements: [],
            inventory: [],
            latestUnlock: null,
            peakStreak: 0,
            totalFailures: 0,
            streakProtected: false,
            isPro: false,

            loseLife: () => {
                const { lives, streakProtected } = get();
                if (lives > 1) {
                    set({ lives: lives - 1 });
                } else {
                    // Would be Game Over, but check for streak protection
                    if (streakProtected) {
                        // Protection consumed, refill lives instead of resetting
                        set({ lives: 3, streakProtected: false });
                    } else {
                        // True Game Over - Reset Streak
                        get().resetGame();
                    }
                }
            },

            addCredit: () => set((state) => ({ credits: state.credits + 1 })),

            addLife: () => set((state) => ({ lives: Math.min(state.lives + 1, 5) })), // Max 5 lives

            activateStreakProtection: () => set({ streakProtected: true }),

            unlockPro: () => set({ isPro: true }),

            incrementStreak: (nextAnswer) => {
                console.log(`[GAME_STORE] incrementStreak called. nextAnswer: ${nextAnswer}`);
                set((state) => {
                    const newStreak = state.streak + 1;
                    console.log(`[GAME_STORE] Updating state. New Streak: ${newStreak}, New LastAnswer: ${nextAnswer}`);

                    // Check achievements
                    const justUnlocked = checkAchievements(newStreak, state.unlockedAchievements);
                    const notification = justUnlocked.length > 0
                        ? `🏆 ${justUnlocked.map(a => a.title).join(' & ')}!`
                        : null;

                    return {
                        streak: newStreak,
                        currentDay: state.currentDay + 1,
                        lastAnswer: nextAnswer,
                        lives: 3, // Refill lives
                        latestUnlock: notification || state.latestUnlock,
                        unlockedAchievements: [...state.unlockedAchievements, ...justUnlocked.map(a => a.id)],
                        peakStreak: Math.max(state.peakStreak, newStreak),
                    };
                });
            },

            clearLatestUnlock: () => set({ latestUnlock: null }),
            // ... (rest of actions unchanged, just ensuring structure matches)
            addItem: (itemId: string) => set((state) => ({
                inventory: [...state.inventory, itemId],
            })),
            consumeItems: (itemIds: string[]) => set((state) => {
                const newInventory = [...state.inventory];
                itemIds.forEach(id => {
                    const index = newInventory.indexOf(id);
                    if (index > -1) {
                        newInventory.splice(index, 1);
                    }
                });
                return { inventory: newInventory };
            }),

            useConsumable: (itemId: string) => {
                const { inventory, lives, streakProtected } = get();
                if (!inventory.includes(itemId)) {
                    return { success: false };
                }

                get().consumeItems([itemId]);

                switch (itemId) {
                    case 'extra_life':
                        get().addLife();
                        return { success: true, effect: '+1 LIFE' };
                    case 'streak_freeze':
                        if (streakProtected) return { success: false };
                        get().activateStreakProtection();
                        return { success: true, effect: 'STREAK PROTECTED' };
                    case 'hint_token': return { success: true, effect: 'HINT_REVEAL' };
                    case 'easy_mode': return { success: true, effect: 'EASY_MODE' };
                    case 'bypass_protocol': return { success: true, effect: 'DEPENDENCY_BYPASSED' };
                    default: return { success: false };
                }
            },

            resetGame: () => {
                console.log("[GAME_STORE] resetGame called!");
                set((state) => ({
                    streak: 0,
                    lives: 3,
                    currentDay: 1,
                    lastAnswer: 1,
                    todayEquation: 'The Answer is 1',
                    latestUnlock: null,
                    streakProtected: false,
                    totalFailures: state.totalFailures + 1,
                }));
            },
        }),
        {
            name: 'keep-the-streak-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                console.log('[GAME_STORE] Hydration finished. Loaded state:', state);
                if (state) {
                    console.log(`[GAME_STORE] Loaded Streak: ${state.streak}, LastAnswer: ${state.lastAnswer}`);
                }
            }
        }
    )
);
