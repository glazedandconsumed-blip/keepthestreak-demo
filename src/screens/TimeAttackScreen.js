import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SecurityTerminal } from '../components/SecurityTerminal';
import PixelIcon from '../components/PixelIcon';
import { generateDailyChallenge, generateArcadeChallenge } from '../logic/equationGenerator';
import { generateLoot } from '../logic/lootSystem';
import { HapticPatterns } from '../logic/haptics';
import { useGameStore } from '../store/gameStore';
import { Audio } from 'expo-av';
import RetroAlert from '../components/RetroAlert';

export const TimeAttackScreen = ({ theme, onBack, onComplete }) => {
    // Game State
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [challenge, setChallenge] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [retroAlert, setRetroAlert] = useState({ visible: false, title: '', message: '', type: 'info', onConfirm: () => { } });

    // Refs
    const timerRef = useRef(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Red Theme Override for Time Attack
    const attackTheme = {
        ...theme,
        accent: '#FF0033', // Alert Red
        background: '#110000', // Deep Red/Black
    };

    // Start Game
    useEffect(() => {
        startGame();
        return () => stopGame();
    }, []);

    // Timer Logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 10) {
                        // Heartbeat pulse for low time
                        Animated.sequence([
                            Animated.timing(pulseAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
                            Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true })
                        ]).start();
                        HapticPatterns.keypress(); // Tick tock haptic
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            endGame();
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const startGame = () => {
        setIsActive(true);
        setScore(0);
        setTimeLeft(60);
        nextChallenge();
    };

    const stopGame = () => {
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const nextChallenge = () => {
        const newChallenge = generateArcadeChallenge('MEDIUM');
        setChallenge(newChallenge);
    };

    const addItem = useGameStore(state => state.addItem); // Access global inventory

    const handleUnlock = () => {
        // Correct Answer
        HapticPatterns.unlock();
        setScore(prev => {
            const newScore = prev + 100;
            // Every 500 points (5 solves), grant a Roguelite Item
            if (newScore % 500 === 0) {
                // Grant Rogue-like Assist
                const loot = generateLoot('CONSUMABLE'); // Force consumable type
                addItem(loot.id);

                // Visual Notification
                setRetroAlert({
                    visible: true,
                    title: "SYSTEM UPGRADE",
                    message: `${loot.name} ACQUIRED!\n(Added to Inventory)`,
                    type: 'achievement',
                    confirmText: "ACKNOWLEDGE",
                    onConfirm: () => setRetroAlert(prev => ({ ...prev, visible: false }))
                });
                HapticPatterns.success();
            }
            return newScore;
        });
        setTimeLeft(prev => Math.min(prev + 5, 60)); // Add 5 seconds, max 60
        nextChallenge();
    };

    const endGame = () => {
        stopGame();
        HapticPatterns.error();
        setRetroAlert({
            visible: true,
            title: "SYSTEM FAILURE",
            message: `SCORE: ${score}\n\nThe system has overheated.`,
            type: 'error',
            confirmText: "REBOOT",
            cancelText: "EJECT",
            onConfirm: () => {
                setRetroAlert(prev => ({ ...prev, visible: false }));
                startGame();
            },
            onCancel: () => {
                setRetroAlert(prev => ({ ...prev, visible: false }));
                onBack();
            }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: attackTheme.background }]}>
            {/* Header / HUD */}
            <View style={styles.hud}>
                <TouchableOpacity onPress={() => {
                    stopGame();
                    onBack(); // Direct exit for now
                }}>
                    <Text style={[styles.backText, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                        {"< EJECT"}
                    </Text>
                </TouchableOpacity>

                <View style={styles.timerBox}>
                    <Text style={[styles.label, { color: attackTheme.textSecondary, fontFamily: theme.fontFamily }]}>T-MINUS</Text>
                    <Animated.Text style={[styles.timer, {
                        color: timeLeft < 10 ? '#FF0000' : attackTheme.accent,
                        fontFamily: theme.fontFamily,
                        transform: [{ scale: pulseAnim }]
                    }]}>
                        {timeLeft}s
                    </Animated.Text>
                </View>

                <View style={styles.scoreBox}>
                    <Text style={[styles.label, { color: attackTheme.textSecondary, fontFamily: theme.fontFamily }]}>CPU LOAD</Text>
                    <Text style={[styles.score, { color: attackTheme.textPrimary, fontFamily: theme.fontFamily }]}>
                        {score}
                    </Text>
                </View>
            </View>

            {/* Warning Banner */}
            <View style={styles.banner}>
                <Text style={[styles.bannerText, { fontFamily: theme.fontFamily }]}>
                    ⚠️ OVERCLOCK ACTIVE ⚠️
                </Text>
            </View>

            {/* Game Area */}
            <View style={styles.terminalContainer}>
                {challenge && (
                    <>
                        <View style={[styles.equationCard, { borderColor: attackTheme.accent }]}>
                            <Text style={[styles.equationText, { color: attackTheme.accent, fontFamily: theme.fontFamily }]}>
                                {challenge.equationText} = ?
                            </Text>
                        </View>

                        <SecurityTerminal
                            theme={attackTheme}
                            correctSolution={challenge.solution}
                            onUnlock={handleUnlock}
                            disabled={!isActive}
                            variant="TERMINAL"
                        />
                    </>
                )}
            </View>

            <RetroAlert
                visible={retroAlert.visible}
                title={retroAlert.title}
                message={retroAlert.message}
                type={retroAlert.type}
                theme={attackTheme}
                confirmText={retroAlert.confirmText}
                cancelText={retroAlert.cancelText}
                onConfirm={retroAlert.onConfirm || (() => setRetroAlert(prev => ({ ...prev, visible: false })))}
                onCancel={retroAlert.onCancel}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    hud: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
    },
    backText: {
        fontSize: 12,
        marginTop: 5,
    },
    timerBox: {
        alignItems: 'center',
    },
    scoreBox: {
        alignItems: 'center',
    },
    label: {
        fontSize: 10,
        marginBottom: 2,
    },
    timer: {
        fontSize: 32,
    },
    score: {
        fontSize: 24,
    },
    banner: {
        backgroundColor: '#330000',
        width: '100%',
        padding: 5,
        alignItems: 'center',
        marginVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#FF0000',
    },
    bannerText: {
        color: '#FF0000',
        fontSize: 12,
        letterSpacing: 2,
    },
    terminalContainer: {
        flex: 1,
        alignItems: 'center',
    },
    equationCard: {
        padding: 20,
        borderWidth: 2,
        marginBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: '80%',
        alignItems: 'center',
    },
    equationText: {
        fontSize: 24,
    }
});
