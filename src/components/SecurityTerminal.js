import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Vibration } from 'react-native';
import PixelIcon from './PixelIcon';

export const SecurityTerminal = ({ theme, correctSolution, onUnlock, disabled }) => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('LOCKED'); // LOCKED, UNLOCKING, OPEN, ERROR

    // Animation Values
    const doorLeftAnim = useRef(new Animated.Value(0)).current;
    const doorRightAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Idle glow effect for the terminal status light
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
                Animated.timing(glowAnim, { toValue: 0.3, duration: 2000, useNativeDriver: false })
            ])
        ).start();
    }, []);

    const handleKeyPress = (key) => {
        if (status !== 'LOCKED' && status !== 'ERROR') return;
        if (status === 'ERROR') {
            setStatus('LOCKED');
            setCode('');
        }

        if (key === 'DEL') {
            setCode(prev => prev.slice(0, -1));
            Vibration.vibrate(5);
        } else if (key === 'ENTER') {
            submitCode();
        } else {
            if (code.length < 4) { // Max length 4 for Year support
                setCode(prev => prev + key);
                Vibration.vibrate(10);
            }
        }
    };

    const submitCode = () => {
        if (status === 'UNLOCKING' || disabled) return;

        const numInput = parseInt(code);
        if (isNaN(numInput)) return;

        if (numInput === correctSolution) {
            startUnlockSequence();
        } else {
            triggerError();
        }
    };

    const startUnlockSequence = () => {
        setStatus('UNLOCKING');
        Vibration.vibrate(100);

        // 1. Flash Success
        // 2. Open Doors
        Animated.parallel([
            Animated.timing(doorLeftAnim, {
                toValue: -150, // Slide left
                duration: 1000,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true,
            }),
            Animated.timing(doorRightAnim, {
                toValue: 150, // Slide right
                duration: 1000,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true,
            })
        ]).start(() => {
            setStatus('OPEN');
            Vibration.vibrate([0, 100, 50, 100]); // Success pattern
            setTimeout(() => {
                onUnlock();
            }, 1000);
        });
    };

    const triggerError = () => {
        setStatus('ERROR');
        Vibration.vibrate(400);

        // Shake Animation
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start(() => {
            // Keep error state for a second so user sees red
            setTimeout(() => {
                setCode('');
                setStatus('LOCKED');
            }, 500);
        });
    };

    const statusColor = status === 'ERROR' ? '#FF0033' : status === 'OPEN' || status === 'UNLOCKING' ? '#00FF00' : theme.textPrimary;

    // Keypad Button Component
    const KeypadButton = ({ label, value, style }) => (
        <TouchableOpacity
            style={[styles.keyButton, { borderColor: theme.textSecondary }, style]}
            onPress={() => handleKeyPress(value)}
            activeOpacity={0.6}
        >
            <Text style={[styles.keyText, { fontFamily: theme.fontFamily, color: theme.textPrimary }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                {/* The Safe/Vault Container */}
                <View style={[styles.vaultFrame, { borderColor: theme.textSecondary }]}>

                    {/* The "Inside" (Revealed when opened) */}
                    <View style={styles.vaultInterior}>
                        {status === 'OPEN' && (
                            <View style={{ alignItems: 'center' }}>
                                <PixelIcon name="currency" size={60} />
                                <Text style={[styles.lootText, { fontFamily: theme.fontFamily, color: theme.accent }]}>
                                    COMPONENT ACQUIRED
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Left Door */}
                    <Animated.View style={[
                        styles.door,
                        {
                            backgroundColor: theme.background,
                            borderRightWidth: 2,
                            borderColor: theme.textSecondary,
                            transform: [{ translateX: doorLeftAnim }]
                        }
                    ]}>
                        <View style={styles.rivetTopLeft} />
                        <View style={styles.rivetBottomLeft} />
                    </Animated.View>

                    {/* Right Door */}
                    <Animated.View style={[
                        styles.door,
                        {
                            backgroundColor: theme.background,
                            borderLeftWidth: 2,
                            borderColor: theme.textSecondary,
                            transform: [{ translateX: doorRightAnim }]
                        }
                    ]}>
                        <View style={styles.rivetTopRight} />
                        <View style={styles.rivetBottomRight} />
                    </Animated.View>
                </View>

                {/* Overlaid Interface (Only visible when locked) */}
                {status !== 'OPEN' && status !== 'UNLOCKING' && (
                    <Animated.View style={[styles.interfaceLayer, { transform: [{ translateX: shakeAnim }] }]}>

                        {/* Display Screen */}
                        <View style={[styles.displayScreen, { borderColor: theme.textSecondary, backgroundColor: '#000' }]}>
                            <Text style={[styles.screenLabel, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                                SEC-TERM v3.0
                            </Text>
                            <Text style={[styles.screenValue, { color: statusColor, fontFamily: theme.fontFamily }]}>
                                {code || (status === 'ERROR' ? 'ERR' : '----')}
                            </Text>
                            <Animated.View style={[styles.statusLight, { backgroundColor: statusColor, opacity: glowAnim }]} />
                        </View>

                        {/* Retro Keypad */}
                        <View style={styles.keypadGrid}>
                            <View style={styles.keyRow}>
                                <KeypadButton label="1" value="1" />
                                <KeypadButton label="2" value="2" />
                                <KeypadButton label="3" value="3" />
                            </View>
                            <View style={styles.keyRow}>
                                <KeypadButton label="4" value="4" />
                                <KeypadButton label="5" value="5" />
                                <KeypadButton label="6" value="6" />
                            </View>
                            <View style={styles.keyRow}>
                                <KeypadButton label="7" value="7" />
                                <KeypadButton label="8" value="8" />
                                <KeypadButton label="9" value="9" />
                            </View>
                            <View style={styles.keyRow}>
                                <KeypadButton label="DEL" value="DEL" style={{ backgroundColor: '#331111' }} />
                                <KeypadButton label="0" value="0" />
                                <KeypadButton label="OK" value="ENTER" style={{ backgroundColor: '#113311' }} />
                            </View>
                        </View>

                    </Animated.View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        height: 380, // Increased height for keypad
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    vaultFrame: {
        width: 320,
        height: 220, // Reduced door height slightly to fit keypad below? No, keypad overlays.
        // Actually, let's put keypad BELOW the doors if it's a "Terminal"
        // OR overlay it. User said "screen where we are entering code IS a control panel".
        // Let's make the keypad physically part of the unit below the screen (doors).
        position: 'absolute',
        top: 0,
        borderWidth: 4,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#000',
        zIndex: 1,
    },
    vaultInterior: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
    },
    door: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '50%',
        zIndex: 10,
    },
    interfaceLayer: {
        position: 'absolute',
        top: 40, // Push down so it sits ON TOP of the doors? 
        // Or visually, the keypad is separate.
        // Let's make the "Vault" the SCREEN of the ATM, and the keypad is below it.
        // Actually, `vaultFrame` is the screen.
        zIndex: 20,
        alignItems: 'center',
    },
    displayScreen: {
        width: 200,
        height: 80,
        borderWidth: 2,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#000',
        shadowColor: '#000',
        elevation: 5,
    },
    screenLabel: {
        fontSize: 8,
        position: 'absolute',
        top: 4,
        left: 6,
        opacity: 0.7,
    },
    screenValue: {
        fontSize: 32,
        letterSpacing: 4,
    },
    statusLight: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    keypadGrid: {
        width: 240,
        backgroundColor: 'rgba(0,0,0,0.8)', // Semi-transparent backing if it overlays
        padding: 5,
        borderRadius: 10,
    },
    keyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    keyButton: {
        width: 60,
        height: 40,
        borderWidth: 1, // Retro button border
        borderBottomWidth: 4, // 3D effect
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
    },
    keyText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lootText: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
    rivetTopLeft: { position: 'absolute', top: 5, left: 5, width: 6, height: 6, borderRadius: 3, backgroundColor: '#555' },
    rivetBottomLeft: { position: 'absolute', bottom: 5, left: 5, width: 6, height: 6, borderRadius: 3, backgroundColor: '#555' },
    rivetTopRight: { position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: 3, backgroundColor: '#555' },
    rivetBottomRight: { position: 'absolute', bottom: 5, right: 5, width: 6, height: 6, borderRadius: 3, backgroundColor: '#555' },
});
