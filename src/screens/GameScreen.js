import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, AppState } from 'react-native';
import { SecurityTerminal } from '../components/SecurityTerminal';
import DroidPixelArt from '../components/DroidPixelArt';
import { generateDailyChallenge } from '../logic/equationGenerator';
import { DROID_CHASSIS, DROID_DIALOG } from '../data/droidData';
import { ERAS, getNextEraInfo } from '../styles/themeEngine';
import { HapticPatterns } from '../logic/haptics';
import PixelIcon from '../components/PixelIcon';

export const GameScreen = ({
    theme, era, streak, lives, credits, currentDay, lastAnswer,
    loseLife, incrementStreak, setAlertConfig, latestUnlock,
    onBack, inventory = [], useConsumable, addItem,
    selectedDroid, nextEra
}) => {
    // Game phases: DASHBOARD → CHALLENGE → DEFERRED
    const [phase, setPhase] = useState('DASHBOARD');
    const [challenge, setChallenge] = useState(null);
    const [bitDialogue, setBitDialogue] = useState(null);
    const [isEasyMode, setIsEasyMode] = useState(false);

    const fs = theme.fontSizeScale;
    const droid = DROID_CHASSIS[selectedDroid] || DROID_CHASSIS['box-orb'];

    // Consumable checks
    const hasHintToken = inventory.includes('hint_token');
    const hasEasyMode = inventory.includes('easy_mode');
    const hasBypass = inventory.includes('bypass_protocol');
    const hasAnyConsumable = hasHintToken || hasEasyMode || hasBypass;

    // Generate challenge
    useEffect(() => {
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

    // Set initial droid dialog
    useEffect(() => {
        setBitDialogue(DROID_DIALOG.systemOnline(theme.eraDisplayName));
    }, []);

    // Anti-cheat (Psycho Mantis)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                const snark = [
                    `${droid.name}: 'Welcome back. Find the answer somewhere?'`,
                    `${droid.name}: 'I see. Consulting external systems.'`,
                    `${droid.name}: 'Cheat codes disabled. Nice try.'`,
                ];
                setBitDialogue(snark[Math.floor(Math.random() * snark.length)]);
                HapticPatterns.error();
            }
        });
        return () => subscription.remove();
    }, []);

    // Calculate system integrity (visual representation of streak health)
    const maxIntegrity = 100;
    const integrity = Math.min(maxIntegrity, Math.round((streak / (nextEra?.streakRequired || 90)) * 100));

    // Consumable handlers
    const handleUseHint = () => {
        if (!hasHintToken || !useConsumable) return;
        const result = useConsumable('hint_token');
        if (result.success) {
            HapticPatterns.unlock();
            setBitDialogue(`Psst... the answer is ${challenge?.solution}.`);
        }
    };

    const handleUseEasyMode = () => {
        if (!hasEasyMode || !useConsumable) return;
        const result = useConsumable('easy_mode');
        if (result.success) {
            HapticPatterns.unlock();
            setIsEasyMode(true);
            setBitDialogue("Debug mode activated. Simplified.");
        }
    };

    const handleUseBypass = () => {
        if (!hasBypass || !useConsumable) return;
        const result = useConsumable('bypass_protocol');
        if (result.success) {
            HapticPatterns.unlock();
            incrementStreak(challenge.solution);
            setAlertConfig({
                visible: true,
                title: "BYPASS ACTIVE",
                message: "Protocol accepted. Memory debt increased.",
                type: 'warning',
                onConfirm: () => {
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                }
            });
        }
    };

    const handleMaintenanceFailed = () => {
        setPhase('DEFERRED');
        setBitDialogue(DROID_DIALOG.maintenanceDeferred());
    };

    // ─── DASHBOARD PHASE ────────────────────────────────────────────
    const renderDashboard = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Droid + Dialog */}
            <View style={styles.droidSection}>
                <DroidPixelArt
                    droidId={selectedDroid}
                    theme={theme}
                    size={64}
                />
                <View style={[styles.dialogBubble, theme.cardStyle, { padding: 12 }]}>
                    <Text style={{
                        color: theme.textPrimary,
                        fontFamily: theme.fontFamily,
                        fontSize: 8 * fs,
                        lineHeight: 14 * fs,
                    }}>
                        {droid.name} [{theme.eraDisplayName}]:
                    </Text>
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 8 * fs,
                        lineHeight: 14 * fs,
                        marginTop: 4,
                    }}>
                        "{bitDialogue}"
                    </Text>
                </View>
            </View>

            {/* System Status Card */}
            <View style={[styles.statusCard, theme.cardStyle, { padding: 16 }]}>
                <Text style={{
                    color: theme.textSecondary,
                    fontFamily: theme.fontFamily,
                    fontSize: 8 * fs,
                    letterSpacing: 2,
                    marginBottom: 12,
                }}>
                    ✧ SYSTEM STATUS
                </Text>

                {/* Streak */}
                <View style={styles.statusRow}>
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 7 * fs,
                    }}>
                        MAINTENANCE STREAK
                    </Text>
                    <Text style={{
                        color: theme.accent,
                        fontFamily: theme.fontFamily,
                        fontSize: 14 * fs,
                    }}>
                        {streak} DAYS
                    </Text>
                </View>

                {/* Integrity Bar */}
                <View style={styles.statusRow}>
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 7 * fs,
                    }}>
                        SYSTEM INTEGRITY
                    </Text>
                    <View style={styles.integrityBarContainer}>
                        <View style={[styles.integrityBarBg, {
                            borderColor: theme.textSecondary,
                            borderWidth: theme.cardStyle.borderWidth || 1,
                            borderRadius: theme.cardStyle.borderRadius || 0,
                        }]}>
                            <View style={[styles.integrityBarFill, {
                                width: `${integrity}%`,
                                backgroundColor: theme.accent,
                                borderRadius: Math.max(0, (theme.cardStyle.borderRadius || 0) - 1),
                            }]} />
                        </View>
                        <Text style={{
                            color: theme.textPrimary,
                            fontFamily: theme.fontFamily,
                            fontSize: 7 * fs,
                            marginLeft: 8,
                        }}>
                            {integrity}%
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={[styles.statusRow, { marginTop: 8 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <PixelIcon name="heart" size={14} />
                        <Text style={{
                            color: theme.textPrimary,
                            fontFamily: theme.fontFamily,
                            fontSize: 8 * fs,
                        }}>
                            {lives}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <PixelIcon name="currency" size={14} />
                        <Text style={{
                            color: theme.textPrimary,
                            fontFamily: theme.fontFamily,
                            fontSize: 8 * fs,
                        }}>
                            {credits}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Next Evolution */}
            {nextEra && (
                <View style={[styles.evolutionCard, theme.cardStyle, { padding: 14 }]}>
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 7 * fs,
                        letterSpacing: 1,
                    }}>
                        NEXT EVOLUTION
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                        <Text style={{
                            color: theme.accent,
                            fontFamily: theme.fontFamily,
                            fontSize: 9 * fs,
                        }}>
                            {nextEra.name}
                        </Text>
                        <Text style={{
                            color: theme.textPrimary,
                            fontFamily: theme.fontFamily,
                            fontSize: 9 * fs,
                        }}>
                            {nextEra.daysAway} DAYS
                        </Text>
                    </View>
                </View>
            )}

            {/* Consumable Toolbar */}
            {hasAnyConsumable && (
                <View style={[styles.consumableToolbar, {
                    borderColor: theme.textSecondary,
                    borderWidth: theme.cardStyle.borderWidth || 1,
                    borderRadius: theme.cardStyle.borderRadius || 0,
                }]}>
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 6 * fs,
                        marginRight: 8,
                    }}>
                        ASSISTS:
                    </Text>
                    {hasBypass && (
                        <TouchableOpacity style={[styles.consumableBtn, { borderColor: theme.accent }]} onPress={handleUseBypass}>
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

            {/* Begin Maintenance Button */}
            <TouchableOpacity
                onPress={() => {
                    setPhase('CHALLENGE');
                    setBitDialogue(DROID_DIALOG.waitingForInput());
                }}
                style={[styles.mainButton, theme.buttonStyle]}
                activeOpacity={0.7}
            >
                <Text style={{
                    color: theme.accent,
                    fontFamily: theme.fontFamily,
                    fontSize: 11 * fs,
                    letterSpacing: 1,
                }}>
                    BEGIN MAINTENANCE
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );

    // ─── CHALLENGE PHASE ────────────────────────────────────────────
    const renderChallenge = () => (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Equation Card */}
            <View style={[styles.challengeCard, theme.cardStyle, {
                padding: 24,
            }, challenge?.isGlitch && styles.glitchCard, isEasyMode && styles.easyModeCard]}>
                <Text style={{
                    color: challenge?.isGlitch ? '#FF0000' : (isEasyMode ? '#00FF00' : theme.textSecondary),
                    fontFamily: theme.fontFamily,
                    fontSize: 8 * fs,
                    letterSpacing: 2,
                    marginBottom: 12,
                }}>
                    {challenge?.isGlitch ? "SYSTEM FAILURE" : (isEasyMode ? "DEBUG MODE" : "TODAY'S MAINTENANCE")}
                </Text>
                <Text style={{
                    color: challenge?.isGlitch ? '#FF0000' : theme.textPrimary,
                    fontFamily: theme.fontFamily,
                    fontSize: (challenge?.isGlitch || (challenge?.equationText?.length > 15)) ? 16 * fs : 28 * fs,
                    textAlign: 'center',
                    lineHeight: (challenge?.isGlitch || (challenge?.equationText?.length > 15)) ? 24 * fs : 42 * fs,
                }}>
                    {challenge?.isGlitch ? challenge.brokenEquation : (challenge?.equationText || "Loading...")}
                </Text>
                {lastAnswer !== null && lastAnswer !== undefined && (
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 7 * fs,
                        marginTop: 8,
                        opacity: 0.7,
                    }}>
                        (depends on yesterday's answer)
                    </Text>
                )}
            </View>

            {/* Droid Dialog */}
            <View style={styles.challengeDroidRow}>
                <DroidPixelArt
                    droidId={selectedDroid}
                    theme={theme}
                    size={36}
                />
                <Text style={{
                    color: theme.textSecondary,
                    fontFamily: theme.fontFamily,
                    fontSize: 7 * fs,
                    marginLeft: 10,
                    flex: 1,
                    fontStyle: 'italic',
                }}>
                    "{bitDialogue}"
                </Text>
            </View>

            {/* Security Terminal / Input */}
            <SecurityTerminal
                key={challenge?.id}
                theme={theme}
                correctSolution={challenge?.solution}
                onUnlock={() => {
                    const solution = challenge?.solution;
                    if (solution !== undefined && solution !== null) {
                        incrementStreak(solution);

                        if (challenge.specialUnlock && addItem) {
                            addItem(challenge.specialUnlock);
                            HapticPatterns.unlock();
                        }

                        if (challenge.successMessage) {
                            setAlertConfig({
                                visible: true,
                                title: challenge.specialUnlock ? "🎉 RARE FIND!" : "MAINTENANCE LOGGED",
                                message: challenge.successMessage.replace("Bit: ", ""),
                                type: 'achievement',
                                onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false }))
                            });
                        }
                        setBitDialogue(DROID_DIALOG.maintenanceComplete());
                    }
                }}
                onMistake={() => {
                    loseLife();
                    if (lives <= 1) {
                        handleMaintenanceFailed();
                    }
                }}
                disabled={!challenge}
            />
        </ScrollView>
    );

    // ─── DEFERRED PHASE ─────────────────────────────────────────────
    const renderDeferred = () => (
        <View style={styles.deferredContainer}>
            <View style={[styles.deferredCard, theme.cardStyle, { padding: 24, borderColor: theme.accent }]}>
                <Text style={{
                    color: theme.accent,
                    fontFamily: theme.fontFamily,
                    fontSize: 12 * fs,
                    textAlign: 'center',
                    marginBottom: 12,
                }}>
                    ⚠ MAINTENANCE DEFERRED
                </Text>
                <Text style={{
                    color: theme.textSecondary,
                    fontFamily: theme.fontFamily,
                    fontSize: 8 * fs,
                    textAlign: 'center',
                    lineHeight: 14 * fs,
                }}>
                    System degraded. The machine waits quietly.
                </Text>
            </View>

            <View style={styles.deferredDroid}>
                <DroidPixelArt
                    droidId={selectedDroid}
                    theme={theme}
                    size={56}
                />
                <Text style={{
                    color: theme.textSecondary,
                    fontFamily: theme.fontFamily,
                    fontSize: 8 * fs,
                    marginTop: 12,
                    textAlign: 'center',
                    fontStyle: 'italic',
                    maxWidth: 260,
                }}>
                    "{DROID_DIALOG.maintenanceDeferred()}"
                </Text>
            </View>

            <TouchableOpacity
                onPress={onBack}
                style={[styles.mainButton, theme.buttonStyle, { marginTop: 30 }]}
                activeOpacity={0.7}
            >
                <Text style={{
                    color: theme.textPrimary,
                    fontFamily: theme.fontFamily,
                    fontSize: 10 * fs,
                }}>
                    CONTINUE
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.gameArea, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.miniHeader, theme.headerStyle]}>
                <TouchableOpacity onPress={() => {
                    HapticPatterns.softKey();
                    if (phase === 'CHALLENGE') {
                        setPhase('DASHBOARD');
                    } else {
                        setAlertConfig({
                            visible: true,
                            title: "ABORT SESSION",
                            message: "Return to main menu?",
                            type: 'warning',
                            onConfirm: () => {
                                setAlertConfig(prev => ({ ...prev, visible: false }));
                                onBack();
                            }
                        });
                    }
                }}>
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 10 * fs,
                    }}>
                        ← {phase === 'CHALLENGE' ? 'BACK' : 'MENU'}
                    </Text>
                </TouchableOpacity>

                <Text style={{
                    color: theme.textSecondary,
                    fontFamily: theme.fontFamily,
                    fontSize: 8 * fs,
                }}>
                    DAY {currentDay}
                </Text>

                <View style={styles.miniStats}>
                    <PixelIcon name="heart" size={14} />
                    <Text style={{
                        color: theme.textPrimary,
                        fontFamily: theme.fontFamily,
                        fontSize: 9 * fs,
                        marginLeft: 3,
                    }}>{lives}</Text>
                    <View style={{ width: 8 }} />
                    <PixelIcon name="streak" size={14} />
                    <Text style={{
                        color: theme.textPrimary,
                        fontFamily: theme.fontFamily,
                        fontSize: 9 * fs,
                        marginLeft: 3,
                    }}>{streak}</Text>
                </View>
            </View>

            {/* Phase Content */}
            {phase === 'DASHBOARD' && renderDashboard()}
            {phase === 'CHALLENGE' && renderChallenge()}
            {phase === 'DEFERRED' && renderDeferred()}

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={{
                    color: theme.textSecondary,
                    fontFamily: theme.fontFamily,
                    fontSize: 7 * fs,
                    opacity: 0.5,
                }}>
                    ● {theme.footerText}
                </Text>
            </View>
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
        paddingTop: 50,
        alignItems: 'center',
    },
    miniStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollContent: {
        alignItems: 'center',
        padding: 20,
        paddingBottom: 60,
    },
    // Dashboard
    droidSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        width: '100%',
        maxWidth: 340,
    },
    dialogBubble: {
        flex: 1,
        marginLeft: 12,
    },
    statusCard: {
        width: '100%',
        maxWidth: 340,
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    integrityBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    integrityBarBg: {
        width: 100,
        height: 12,
        overflow: 'hidden',
    },
    integrityBarFill: {
        height: '100%',
    },
    evolutionCard: {
        width: '100%',
        maxWidth: 340,
        marginBottom: 12,
    },
    consumableToolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: 340,
    },
    consumableBtn: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderRadius: 4,
        marginHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    mainButton: {
        width: '100%',
        maxWidth: 340,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    // Challenge
    challengeCard: {
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        marginBottom: 16,
    },
    glitchCard: {
        borderColor: '#FF0000',
        borderWidth: 2,
        backgroundColor: '#110000',
    },
    easyModeCard: {
        borderColor: '#00FF00',
        borderWidth: 2,
        backgroundColor: '#001100',
    },
    challengeDroidRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
        maxWidth: 340,
        paddingHorizontal: 4,
    },
    // Deferred
    deferredContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    deferredCard: {
        width: '100%',
        maxWidth: 340,
        marginBottom: 24,
    },
    deferredDroid: {
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
});
