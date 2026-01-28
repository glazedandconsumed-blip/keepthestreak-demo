
import { TextStyle, ViewStyle } from 'react-native';

export type Era = '8-bit' | '16-bit' | '32-bit';

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
        }
    },
    '32-bit': {
        background: '#1A1A1A', // PS2 Dark Gray
        textPrimary: '#FFFFFF',
        textSecondary: '#A0A0A0',
        accent: '#007AFF', // PlayStation Blue
        fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif', // Modern look
        fontSizeScale: 1.0,
        icons: {
            life: '❤️',
            streak: '🔥',
            currency: '🪙',
        },
        buttonStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Glassy
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            shadowColor: '#007AFF',
            shadowOpacity: 0.5,
            shadowRadius: 10,
        },
        cardStyle: {
            backgroundColor: 'rgba(30, 30, 30, 0.8)',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: 'transparent',
        }
    }
};

export const getEraForStreak = (streak: number): Era => {
    if (streak < 8) return '8-bit';
    if (streak < 22) return '16-bit';
    return '32-bit';
};
