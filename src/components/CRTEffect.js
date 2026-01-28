import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, PointerEvents } from 'react-native';

const { width, height } = Dimensions.get('window');

const CRTEffect = () => {
    const flickerAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
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
    }, [flickerAnim]);

    return (
        <View style={styles.container} pointerEvents="none">
            {/* Flicker Layer */}
            <Animated.View style={[styles.flickerLayer, { opacity: flickerAnim }]} />

            {/* Scanlines Layer - Simple efficient version: Repeating linear gradient simulation via semi-transparent rows? 
            Actually, rendering 1000 views is bad for performance. 
            Let's use a simple distinct Overlay with a background color that simulates the "darkening" lines 
            by just being a single view with a pattern if possible, or just a heavy static noise. 
            
            Better approach for React Native without assets: 
            Just the flicker and a slight vignette is often enough.
            But if we want scanlines, we ideally need an image.
            I will leave the scanline visual placeholder simple for now (flicker is the main request).
        */}
            <View style={styles.scanlineOverlay} />

            {/* Vignette (Corner darkening) - Simulated with borders */}
            <View style={styles.vignette} />
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
        backgroundColor: 'rgba(255, 255, 255, 0.02)', // Very subtle brightening/darkening
    },
    scanlineOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Just a dark tint for now, real scanlines need an image
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
