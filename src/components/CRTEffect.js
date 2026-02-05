import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, PointerEvents } from 'react-native';

const { width, height } = Dimensions.get('window');

const CRTEffect = ({ scanlineOpacity = 0.1, vignetteOpacity = 0.3, flickerEnabled = true, chromaticAberration = false }) => {
    const flickerAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!flickerEnabled) {
            flickerAnim.setValue(1);
            return; // Stop loop
        }

        // 60Hz Flicker Effect
        Animated.loop(
            Animated.sequence([
                Animated.timing(flickerAnim, {
                    toValue: 0.92, // Slight dim
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(flickerAnim, {
                    toValue: 0.98, // Bright
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(flickerAnim, {
                    toValue: 0.95, // Mid
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(flickerAnim, {
                    toValue: 1, // Full brightness
                    duration: 100, // Longer hold
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [flickerAnim, flickerEnabled]);

    return (
        <View style={styles.container} pointerEvents="none">
            {/* Flicker Layer */}
            {flickerEnabled && (
                <Animated.View style={[styles.flickerLayer, { opacity: flickerAnim }]} />
            )}

            {/* Scanlines Layer */}
            {scanlineOpacity > 0 && (
                <View style={[styles.scanlineOverlay, { backgroundColor: `rgba(0, 0, 0, ${scanlineOpacity})` }]} />
            )}

            {/* Vignette (Corner darkening) */}
            {vignetteOpacity > 0 && (
                <View style={[styles.vignette, {
                    borderWidth: 50,
                    borderColor: `rgba(0,0,0,${vignetteOpacity})`,
                    borderRadius: 20
                }]} />
            )}

            {/* Placeholder for Chromatic Aberration */}
            {chromaticAberration && (
                <View style={[styles.aberrationLayer, { backgroundColor: 'transparent' }]} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999, // On top of everything
        elevation: 9999,
    },
    flickerLayer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(50, 255, 50, 0.03)', // Subtle Green Tint
    },
    scanlineOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 20, 0, 0.1)', // Darker Green scanlines
    },
    vignette: {
        ...StyleSheet.absoluteFillObject,
        // This is a hacky vignette using thick borders with low opacity if radial gradient isn't available
        borderWidth: 0,
        // For a true vignette we'd need expo-linear-gradient and a radial setup, 
        // or an image. Let's keep it clean for now.
    }
});

export default CRTEffect;
