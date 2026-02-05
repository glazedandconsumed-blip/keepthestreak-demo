import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import PixelIcon from '../components/PixelIcon';
import { useGameStore } from '../store/gameStore';

export const LeaderboardScreen = ({ theme, onBack }) => {
    const { peakStreak, streak, totalFailures } = useGameStore();

    // Mock Data for "Global" Leaderboard
    const MOCK_LEADERS = [
        { rank: 1, name: "TRON_BOI", score: 999, failures: 0 },
        { rank: 2, name: "NEO_ONE", score: 321, failures: 2 },
        { rank: 3, name: "GLITCH_0", score: 128, failures: 5 },
        { rank: 4, name: "YOU (BEST)", score: peakStreak, failures: totalFailures, highlight: true },
        { rank: 5, name: "RETRO_DEV", score: 88, failures: 1 },
        { rank: 6, name: "B1T_WIZARD", score: 64, failures: 0 },
        { rank: 7, name: "PIXEL_RAT", score: 42, failures: 12 },
        { rank: 8, name: "NOKIA_SNAKE", score: 33, failures: 0 },
    ].sort((a, b) => b.score - a.score);

    // Animation Refs for rows
    const fadeAnims = useRef(MOCK_LEADERS.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // Staggered fade in
        Animated.stagger(100, fadeAnims.map(anim =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            })
        )).start();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={[styles.backText, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                        {"< BACK"}
                    </Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.accent, fontFamily: theme.fontFamily }]}>
                    HIGH SCORES
                </Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Local Stats Card */}
                <View style={[styles.statCard, { borderColor: theme.textSecondary, backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                    <Text style={[styles.cardTitle, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>YOUR STATS</Text>
                    <View style={styles.statRow}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>CURRENT</Text>
                            <Text style={[styles.statValue, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>{streak}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>BEST</Text>
                            <Text style={[styles.statValue, { color: theme.accent, fontFamily: theme.fontFamily }]}>{peakStreak}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>RETRIES</Text>
                            <Text style={[styles.statValue, { color: '#FF4444', fontFamily: theme.fontFamily }]}>{totalFailures}</Text>
                        </View>
                    </View>
                </View>

                {/* Leaderboard Table */}
                <View style={[styles.tableContainer, { borderColor: theme.textSecondary }]}>
                    <View style={[styles.tableHeader, { borderBottomColor: theme.textSecondary }]}>
                        <Text style={[styles.colRank, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>Rank</Text>
                        <Text style={[styles.colName, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>PLAYER</Text>
                        <Text style={[styles.colStatus, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>STATUS</Text>
                        <Text style={[styles.colScore, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>STREAK</Text>
                    </View>

                    {MOCK_LEADERS.map((item, index) => (
                        <Animated.View key={index} style={[
                            styles.tableRow,
                            item.highlight && { backgroundColor: 'rgba(0, 255, 0, 0.1)' },
                            {
                                opacity: fadeAnims[index],
                                transform: [{
                                    translateY: fadeAnims[index].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0]
                                    })
                                }]
                            }
                        ]}>
                            <Text style={[styles.colRank, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                                {index + 1}
                            </Text>
                            <Text style={[styles.colName, { color: item.highlight ? theme.accent : theme.textPrimary, fontFamily: theme.fontFamily }]}>
                                {item.name}
                            </Text>

                            {/* Status Marker: Flame for 0 failures, Skull/Count for failures */}
                            <View style={styles.colStatus}>
                                {item.failures === 0 ? (
                                    <PixelIcon name="streak" size={20} />
                                ) : (
                                    <Text style={{ color: '#FF4444', fontFamily: theme.fontFamily, fontSize: 12 }}>
                                        -{item.failures}
                                    </Text>
                                )}
                            </View>

                            <Text style={[styles.colScore, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                                {item.score}
                            </Text>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>
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
        marginBottom: 30,
    },
    backText: {
        fontSize: 12,
    },
    title: {
        fontSize: 24,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    statCard: {
        padding: 20,
        borderRadius: 10,
        borderWidth: 2,
        marginBottom: 30,
    },
    cardTitle: {
        fontSize: 12,
        marginBottom: 15,
        textAlign: 'center',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 10,
        marginBottom: 5,
    },
    statValue: {
        fontSize: 24,
    },
    tableContainer: {
        borderWidth: 2,
        borderRadius: 10,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1, // Optional: add separator?
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    colRank: {
        width: 60,
        textAlign: 'center',
        fontSize: 14,
    },
    colName: {
        flex: 1,
        fontSize: 14,
    },
    colScore: {
        width: 80,
        textAlign: 'right',
        fontSize: 14,
    },
    colStatus: {
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
