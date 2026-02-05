
import { TextStyle, ViewStyle } from 'react-native';

export type Era = '8-bit' | '16-bit' | '128-bit';

interface Theme {
    background: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    fontFamily: string;
    fontSizeScale: number;
    icons: {
        life: string; // Emoji for now, will swap to ImageSource later if needed, or keeping unicode if it renders well
        streak: string;
        currency: string;
    };
    buttonStyle: ViewStyle;
    cardStyle: ViewStyle;
    headerStyle: ViewStyle;
    crtConfig: {
        scanlineOpacity: number;
        vignetteOpacity: number;
        flickerEnabled: boolean;
        chromaticAberration: boolean; // Future placeholder
    };
}

import { Platform } from 'react-native';

const RETRO_FONT = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

export const ERAS: Record<Era, Theme> = {
    '8-bit': {
        background: '#000000', // Pure Black (Arcade Canon)
        textPrimary: '#00FF00', // Terminal Green
        textSecondary: '#FFFFFF', // High contrast white
        accent: '#00FF00', // Keep strictly green/white palette
        fontFamily: 'PressStart2P_400Regular',
        fontSizeScale: 0.6,
        icons: {
            life: '❤️', // PressStart2P might render these as pixels? If not, we need images.
            streak: '🔥',
            currency: '🪙',
        },
        buttonStyle: {
            borderWidth: 4, // Thick stroke
            borderColor: '#FFFFFF',
            backgroundColor: '#000000',
            borderRadius: 0, // Blocky
            paddingVertical: 12, // slightly reduced padding for dense feel
        },
        cardStyle: {
            backgroundColor: '#000000',
            borderWidth: 4, // Thick stroke
            borderColor: '#00FF00',
            borderRadius: 0,
        },
        headerStyle: {
            borderBottomWidth: 4,
            borderBottomColor: '#FFFFFF',
        },
        crtConfig: {
            scanlineOpacity: 0.15,
            vignetteOpacity: 0.3,
            flickerEnabled: true,
            chromaticAberration: false,
        }
    },
    '16-bit': {
        background: '#2B0F54', // SNES Purple
        textPrimary: '#FFD700', // Gold
        textSecondary: '#E0E0E0',
        accent: '#00CED1', // Cyan
        fontFamily: 'Silkscreen_400Regular', // Modern Retro for 16-bit
        fontSizeScale: 0.85,
        icons: {
            life: '💖', // Sparkle Heart
            streak: '⚡', // Lightning for 16-bit "Power"? Or Keep Fire?
            currency: '💎', // Gem instead of coin?
        },
        buttonStyle: {
            borderWidth: 2,
            borderColor: '#FFD700',
            backgroundColor: '#4B0082',
            borderRadius: 8, // Slightly round
            elevation: 4,
        },
        cardStyle: {
            backgroundColor: '#331155',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#FFD700',
        },
        headerStyle: {
            borderBottomWidth: 2,
            borderBottomColor: '#FFD700',
        },
        crtConfig: {
            scanlineOpacity: 0.05,
            vignetteOpacity: 0.1,
            flickerEnabled: true, // Subtle flicker
            chromaticAberration: false,
        }
    },
    '128-bit': {
        background: '#0F0F1A', // Deep "PlayStation 2" Boot Blue/Black void
        textPrimary: '#FFFFFF',
        textSecondary: '#A0A0A0',
        accent: '#0050FF', // Vivid Blue LED
        fontFamily: 'Orbitron_400Regular', // PS2 / Cyberpunk sleek style
        fontSizeScale: 0.9, // Orbitron is wide, reduce scale slightly
        icons: {
            life: '❤️',
            streak: '🔥',
            currency: '💎',
        },
        buttonStyle: {
            backgroundColor: 'rgba(0, 20, 80, 0.6)', // Glassy Blue Tint
            borderRadius: 6, // Slightly rounded but techy
            borderWidth: 1,
            borderColor: 'rgba(100, 200, 255, 0.4)',
            shadowColor: '#0050FF',
            shadowOpacity: 0.8,
            shadowRadius: 15,
            elevation: 10,
        },
        cardStyle: {
            backgroundColor: 'rgba(20, 20, 30, 0.85)',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: 'transparent',
        },
        crtConfig: {
            scanlineOpacity: 0,
            vignetteOpacity: 0.05, // Very subtle corner darkening
            flickerEnabled: false,
            chromaticAberration: true,
        }
    }
};

export const getEraForStreak = (streak: number): Era => {
    if (streak < 8) return '8-bit';
    if (streak < 22) return '16-bit';
    return '128-bit';
};
