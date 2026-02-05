import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SecurityTerminal } from '../components/SecurityTerminal';
import { generateDailyChallenge, generateArcadeChallenge } from '../logic/equationGenerator';
import { HapticPatterns } from '../logic/haptics';
import { useGameStore } from '../store/gameStore';

export const ZenModeScreen = ({ theme, onBack, onUpdateTracker }) => {
    const addCredit = useGameStore(state => state.addCredit);
    const [zenStreak, setZenStreak] = useState(1);
    const [lastAnswer, setLastAnswer] = useState(1);
    const [challenge, setChallenge] = useState(generateDailyChallenge(1, 1));
    const [miningProgress, setMiningProgress] = useState(0); // 0 to 5
    const [creditsEarnedSession, setCreditsEarnedSession] = useState(0);

    // Sync Tracker
    React.useEffect(() => {
        if (onUpdateTracker) {
            onUpdateTracker(lastAnswer);
        }
    }, [lastAnswer, onUpdateTracker]);

    // Blue/Calm Theme Override
    const zenTheme = {
        ...theme,
        accent: '#00FFFF', // Cyan
        background: '#001122', // Deep Blue
        textPrimary: '#E0F0FF',
        textSecondary: '#6688AA',
        buttonStyle: {
            borderColor: '#0088AA',
            backgroundColor: '#002233'
        }
    };

    const nextChallenge = (currentSolution) => {
        const nextDay = zenStreak + 1;
        setZenStreak(nextDay);
        setLastAnswer(currentSolution);
        setChallenge(generateDailyChallenge(nextDay, currentSolution));
    };

    const handleUnlock = () => {
        HapticPatterns.unlock();

        // Mining Logic
        const newProgress = miningProgress + 1;
        if (newProgress >= 5) {
            // Block Mined!
            addCredit(1);
            setCreditsEarnedSession(prev => prev + 1);
            setMiningProgress(0);
            HapticPatterns.success(); // Distinct sound?
        } else {
            setMiningProgress(newProgress);
        }

        nextChallenge(challenge.solution);
    };

    return (
        <View style={[styles.container, { backgroundColor: zenTheme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={[styles.backText, { color: zenTheme.textSecondary, fontFamily: theme.fontFamily }]}>
                        {"< DRIFT AWAY"}
                    </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ fontSize: 20 }}>🪷</Text>
                    <Text style={[styles.title, { color: zenTheme.accent, fontFamily: theme.fontFamily }]}>
                        ZEN MODE
                    </Text>
                </View>
                <View style={{ width: 80 }} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={[styles.hint, { color: zenTheme.textSecondary, fontFamily: theme.fontFamily }]}>
                    MINING SEQUENCE: {miningProgress}/5
                </Text>

                {/* Progress Bar */}
                <View style={{ width: 200, height: 4, backgroundColor: '#003344', marginBottom: 20, flexDirection: 'row' }}>
                    {[...Array(5)].map((_, i) => (
                        <View key={i} style={{
                            flex: 1,
                            backgroundColor: i < miningProgress ? zenTheme.accent : 'transparent',
                            borderRightWidth: 1,
                            borderColor: '#001122'
                        }} />
                    ))}
                </View>

                {creditsEarnedSession > 0 && (
                    <Text style={[styles.sessionStats, { color: zenTheme.accent, fontFamily: theme.fontFamily }]}>
                        SESSION_YIELD: +{creditsEarnedSession} BITS
                    </Text>
                )}

                <View style={[styles.equationCard, { borderColor: zenTheme.accent }]}>
                    <Text style={[styles.equationText, { color: zenTheme.accent, fontFamily: theme.fontFamily }]}>
                        {challenge.equationText} = ?
                    </Text>
                </View>

                <SecurityTerminal
                    theme={zenTheme}
                    correctSolution={challenge.solution}
                    onUnlock={handleUnlock}
                    variant="TERMINAL"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    backText: {
        fontSize: 12,
    },
    title: {
        fontSize: 18,
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    hint: {
        marginBottom: 10,
        fontSize: 12,
        opacity: 0.7,
    },
    sessionStats: {
        marginBottom: 20,
        fontSize: 14,
    },
    equationCard: {
        padding: 30,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 40,
        backgroundColor: 'rgba(0, 255, 255, 0.05)',
        width: '80%',
        alignItems: 'center',
    },
    equationText: {
        fontSize: 28,
    }
});
