import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, AppState } from 'react-native';
import { SecurityTerminal } from '../components/SecurityTerminal';
import PixelIcon from '../components/PixelIcon';
import { generateDailyChallenge } from '../logic/equationGenerator';
import { HapticPatterns } from '../logic/haptics';

export const GameScreen = ({ theme, streak, lives, credits, currentDay, lastAnswer, loseLife, incrementStreak, setAlertConfig, latestUnlock, onBack, inventory = [], useConsumable, addItem }) => {
    // Local state for the specific challenge
    const [challenge, setChallenge] = useState(null);
    // Variant Logic
    const [terminalVariant, setTerminalVariant] = useState('PANEL');
    // Active Bit dialogue (from consumables)
    const [bitDialogue, setBitDialogue] = useState(null);
    // Easy mode flag for this round
    const [isEasyMode, setIsEasyMode] = useState(false);

    // Check what consumables player has
    const hasHintToken = inventory.includes('hint_token');
    const hasEasyMode = inventory.includes('easy_mode');
    const hasMemoryJog = inventory.includes('memory_jog');
    const hasAnyConsumable = hasHintToken || hasEasyMode || hasMemoryJog;

    useEffect(() => {
        // Boss Stage every 10 levels = VAULT
        if (currentDay % 10 === 0) {
            setTerminalVariant('VAULT');
        } else {
            // Scavenge Stage = Random Scrapyard Container
            const variants = ['PANEL', 'CAR_HOOD', 'DUMPSTER', 'CRATE', 'LOCKER'];
            setTerminalVariant(variants[Math.floor(Math.random() * variants.length)]);
        }
    }, [currentDay]);

    // Reset consumable states when challenge changes
    useEffect(() => {
        setBitDialogue(null);
        setIsEasyMode(false);
    }, [challenge?.id]);

    // Listen for Game Over or Win
    useEffect(() => {
        // GLITCH MECHANIC: Every 4th day is a DEBUG day
        // GLITCH MECHANIC: Every 4th day is a DEBUG day, but only after Day 10
        const isGlitchDay = currentDay % 4 === 0 && currentDay > 10;
        let daily;
        if (isGlitchDay) {
            const { generateGlitchChallenge } = require('../logic/equationGenerator');
            daily = generateGlitchChallenge(currentDay, lastAnswer || 1);
        } else {
            daily = generateDailyChallenge(currentDay, lastAnswer || 1, isEasyMode);
        }
        setChallenge(daily);
    }, [currentDay, lastAnswer, streak, isEasyMode]);

    // App State for Anti-Cheat (Psycho Mantis)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                // User came back from background
                const snark = [
                    "Bit: 'Welcome back. Find the answer on Google?'",
                    "Bit: 'I see what you did there. Consulting the Oracle?'",
                    "Bit: 'Your search history is being recorded. Just kidding.'",
                    "Bit: 'Psycho Mantis is watching you cheat.'",
                    "Bit: 'Did you just minimize me? Rude.'",
                    "Bit: 'Cheat codes disabled. Nice try.'"
                ];
                setBitDialogue(snark[Math.floor(Math.random() * snark.length)]);
                HapticPatterns.error();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Consumable handlers
    const handleUseHint = () => {
        if (!hasHintToken || !useConsumable) return;
        const result = useConsumable('hint_token');
        if (result.success) {
            HapticPatterns.unlock();
            setBitDialogue(`Psst... I peeked at the answer. It's ${challenge?.solution}!`);
        }
    };

    const handleUseEasyMode = () => {
        if (!hasEasyMode || !useConsumable) return;
        const result = useConsumable('easy_mode');
        if (result.success) {
            HapticPatterns.unlock();
            setIsEasyMode(true);
            setBitDialogue("Debug mode activated! I've simplified the equation for you.");
        }
    };

    const handleUseMemoryJog = () => {
        if (!hasMemoryJog || !useConsumable) return;
        const result = useConsumable('memory_jog');
        if (result.success) {
            HapticPatterns.unlock();
            setBitDialogue(`Wait, I remember! Yesterday's number was ${lastAnswer || 1}. Don't forget it!`);
        }
    };

    return (
        <View style={[styles.gameArea, { backgroundColor: theme.background }]}>
            {/* Nav Back */}
            <View style={[styles.miniHeader, { borderBottomColor: theme.textSecondary }]}>
                {/* MENU / DAY Combined */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <TouchableOpacity onPress={() => {
                        HapticPatterns.softKey();
                        // Custom Retro Alert for Pause
                        setAlertConfig({
                            visible: true,
                            title: "PAUSE SESSION",
                            message: "Return to main menu?",
                            type: 'warning',
                            onConfirm: () => {
                                setAlertConfig(prev => ({ ...prev, visible: false }));
                                onBack();
                            }
                        });
                    }}>
                        <Text style={{ color: theme.textSecondary, fontFamily: theme.fontFamily, fontSize: 12 }}>{"< MENU"}</Text>
                    </TouchableOpacity>

                    <Text style={{ color: theme.textSecondary, fontFamily: theme.fontFamily }}>DAY {currentDay}</Text>
                </View>

                {/* Right Side Stats */}
                <View style={styles.miniStats}>
                    <PixelIcon name="heart" size={16} />
                    <Text style={[styles.miniStatText, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>{lives}</Text>
                    <View style={{ width: 10 }} />
                    <PixelIcon name="streak" size={16} />
                    <Text style={[styles.miniStatText, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>{streak}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Title / Bit */}
                <View style={styles.titleContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 }}>
                        {/* Speech Bubble - Shows clue or consumable dialogue */}
                        {(challenge?.clue || bitDialogue) && (
                            <View style={[
                                styles.speechBubble,
                                {
                                    borderColor: bitDialogue ? theme.accent : theme.textPrimary,
                                    backgroundColor: theme.cardStyle.backgroundColor
                                }
                            ]}>
                                <Text style={[styles.speechText, {
                                    color: bitDialogue ? theme.accent : theme.textPrimary,
                                    fontFamily: theme.fontFamily,
                                    fontSize: 12 * theme.fontSizeScale
                                }]}>
                                    {bitDialogue || challenge?.clue?.replace("Bit: ", "")}
                                </Text>
                                <View style={[styles.bubbleArrow, {
                                    borderTopColor: bitDialogue ? theme.accent : theme.textPrimary,
                                    borderLeftColor: bitDialogue ? theme.accent : theme.textPrimary,
                                    backgroundColor: theme.cardStyle.backgroundColor
                                }]} />
                            </View>
                        )}
                        <PixelIcon name="bit" size={48 * theme.fontSizeScale} />
                    </View>
                </View>

                {/* Consumable Toolbar */}
                {hasAnyConsumable && !bitDialogue && (
                    <View style={[styles.consumableToolbar, { borderColor: theme.textSecondary }]}>
                        <Text style={{ color: theme.textSecondary, fontFamily: theme.fontFamily, fontSize: 8, marginRight: 10 }}>ASSISTS:</Text>

                        {hasMemoryJog && (
                            <TouchableOpacity style={[styles.consumableBtn, { borderColor: theme.accent }]} onPress={handleUseMemoryJog}>
                                <PixelIcon name="memory" size={14} />
                            </TouchableOpacity>
                        )}
                        {hasEasyMode && (
                            <TouchableOpacity style={[styles.consumableBtn, { borderColor: theme.accent }]} onPress={handleUseEasyMode}>
                                <PixelIcon name="chip" size={14} />
                            </TouchableOpacity>
                        )}
                        {hasHintToken && (
                            <TouchableOpacity style={[styles.consumableBtn, { borderColor: theme.accent }]} onPress={handleUseHint}>
                                <PixelIcon name="key" size={14} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Equation Card */}
                <View style={[styles.card, theme.cardStyle, challenge?.isGlitch && styles.glitchCard, isEasyMode && styles.easyModeCard]}>
                    <Text style={[styles.equationLabel, {
                        color: challenge?.isGlitch ? '#FF0000' : (isEasyMode ? '#00FF00' : theme.textSecondary),
                        fontFamily: theme.fontFamily,
                        fontSize: 14 * theme.fontSizeScale
                    }]}>
                        {challenge?.isGlitch ? "SYSTEM FAILURE" : (isEasyMode ? "DEBUG MODE:" : "TODAY'S CLUE:")}
                    </Text>
                    <Text style={[styles.equation, {
                        color: challenge?.isGlitch ? '#FF0000' : theme.textPrimary,
                        fontFamily: theme.fontFamily,
                        fontSize: (challenge?.isGlitch || (challenge?.equationText?.length > 15)) ? 20 * theme.fontSizeScale : 36 * theme.fontSizeScale,
                        lineHeight: (challenge?.isGlitch || (challenge?.equationText?.length > 15)) ? 30 * theme.fontSizeScale : 40 * theme.fontSizeScale * 1.5
                    }]}>
                        {challenge?.isGlitch ? challenge.brokenEquation : (challenge?.equationText || "Loading...")}
                    </Text>
                </View>

                {/* Security Terminal */}
                <SecurityTerminal
                    key={challenge?.id} // Force remount on new day/challenge
                    theme={theme}
                    correctSolution={challenge?.solution}
                    onUnlock={() => {
                        const solution = challenge?.solution;
                        console.log(`[GAME_SCREEN] onUnlock triggered. Solution: ${solution}`);
                        if (solution !== undefined && solution !== null) {
                            incrementStreak(solution);

                            // Check for special easter egg unlocks
                            if (challenge.specialUnlock && addItem) {
                                // Add the rare item to inventory!
                                addItem(challenge.specialUnlock);
                                HapticPatterns.unlock();
                            }

                            // Show Bit's success message (with special title for easter eggs)
                            if (challenge.successMessage) {
                                setAlertConfig({
                                    visible: true,
                                    title: challenge.specialUnlock ? "🎉 RARE FIND!" : "MEMORY UPDATE",
                                    message: challenge.successMessage.replace("Bit: ", ""),
                                    type: 'achievement', // Use trophy/positive style
                                    onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false }))
                                });
                            }
                        }
                    }}
                    onMistake={loseLife}
                    disabled={!challenge}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    gameArea: {
        flex: 1,
        width: '100%',
    },
    miniHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 50, // Safe area roughly
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    miniStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniStatText: {
        marginLeft: 5,
        fontSize: 16,
    },
    scrollContent: {
        alignItems: 'center',
        padding: 20,
        paddingBottom: 50,
    },
    titleContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    card: {
        padding: 30,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    glitchCard: {
        borderColor: '#FF0000',
        borderWidth: 2,
        backgroundColor: '#110000',
    },
    equationLabel: {
        fontSize: 14,
        marginBottom: 10,
        letterSpacing: 1,
    },
    equation: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    speechBubble: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 2,
        maxWidth: 200,
        marginRight: 10,
        marginBottom: 20,
    },
    speechText: {
        fontSize: 12,
        lineHeight: 16,
    },
    bubbleArrow: {
        position: 'absolute',
        bottom: -10,
        right: 10,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    consumableToolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    consumableBtn: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderRadius: 6,
        marginHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    easyModeCard: {
        borderColor: '#00FF00',
        borderWidth: 2,
        backgroundColor: '#001100',
    },
});
