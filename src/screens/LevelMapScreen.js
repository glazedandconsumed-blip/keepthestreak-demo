import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Dimensions } from 'react-native';
import PixelIcon from '../components/PixelIcon';
import { HapticPatterns } from '../logic/haptics';

const { width } = Dimensions.get('window');
const NODE_SIZE = 60;
const PATH_HEIGHT = 4;

export const LevelMapScreen = ({ theme, mode, streak, onLevelSelect, onBack }) => {
    const [currentNode, setCurrentNode] = useState(streak % 10); // Simple loop for now
    const moveAnim = useRef(new Animated.Value(0)).current;

    // Map Config based on Mode
    const getMapTheme = () => {
        switch (mode) {
            case 'TIME_ATTACK': return {
                type: 'CIRCUIT',
                bg: '#110000',
                path: '#FF0000',
                nodeGeneric: '#550000',
                nodeActive: '#FF4444'
            };
            case 'ZEN_MODE': return {
                type: 'GARDEN',
                bg: '#001122',
                path: '#00AAAA',
                nodeGeneric: '#004455',
                nodeActive: '#00FFFF'
            };
            default: return {
                type: 'WORLD',
                bg: theme.background,
                path: theme.textSecondary,
                nodeGeneric: theme.textSecondary,
                nodeActive: theme.accent
            };
        }
    };

    const mapTheme = getMapTheme();

    // Auto-advance animation on mount
    useEffect(() => {
        // Start "Previous" node
        moveAnim.setValue(0);

        const delay = setTimeout(() => {
            HapticPatterns.doorOpen(); // "Step" sound
            Animated.spring(moveAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true
            }).start(() => {
                HapticPatterns.unlock();
            });
        }, 500);

        return () => clearTimeout(delay);
    }, []);

    // Generate Nodes (Window of 5)
    // We'll show: [Prev] [Curr] [Next] [Next] [Boss?]
    const nodes = [0, 1, 2, 3, 4].map(offset => streak + offset);

    const translateX = moveAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, NODE_SIZE + 40] // Distance between nodes
    });

    return (
        <View style={[styles.container, { backgroundColor: mapTheme.bg }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack}>
                    <Text style={[styles.backText, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                        {"< ABORT"}
                    </Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: mapTheme.nodeActive, fontFamily: theme.fontFamily }]}>
                    {mode === 'TIME_ATTACK' ? 'CIRCUIT TRACE' : (mode === 'ZEN_MODE' ? 'GARDEN PATH' : `WORLD ${Math.floor(streak / 10) + 1}`)}
                </Text>
                <View style={{ width: 50 }} />
            </View>

            {/* Map Container */}
            <View style={styles.mapContainer}>
                {/* Connecting Path */}
                <View style={[styles.pathLine, { backgroundColor: mapTheme.path }]} />

                {/* Nodes */}
                <View style={styles.nodesRow}>
                    {nodes.map((levelNum, index) => {
                        const isCurrent = index === 0; // We define "Current" as the start point for animation, moving to index 1 is the new level?
                        // Wait, simpler: Static nodes, moving player.
                        return (
                            <View key={levelNum} style={[styles.nodeContainer, { marginRight: 40 }]}>
                                <View style={[
                                    styles.node,
                                    {
                                        backgroundColor: mapTheme.nodeGeneric,
                                        borderColor: mapTheme.nodeActive,
                                        // Highlight current target
                                        borderWidth: index === 1 ? 2 : 0
                                    }
                                ]}>
                                    <Text style={{ fontFamily: theme.fontFamily, color: '#FFF', fontSize: 12 }}>
                                        {levelNum}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Player Token */}
                {/* Starts at Index 0, Moves to Index 1 */}
                <Animated.View style={[
                    styles.playerToken,
                    {
                        backgroundColor: theme.accent,
                        transform: [{ translateX }]
                    }
                ]}>
                    <PixelIcon name="streak" size={30} />
                </Animated.View>
            </View>

            {/* Action */}
            <TouchableOpacity onPress={onLevelSelect} style={[styles.startButton, theme.buttonStyle]}>
                <Text style={[styles.startText, { color: theme.accent, fontFamily: theme.fontFamily }]}>
                    ENTER LEVEL {streak + 1}
                </Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 100,
    },
    backText: {
        fontSize: 12,
    },
    title: {
        fontSize: 16,
        letterSpacing: 2,
    },
    mapContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'flex-start', // Align to left so we can pad
        paddingLeft: 60,
    },
    pathLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 6,
        top: 97, // approx center
        width: width * 2, // Overshoot
    },
    nodesRow: {
        flexDirection: 'row',
    },
    nodeContainer: {
        alignItems: 'center',
    },
    node: {
        width: NODE_SIZE,
        height: NODE_SIZE,
        borderRadius: NODE_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    playerToken: {
        position: 'absolute',
        top: 60, // visual offset to sit ON TOP of node
        left: 75, // Initial alignment with Node 0
        zIndex: 10,
    },
    startButton: {
        marginTop: 100,
        paddingHorizontal: 40,
        paddingVertical: 15,
    },
    startText: {
        fontSize: 18,
    }
});
