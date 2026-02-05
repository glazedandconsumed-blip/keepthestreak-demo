import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Vibration } from 'react-native';
import PixelIcon from './PixelIcon';
import { HapticPatterns } from '../logic/haptics';

export const SecurityTerminal = ({ theme, correctSolution, onUnlock, onMistake, disabled, variant = 'VAULT' }) => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('LOCKED'); // LOCKED, UNLOCKING, OPEN, ERROR

    // Animation Values
    const doorLeftAnim = useRef(new Animated.Value(0)).current;
    const doorRightAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    // Vault Specific
    const lockRotateAnim = useRef(new Animated.Value(0)).current;
    const lockOpacityAnim = useRef(new Animated.Value(1)).current;
    // Terminal Specific
    const terminalFlashAnim = useRef(new Animated.Value(0)).current;
    // Panel Specific
    const screwRotateAnim = useRef(new Animated.Value(0)).current;
    const panelDropAnim = useRef(new Animated.Value(0)).current;
    // Lid Specific (Car Hood, Dumpster, Crate)
    const lidLiftAnim = useRef(new Animated.Value(0)).current;

    const startUnlockSequence = () => {
        setStatus('UNLOCKING');

        const isLidType = ['CAR_HOOD', 'DUMPSTER', 'CRATE', 'LOCKER'].includes(variant);

        if (variant === 'VAULT') {
            // 1. Mechanical Unlock Sequence (VAULT)
            HapticPatterns.doorOpen();
            Animated.sequence([
                Animated.timing(lockRotateAnim, { toValue: 1, duration: 300, easing: Easing.elastic(1.2), useNativeDriver: true }),
                Animated.timing(lockOpacityAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
                Animated.parallel([
                    Animated.timing(doorLeftAnim, { toValue: -150, duration: 800, easing: Easing.bounce, useNativeDriver: true }),
                    Animated.timing(doorRightAnim, { toValue: 150, duration: 800, easing: Easing.bounce, useNativeDriver: true })
                ])
            ]).start(() => {
                setStatus('OPEN');
                HapticPatterns.unlock();
                setTimeout(() => { onUnlock(); }, 1000);
            });
        }
        else if (variant === 'PANEL') {
            // 2. Unscrew Panel
            HapticPatterns.keypress();
            Animated.sequence([
                Animated.timing(screwRotateAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.timing(panelDropAnim, { toValue: 400, duration: 600, easing: Easing.bounce, useNativeDriver: true })
            ]).start(() => {
                setStatus('OPEN');
                HapticPatterns.unlock();
                setTimeout(() => { onUnlock(); }, 1000);
            });
        }
        else if (isLidType) {
            // 3. Lid Lift (Car Hood, Dumpster, Crate)
            HapticPatterns.doorOpen();
            Animated.sequence([
                // "Pop" the latch
                Animated.timing(lidLiftAnim, { toValue: 0.1, duration: 100, useNativeDriver: true }),
                // Lift Open
                Animated.spring(lidLiftAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true })
            ]).start(() => {
                setStatus('OPEN');
                HapticPatterns.unlock();
                setTimeout(() => { onUnlock(); }, 1000);
            });
        }
        else {
            // 4. Digital (Terminal)
            HapticPatterns.unlock();
            Animated.sequence([
                Animated.timing(terminalFlashAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
                Animated.timing(terminalFlashAnim, { toValue: 0, duration: 200, useNativeDriver: false })
            ]).start(() => {
                setStatus('OPEN');
                onUnlock();
                setTimeout(() => {
                    setCode('');
                    setStatus('LOCKED');
                }, 100);
            });
        }
    };

    const screwRotation = screwRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-360deg'] // Counter-clockwise unscrew
    });

    const handlePress = (value) => {
        if (value === 'DEL') {
            HapticPatterns.keypress();
            setCode(prev => prev.slice(0, -1));
        } else if (value === 'ENTER') {
            if (code.length === 0) return;
            validateCode();
        } else {
            HapticPatterns.keypress();
            if (code.length < 4) {
                setCode(prev => prev + value);
            }
        }
    };

    const validateCode = () => {
        // Quick sanity check
        if (parseInt(code) === correctSolution) {
            startUnlockSequence();
        } else {
            // Error
            setStatus('ERROR');
            HapticPatterns.error();
            if (onMistake) onMistake(); // Trigger mistake callback (e.g., lose life)
            setCode('ERR');

            // Shake Animation
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
            ]).start();

            setTimeout(() => {
                setStatus('LOCKED');
                setCode('');
            }, 800);
        }
    };

    const lockRotation = lockRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    });

    const statusColor = status === 'ERROR' ? '#FF0000' : (status === 'SUCCESS' || status === 'OPEN' ? '#00FF00' : theme.accent);

    // Interpolate flash color for Terminal
    const flashColor = terminalFlashAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', theme.accent] // Flash to accent color
    });

    const KeypadButton = ({ label, value, style }) => (
        <TouchableOpacity
            style={[styles.keyButton, { borderColor: theme.textSecondary, backgroundColor: theme.background }, style]}
            onPress={() => handlePress(value)}
            disabled={disabled || (status === 'UNLOCKING' && variant === 'VAULT')}
        >
            <Text style={[styles.keyText, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>

                {/* VAULT MODE UI */}
                {variant === 'VAULT' && (
                    <View style={[styles.vaultFrame, { borderColor: theme.textSecondary }]}>
                        {/* Interior */}
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
                        {/* Doors */}
                        <Animated.View style={[styles.door, { left: 0, backgroundColor: theme.background, borderRightWidth: 2, borderColor: theme.textSecondary, transform: [{ translateX: doorLeftAnim }] }]}>
                            <View style={styles.rivetTopLeft} />
                            <View style={styles.rivetBottomLeft} />
                        </Animated.View>
                        <Animated.View style={[styles.door, { right: 0, backgroundColor: theme.background, borderLeftWidth: 2, borderColor: theme.textSecondary, transform: [{ translateX: doorRightAnim }] }]}>
                            <View style={styles.rivetTopRight} />
                            <View style={styles.rivetBottomRight} />
                        </Animated.View>
                        {/* Lock Mechanism */}
                        <Animated.View style={[styles.lockMechanism, { borderColor: theme.textSecondary, backgroundColor: theme.background, opacity: lockOpacityAnim, transform: [{ rotate: lockRotation }] }]}>
                            <View style={[styles.lockBar, { backgroundColor: theme.textSecondary }]} />
                        </Animated.View>
                    </View>
                )}

                {/* PANEL MODE UI */}
                {variant === 'PANEL' && (
                    <View style={[styles.vaultFrame, { borderColor: theme.textSecondary, overflow: 'visible' }]}>
                        {/* Interior */}
                        <View style={[styles.vaultInterior, { borderRadius: 10, overflow: 'hidden' }]}>
                            {status === 'OPEN' && (
                                <View style={{ alignItems: 'center' }}>
                                    <PixelIcon name="currency" size={60} />
                                    <Text style={[styles.lootText, { fontFamily: theme.fontFamily, color: theme.accent }]}>ACCESS GRANTED</Text>
                                </View>
                            )}
                        </View>
                        {/* The Panel Itself */}
                        <Animated.View style={[styles.panelPlate, { backgroundColor: theme.buttonStyle.backgroundColor || '#222', borderColor: theme.textSecondary, transform: [{ translateY: panelDropAnim }, { rotate: panelDropAnim.interpolate({ inputRange: [0, 400], outputRange: ['0deg', '15deg'] }) }] }]}>
                            <View style={styles.panelCautionStrip} />
                            <Text style={[styles.panelText, { fontFamily: theme.fontFamily }]}>MAINTENANCE ONLY</Text>
                            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
                                <Animated.View key={pos} style={[styles.screw, pos === 'top-left' && { top: 10, left: 10 }, pos === 'top-right' && { top: 10, right: 10 }, pos === 'bottom-left' && { bottom: 10, left: 10 }, pos === 'bottom-right' && { bottom: 10, right: 10 }, { transform: [{ rotate: screwRotation }] }]}>
                                    <View style={styles.screwSlot} />
                                    <View style={[styles.screwSlot, { transform: [{ rotate: '90deg' }] }]} />
                                </Animated.View>
                            ))}
                        </Animated.View>
                    </View>
                )}

                {/* LID MODE UI (Hood, Dumpster, Crate) */}
                {['CAR_HOOD', 'DUMPSTER', 'CRATE', 'LOCKER'].includes(variant) && (
                    <View style={[styles.vaultFrame, { borderColor: theme.textSecondary, overflow: 'hidden' }]}>
                        {/* Interior */}
                        <View style={[styles.vaultInterior, { backgroundColor: '#050505' }]}>
                            {status === 'OPEN' && (
                                <View style={{ alignItems: 'center' }}>
                                    <PixelIcon name="currency" size={60} />
                                    <Text style={[styles.lootText, { fontFamily: theme.fontFamily, color: theme.accent }]}>
                                        {variant.replace('_', ' ')} OPENED
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* The Lid */}
                        <Animated.View style={[
                            styles.lidPlate,
                            {
                                backgroundColor: variant === 'CAR_HOOD' ? '#AA2222' : (variant === 'DUMPSTER' ? '#225522' : '#664422'), // Red Hood, Green Dumpster, Brown Crate
                                transform: [
                                    { perspective: 800 },
                                    { rotateX: lidLiftAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-120deg'] }) },
                                    { translateY: lidLiftAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -100] }) }
                                ]
                            }
                        ]}>
                            <View style={styles.lidTexture} />
                            <Text style={[styles.panelText, { fontFamily: theme.fontFamily, color: '#00000055' }]}>
                                {variant === 'CAR_HOOD' ? 'V8 TURBO' : (variant === 'DUMPSTER' ? 'WASTE ONLY' : 'CARGO')}
                            </Text>
                        </Animated.View>
                    </View>
                )}

                {/* TERMINAL MODE / SHARED UI */}
                {/* If VAULT, this floats on top. If TERMINAL, this IS the UI. */}
                {/* For Terminal, we just show the Screen + Keypad directly, no doors. */}

                {status !== 'OPEN' && variant === 'VAULT' && status !== 'UNLOCKING' && (
                    <Animated.View style={[styles.interfaceLayer, { transform: [{ translateX: shakeAnim }] }]}>
                        {/* Vault Keypad Overlay */}
                        <View style={[styles.displayScreen, { borderColor: theme.textSecondary, backgroundColor: '#000' }]}>
                            <Text style={[styles.screenLabel, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>SEC-TERM v3.0</Text>
                            <Text style={[styles.screenValue, { color: statusColor, fontFamily: theme.fontFamily }]}>{code || (status === 'ERROR' ? 'ERR' : '----')}</Text>
                            <Animated.View style={[styles.statusLight, { backgroundColor: statusColor, opacity: glowAnim }]} />
                        </View>

                        <View style={styles.keypadGrid}>
                            <View style={styles.keyRow}><KeypadButton label="1" value="1" /><KeypadButton label="2" value="2" /><KeypadButton label="3" value="3" /></View>
                            <View style={styles.keyRow}><KeypadButton label="4" value="4" /><KeypadButton label="5" value="5" /><KeypadButton label="6" value="6" /></View>
                            <View style={styles.keyRow}><KeypadButton label="7" value="7" /><KeypadButton label="8" value="8" /><KeypadButton label="9" value="9" /></View>
                            <View style={styles.keyRow}><KeypadButton label="DEL" value="DEL" style={{ backgroundColor: '#331111' }} /><KeypadButton label="0" value="0" /><KeypadButton label="OK" value="ENTER" style={{ backgroundColor: '#113311' }} /></View>
                        </View>
                    </Animated.View>
                )}

                {variant === 'TERMINAL' && (
                    <Animated.View style={[styles.terminalWrapper, { transform: [{ translateX: shakeAnim }] }]}>
                        {/* Terminal Screen - Bigger, more "Monitor" like */}
                        <Animated.View style={[styles.monitorFrame, { borderColor: theme.textSecondary, backgroundColor: flashColor }]}>
                            <View style={styles.monitorInner}>
                                <Text style={[styles.screenLabel, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>SYSTEM_OVERRIDE // {status}</Text>
                                <Text style={[styles.screenValueLarge, { color: statusColor, fontFamily: theme.fontFamily }]}>{code || (status === 'ERROR' ? 'ERR' : '____')}</Text>
                            </View>
                        </Animated.View>

                        <View style={[styles.keypadGrid, { marginTop: 20 }]}>
                            <View style={styles.keyRow}><KeypadButton label="1" value="1" /><KeypadButton label="2" value="2" /><KeypadButton label="3" value="3" /></View>
                            <View style={styles.keyRow}><KeypadButton label="4" value="4" /><KeypadButton label="5" value="5" /><KeypadButton label="6" value="6" /></View>
                            <View style={styles.keyRow}><KeypadButton label="7" value="7" /><KeypadButton label="8" value="8" /><KeypadButton label="9" value="9" /></View>
                            <View style={styles.keyRow}><KeypadButton label="DEL" value="DEL" style={{ backgroundColor: '#331111' }} /><KeypadButton label="0" value="0" /><KeypadButton label="OK" value="ENTER" style={{ backgroundColor: '#113311' }} /></View>
                        </View>
                    </Animated.View>
                )}

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: { width: '100%', alignItems: 'center' },
    container: { width: '100%', height: 400, alignItems: 'center', justifyContent: 'center', marginVertical: 10 }, // Increased height
    // ... Existing Vault Styles (Keep them) ...
    vaultFrame: { width: 320, height: 220, position: 'absolute', top: 0, borderWidth: 4, borderRadius: 10, overflow: 'hidden', backgroundColor: '#000', zIndex: 1 },
    vaultInterior: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
    door: { position: 'absolute', top: 0, bottom: 0, width: '50%', zIndex: 10 },
    lootText: { marginTop: 10, fontSize: 10 },
    interfaceLayer: { position: 'absolute', top: 40, zIndex: 20, alignItems: 'center' },

    // New Terminal Styles
    terminalWrapper: { alignItems: 'center', width: '100%' },
    monitorFrame: { width: 300, height: 120, borderWidth: 2, borderRadius: 4, backgroundColor: '#000', marginBottom: 10, padding: 4 },
    monitorInner: { flex: 1, backgroundColor: '#000000AA', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
    screenValueLarge: { fontSize: 48, letterSpacing: 8 },

    // Panel Styles
    panelPlate: { ...StyleSheet.absoluteFillObject, borderWidth: 2, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    panelCautionStrip: { position: 'absolute', width: '100%', height: 40, backgroundColor: '#FFD700', opacity: 0.2, top: 40, transform: [{ skewX: '-20deg' }] },
    panelText: { fontSize: 16, color: '#AAA', fontWeight: 'bold', opacity: 0.5 },
    screw: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#888', borderWidth: 1, borderColor: '#444', alignItems: 'center', justifyContent: 'center' },
    screwSlot: { position: 'absolute', width: 14, height: 2, backgroundColor: '#333' },

    // Lid Styles
    lidPlate: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 10, borderBottomColor: '#00000033', zIndex: 10 },
    lidTexture: { position: 'absolute', width: '80%', height: '80%', borderWidth: 2, borderColor: '#00000022', borderRadius: 10 },

    // Shared
    displayScreen: { width: 200, height: 80, borderWidth: 2, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginBottom: 20, backgroundColor: '#000', shadowColor: '#000', elevation: 5 },
    screenLabel: { fontSize: 8, position: 'absolute', top: 4, left: 6, opacity: 0.7 },
    screenValue: { fontSize: 32, letterSpacing: 4 },
    statusLight: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4 },
    lockMechanism: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 4, alignSelf: 'center', top: 80, zIndex: 30, justifyContent: 'center', alignItems: 'center' },
    lockBar: { width: 40, height: 6, borderRadius: 3 },
    rivetTopLeft: { position: 'absolute', top: 10, left: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: '#555' },
    rivetBottomLeft: { position: 'absolute', bottom: 10, left: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: '#555' },
    rivetTopRight: { position: 'absolute', top: 10, right: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: '#555' },
    rivetBottomRight: { position: 'absolute', bottom: 10, right: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: '#555' },

    keypadGrid: { width: 220, gap: 8 },
    keyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    keyButton: { width: 60, height: 40, borderWidth: 1, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
    keyText: { fontSize: 16 }
});
