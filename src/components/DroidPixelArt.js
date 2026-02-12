import React from 'react';
import { View, StyleSheet } from 'react-native';

// Each droid is a 16x16 pixel grid
// Colors: '.' = transparent, 'p' = primary (accent), 's' = secondary, 't' = text, 'b' = background dark
const DROID_SPRITES = {
    // Box-Orb Unit: spherical head on cubic body
    'box-orb': [
        '................',
        '......pppp......',
        '....ppsssspp....',
        '....psttstsp....',
        '....pstssssp....',
        '....ppsssspp....',
        '......pppp......',
        '.....pssssp.....',
        '....pppppppp....',
        '....pssssssp....',
        '....pssssssp....',
        '....pppppppp....',
        '.....pp..pp.....',
        '....pp....pp....',
        '....pp....pp....',
        '................',
    ],

    // Bipedal Model: humanoid shape
    'bipedal': [
        '................',
        '.....pppppp.....',
        '....psssssp.....',
        '....ptsssp......',
        '....pssssp......',
        '.....pppppp.....',
        '......pp........',
        '....pppppp......',
        '...psspssp......',
        '...pssssssp.....',
        '....pppppp......',
        '......pp........',
        '.....pppp.......',
        '....pp..pp......',
        '...pp....pp.....',
        '................',
    ],

    // Tank Chassis: wide treaded platform
    'tank': [
        '................',
        '....pppppp......',
        '...pssssssp.....',
        '...pttsssp......',
        '...pssssssp.....',
        '....pppppp......',
        '.....pppp.......',
        '..pppppppppp....',
        '.psssssssssp....',
        '.pssssssssssp...',
        '.pppppppppppp...',
        '.ptptptptptpp...',
        '.pppppppppppp...',
        '................',
        '................',
        '................',
    ],

    // Minimal Core: small stripped-down unit
    'minimal-core': [
        '................',
        '................',
        '.......pp.......',
        '......pppp......',
        '.....ptsstp.....',
        '.....pssssp.....',
        '......pppp......',
        '.......pp.......',
        '......pppp......',
        '.....pssssp.....',
        '......pppp......',
        '.......pp.......',
        '......p..p......',
        '................',
        '................',
        '................',
    ],

    // Scout Drone: lightweight flying unit
    'scout': [
        '................',
        '......pppp......',
        '.....ptsstp.....',
        '.....pssssp.....',
        '......pppp......',
        '...pp.pp.pp.....',
        '..pppppppppp....',
        '.psspssssspsp...',
        '..pppppppppp....',
        '...pp.pp.pp.....',
        '......pp........',
        '.....pppp.......',
        '......pp........',
        '................',
        '................',
        '................',
    ],

    // Heavy Frame: reinforced industrial
    'heavy': [
        '................',
        '...pppppppp.....',
        '..psssssssp.....',
        '..pttssstsp.....',
        '..psssssssp.....',
        '...pppppppp.....',
        '..pppppppppp....',
        '.psssssssssp....',
        '.pssspsssssp....',
        '.psssssssssp....',
        '.pppppppppppp...',
        '.pppp....pppp...',
        '.pppp....pppp...',
        '.pppp....pppp...',
        '................',
        '................',
    ],

    // Stealth Unit: sleek low-profile
    'stealth': [
        '................',
        '................',
        '......pppp......',
        '.....ptsstp.....',
        '......pppp......',
        '....pppppppp....',
        '...psssssssp....',
        '..pssssssssssp..',
        '...psssssssp....',
        '....pppppppp....',
        '......pppp......',
        '.......pp.......',
        '................',
        '................',
        '................',
        '................',
    ],

    // Titan Class: large military unit
    'titan': [
        '....pppppp......',
        '...pssssssp.....',
        '...pttssstp.....',
        '...psssssp......',
        '...pppppppp.....',
        '..pppppppppp....',
        '.psssspssssp....',
        '.psssssssssp....',
        '.psssssssssp....',
        '.pppppppppppp...',
        '..pppp..pppp....',
        '.ppppp..ppppp...',
        '.ppppp..ppppp...',
        '.pptpp..pptpp...',
        '.ppppp..ppppp...',
        '................',
    ],

    // Quantum Core: experimental glowing unit
    'quantum': [
        '................',
        '....s.pp.s......',
        '...sptsstp s....',
        '....psssssp.....',
        '...spssssps.....',
        '....pppppp......',
        '.s...pppp...s...',
        '....pssssp......',
        '....pssssp......',
        '.s...pppp...s...',
        '....pppppp......',
        '.....p..p.......',
        '....pp..pp......',
        '................',
        '................',
        '................',
    ],

    // Orbital Frame: satellite-like
    'orbital': [
        '................',
        '.p............p.',
        '..p..pppp....p..',
        '...ptssstp.....',
        '....pssssp......',
        '.....pppp.......',
        'ppppppppppppppp.',
        '.....pppp.......',
        '....pssssp......',
        '.....pppp.......',
        'ppppppppppppppp.',
        '.....pppp.......',
        '..p..pppp..p....',
        '.p..........p...',
        '................',
        '................',
    ],

    // Nexus Prime: network hub
    'nexus': [
        '................',
        '..p...pp...p....',
        '...p.pssp.p.....',
        '....ppsspp......',
        '...ptsssstp.....',
        '...psssssp......',
        '....pppppp......',
        '..pppsssppp.....',
        '.pssspsssssp....',
        '..pppsssppp.....',
        '....pppppp......',
        '...p..pp..p.....',
        '..p...pp...p....',
        '.p....pp....p...',
        '................',
        '................',
    ],

    // Genesis: the final evolution
    'genesis-droid': [
        '......ssss......',
        '....ssppppss....',
        '...sptsssstp s..',
        '...spsssssp s...',
        '...sppppppps....',
        '....ssssssss....',
        '..sssppsppss s..',
        '.spsssssssssp...',
        '.spssssssssp....',
        '..ssppppppss....',
        '...sssssss s....',
        '....ss..ss......',
        '...ssp..pss.....',
        '..ssp....pss....',
        '..ss......ss....',
        '................',
    ],
};

// Locked droid silhouette
const LOCKED_SPRITE = [
    '................',
    '......pppp......',
    '.....pppppp.....',
    '....pppppppp....',
    '....pppppppp....',
    '....pppppppp....',
    '.....pppppp.....',
    '......pppp......',
    '.....pppppp.....',
    '....pppppppp....',
    '....pppppppp....',
    '.....pppppp.....',
    '......pp.pp.....',
    '.....pp...pp....',
    '................',
    '................',
];

/**
 * Renders a droid sprite using the era's color palette
 * 
 * @param {object} props
 * @param {string} props.droidId - The droid chassis ID
 * @param {object} props.theme - The current era theme
 * @param {number} [props.size=64] - Total size in px
 * @param {boolean} [props.locked=false] - Show as locked silhouette
 * @param {object} [props.style] - Additional styles
 */
const DroidPixelArt = ({ droidId, theme, size = 64, locked = false, style }) => {
    const sprite = locked ? LOCKED_SPRITE : (DROID_SPRITES[droidId] || DROID_SPRITES['box-orb']);
    const pixelSize = size / 16;

    // Map sprite color codes to theme colors
    const getColor = (char) => {
        if (char === '.') return 'transparent';
        if (locked) return char === 'p' ? 'rgba(128,128,128,0.3)' : 'transparent';

        switch (char) {
            case 'p': return theme.accent;
            case 's': return theme.textSecondary;
            case 't': return theme.textPrimary;
            case 'b': return theme.background;
            default: return 'transparent';
        }
    };

    return (
        <View style={[{ width: size, height: size }, style]}>
            {sprite.map((row, y) => (
                <View key={y} style={{ flexDirection: 'row', height: pixelSize }}>
                    {row.split('').map((char, x) => {
                        const color = getColor(char);
                        if (color === 'transparent') {
                            return <View key={x} style={{ width: pixelSize, height: pixelSize }} />;
                        }
                        return (
                            <View
                                key={x}
                                style={{
                                    width: pixelSize,
                                    height: pixelSize,
                                    backgroundColor: color,
                                }}
                            />
                        );
                    })}
                </View>
            ))}
        </View>
    );
};

export default DroidPixelArt;
