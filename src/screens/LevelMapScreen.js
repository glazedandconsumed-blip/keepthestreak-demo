import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import DroidPixelArt from '../components/DroidPixelArt';
import { ERAS, getEraForStreak } from '../styles/themeEngine';
import { DROID_CHASSIS } from '../data/droidData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LevelMapScreen = ({ theme, era, mode, streak, selectedDroid, nextEra, onLevelSelect, onBack }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fs = theme.fontSizeScale;

    // Pulsing animation for "current" node
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [pulseAnim]);

    // Build progress nodes: show 7 nodes centered on current position
    const buildNodes = () => {
        const nodes = [];
        const windowStart = Math.max(0, streak - 2);
        const windowEnd = windowStart + 6;

        // Era transition thresholds
        const eraThresholds = [3, 7, 14, 21, 30, 45, 68, 90];

        for (let i = windowStart; i <= windowEnd; i++) {
            const isCompleted = i < streak;
            const isCurrent = i === streak;
            const isFuture = i > streak;
            const isEraTransition = eraThresholds.includes(i);
            const nodeEra = getEraForStreak(i);
            const nodeTheme = ERAS[nodeEra];

            nodes.push({
                day: i,
                isCompleted,
                isCurrent,
                isFuture,
                isEraTransition,
                eraName: isEraTransition ? nodeTheme.eraDisplayName : null,
            });
        }
        return nodes;
    };

    const nodes = buildNodes();
    const droid = DROID_CHASSIS[selectedDroid] || DROID_CHASSIS['box-orb'];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, theme.headerStyle]}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 10 * fs,
                    }}>
                        ← BACK
                    </Text>
                </TouchableOpacity>
                <Text style={{
                    color: theme.accent,
                    fontFamily: theme.fontFamily,
                    fontSize: 12 * fs,
                    letterSpacing: 2,
                }}>
                    SYSTEM MAP
                </Text>
                <View style={{ width: 50 }} />
            </View>

            {/* Status Info */}
            <View style={styles.statusSection}>
                <Text style={{
                    color: theme.textPrimary,
                    fontFamily: theme.fontFamily,
                    fontSize: 11 * fs,
                }}>
                    DAY {streak + 1}
                </Text>
                <Text style={{
                    color: theme.textSecondary,
                    fontFamily: theme.fontFamily,
                    fontSize: 8 * fs,
                    marginTop: 4,
                }}>
                    Maintenance required
                </Text>
            </View>

            {/* Droid Display */}
            <View style={styles.droidSection}>
                <DroidPixelArt
                    droidId={selectedDroid}
                    theme={theme}
                    size={72}
                />
                <Text style={{
                    color: theme.textSecondary,
                    fontFamily: theme.fontFamily,
                    fontSize: 7 * fs,
                    marginTop: 8,
                }}>
                    {droid.name}
                </Text>
            </View>

            {/* Progress Path */}
            <View style={styles.pathContainer}>
                {/* Background Line */}
                <View style={[styles.pathLine, {
                    backgroundColor: theme.textSecondary,
                    opacity: 0.2,
                }]} />
                {/* Completed Line fill */}
                <View style={[styles.pathLine, styles.pathLineFill, {
                    backgroundColor: theme.accent,
                    width: `${Math.min(((nodes.findIndex(n => n.isCurrent)) / (nodes.length - 1)) * 100, 100)}%`,
                }]} />

                {/* Nodes */}
                <View style={styles.nodesRow}>
                    {nodes.map((node, index) => {
                        const nodeSize = node.isCurrent ? 40 : 28;
                        return (
                            <View key={node.day} style={styles.nodeWrapper}>
                                {/* Era transition label */}
                                {node.isEraTransition && (
                                    <Text style={{
                                        color: theme.accent,
                                        fontFamily: theme.fontFamily,
                                        fontSize: 5 * fs,
                                        position: 'absolute',
                                        top: -20,
                                        textAlign: 'center',
                                        width: 70,
                                    }}>
                                        {node.eraName}
                                    </Text>
                                )}

                                {/* Current node indicator */}
                                {node.isCurrent ? (
                                    <Animated.View style={[styles.node, {
                                        width: nodeSize,
                                        height: nodeSize,
                                        borderRadius: theme.cardStyle.borderRadius || 0,
                                        backgroundColor: theme.accent,
                                        borderWidth: theme.cardStyle.borderWidth || 2,
                                        borderColor: theme.textPrimary,
                                        opacity: pulseAnim,
                                    }]}>
                                        <Text style={{
                                            color: theme.background,
                                            fontFamily: theme.fontFamily,
                                            fontSize: 8 * fs,
                                            fontWeight: 'bold',
                                        }}>
                                            {node.day}
                                        </Text>
                                    </Animated.View>
                                ) : (
                                    <View style={[styles.node, {
                                        width: nodeSize,
                                        height: nodeSize,
                                        borderRadius: theme.cardStyle.borderRadius || 0,
                                        backgroundColor: node.isCompleted ? theme.accent : 'transparent',
                                        borderWidth: theme.cardStyle.borderWidth || 1,
                                        borderColor: node.isCompleted ? theme.accent : theme.textSecondary,
                                        opacity: node.isFuture ? 0.4 : 1,
                                    }]}>
                                        <Text style={{
                                            color: node.isCompleted ? theme.background : theme.textSecondary,
                                            fontFamily: theme.fontFamily,
                                            fontSize: 6 * fs,
                                        }}>
                                            {node.isCompleted ? '✓' : node.day}
                                        </Text>
                                    </View>
                                )}

                                {/* Day Label */}
                                <Text style={{
                                    color: node.isCurrent ? theme.textPrimary : theme.textSecondary,
                                    fontFamily: theme.fontFamily,
                                    fontSize: 5 * fs,
                                    marginTop: 6,
                                    opacity: node.isFuture ? 0.4 : 0.7,
                                }}>
                                    {node.isCurrent ? 'NOW' : (node.isCompleted ? 'DONE' : '')}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Next Evolution Info */}
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

            {/* Begin Maintenance Button */}
            <TouchableOpacity
                onPress={onLevelSelect}
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
    container: {
        flex: 1,
        alignItems: 'center',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
    },
    backButton: {
        width: 60,
    },
    statusSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 24,
    },
    droidSection: {
        alignItems: 'center',
        marginBottom: 36,
    },
    pathContainer: {
        width: '90%',
        maxWidth: 360,
        height: 80,
        justifyContent: 'center',
        marginBottom: 30,
    },
    pathLine: {
        position: 'absolute',
        left: 20,
        right: 20,
        height: 3,
        top: '50%',
    },
    pathLineFill: {
        right: undefined,
    },
    nodesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    nodeWrapper: {
        alignItems: 'center',
        position: 'relative',
    },
    node: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    evolutionCard: {
        width: '85%',
        maxWidth: 340,
        marginBottom: 24,
    },
    mainButton: {
        width: '85%',
        maxWidth: 340,
        paddingVertical: 16,
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
