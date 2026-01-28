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
    latestUnlock: string | null; // For showing UI notification

    // Profile Stats
    peakStreak: number;
    totalFailures: number;

    // Actions
    loseLife: () => void;
    addCredit: () => void;
    incrementStreak: (nextAnswer: number) => void;
    clearLatestUnlock: () => void;
    resetGame: () => void;
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
            latestUnlock: null,
            peakStreak: 0,
            totalFailures: 0,

            loseLife: () => {
                const { lives, credits } = get();
                if (lives > 1) {
                    set({ lives: lives - 1 });
                } else {
                    // Game Over logic or Credit usage
                    if (credits > 0) {
                        // Auto-use credit or prompt? For now, let's just use it to refill lives
                        set({ lives: 3, credits: credits - 1 });
                        // In a real game, this would be a "Continue?" screen
                    } else {
                        // Truly Game Over - Reset Streak
                        get().resetGame();
                    }
                }
            },

            addCredit: () => set((state) => ({ credits: state.credits + 1 })),

            incrementStreak: (nextAnswer) => set((state) => {
                const newStreak = state.streak + 1;

                // Check achievements
                const justUnlocked = checkAchievements(newStreak, state.unlockedAchievements);
                // We can concatenate new notifications. For now just show the last one meaningful.
                // Or store simple notification text.
                const notification = justUnlocked.length > 0
                    ? `🏆 ${justUnlocked.map(a => a.title).join(' & ')}!`
                    : null;

                return {
                    streak: newStreak,
                    currentDay: state.currentDay + 1,
                    lastAnswer: nextAnswer,
                    lives: 3, // Refill lives
                    latestUnlock: notification || state.latestUnlock, // Keep old if unread, or overwrite
                    unlockedAchievements: [...state.unlockedAchievements, ...justUnlocked.map(a => a.id)],
                    peakStreak: Math.max(state.peakStreak, newStreak),
                };
            }),

            clearLatestUnlock: () => set({ latestUnlock: null }),

            resetGame: () => set((state) => ({
                streak: 0,
                lives: 3,
                currentDay: 1,
                lastAnswer: 1,
                todayEquation: 'The Answer is 1',
                latestUnlock: null,
                unlockedAchievements: [], // Reset achievements on full fail? Maybe keep them? 
                // User said "Start again", implies fresh run. But usually achievements persist.
                // Let's keep achievements but reset streak.
                // Profile stats update:
                totalFailures: state.totalFailures + 1,
            })),
        }),
        {
            name: 'keep-the-streak-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
