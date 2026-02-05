import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import PixelIcon from '../components/PixelIcon';

export const HomeScreen = ({ theme, onStartGame, onShowTrophies, onShowLeaderboard, onTimeAttack, onZenMode, streak, lives, credits, isPro, onUnlockPro }) => {
    // Pulse animation for "PRESS START"
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.2, // Fade out
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1, // Fade in
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [pulseAnim]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Retro Banner / Header */}
            <View style={styles.titleContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <PixelIcon name="bit" size={64} style={{ marginRight: 15 }} />
                    <PixelIcon name="streak" size={64} />
                </View>

                <Text style={[styles.title, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                    MATH
                </Text>
                <Text style={[styles.title, { color: theme.accent, fontFamily: theme.fontFamily }]}>
                    STREAK
                </Text>
            </View>

            {/* Stats Preview */}
            <View style={[styles.statsRow, { borderColor: theme.textSecondary }]}>
                <View style={styles.statItem}>
                    <PixelIcon name="streak" size={24} />
                    <Text style={[styles.statValue, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>{streak}</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>DAYS</Text>
                </View>
                <View style={styles.statItem}>
                    <PixelIcon name="heart" size={24} />
                    <Text style={[styles.statValue, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>{lives}</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>LIVES</Text>
                </View>
                <View style={styles.statItem}>
                    <PixelIcon name="currency" size={24} />
                    <Text style={[styles.statValue, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>{credits}</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>BITS</Text>
                </View>
            </View>

            {/* Main Action - Game Modes */}
            <View style={styles.menuContainer}>
                <TouchableOpacity onPress={onStartGame} style={[styles.menuButton, theme.buttonStyle]}>
                    <Text style={[styles.menuText, { color: theme.accent, fontFamily: theme.fontFamily }]}>
                        CONTINUE STREAK
                    </Text>
                </TouchableOpacity>

                {/* Pro Modes */}
                <TouchableOpacity
                    onPress={isPro ? onTimeAttack : onUnlockPro}
                    style={[styles.menuButton, theme.buttonStyle, !isPro && styles.lockedButton]}
                >
                    <Text style={[styles.menuText, { color: isPro ? theme.textSecondary : '#555', fontFamily: theme.fontFamily }]}>
                        {isPro ? "TIME ATTACK" : "TIME ATTACK [LOCKED]"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={isPro ? onZenMode : onUnlockPro}
                    style={[styles.menuButton, theme.buttonStyle, !isPro && styles.lockedButton]}
                >
                    <Text style={[styles.menuText, { color: isPro ? theme.textSecondary : '#555', fontFamily: theme.fontFamily }]}>
                        {isPro ? "ZEN MODE" : "ZEN MODE [LOCKED]"}
                    </Text>
                </TouchableOpacity>

                {/* Unlock Pro Button */}
                {!isPro && (
                    <TouchableOpacity onPress={onUnlockPro} style={[styles.menuButton, { borderColor: theme.accent, backgroundColor: 'rgba(255,215,0,0.1)' }]}>
                        <Text style={[styles.menuText, { color: theme.accent, fontFamily: theme.fontFamily }]}>
                            UNLOCK PRO VERSION
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Artifacts */}
                <TouchableOpacity style={[styles.menuButton, theme.buttonStyle]} onPress={onShowTrophies}>
                    <Text style={[styles.menuText, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                        ARTIFACTS DB
                    </Text>
                </TouchableOpacity>

                {/* Leaderboard */}
                <TouchableOpacity style={[styles.menuButton, theme.buttonStyle]} onPress={onShowLeaderboard}>
                    <Text style={[styles.menuText, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                        HIGH SCORES
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                    © 2026 DEEPMIND CORP
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    title: {
        fontSize: 48,
        lineHeight: 56,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 320,
        padding: 20,
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 60,
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        marginTop: 5,
    },
    statLabel: {
        fontSize: 10,
        marginTop: 2,
    },
    startArea: {
        marginBottom: 40,
        padding: 20,
    },
    pressStart: {
        fontSize: 24,
        letterSpacing: 2,
    },
    menuContainer: {
        width: '100%',
        maxWidth: 250,
        gap: 15,
    },
    menuButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
    },
    menuText: {
        fontSize: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
    },
    footerText: {
        fontSize: 10,
        opacity: 0.5,
    }
});
