
import { TextStyle, ViewStyle } from 'react-native';
import { Platform } from 'react-native';

export type Era = 'atari' | 'gameboy' | 'nes' | 'master-system' | 'snes' | 'genesis' | 'ps1' | 'n64' | 'ps2';

interface Theme {
    background: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    fontFamily: string;
    fontSizeScale: number;
    eraDisplayName: string;
    footerText: string;
    icons: {
        life: string;
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
        chromaticAberration: boolean;
    };
}

const RETRO_FONT = Platform.OS === 'ios' ? 'Courier New' : 'monospace';

export const ERAS: Record<Era, Theme> = {
    // ── Era 1: Atari 2600 (Streak 0–2) ─────────────────────────────
    'atari': {
        background: '#0A0A00',
        textPrimary: '#D4A017',
        textSecondary: '#8B7A2E',
        accent: '#D4A017',
        fontFamily: 'PressStart2P_400Regular',
        fontSizeScale: 0.55,
        eraDisplayName: 'ATARI 2600',
        footerText: 'POWER ON • ATARI 2600',
        icons: {
            life: '❤️',
            streak: '🔥',
            currency: '🪙',
        },
        buttonStyle: {
            borderWidth: 4,
            borderColor: '#D4A017',
            backgroundColor: '#1A1A00',
            borderRadius: 0,
            paddingVertical: 14,
        },
        cardStyle: {
            backgroundColor: '#0F0F00',
            borderWidth: 4,
            borderColor: '#D4A017',
            borderRadius: 0,
        },
        headerStyle: {
            borderBottomWidth: 4,
            borderBottomColor: '#D4A017',
        },
        crtConfig: {
            scanlineOpacity: 0.2,
            vignetteOpacity: 0.35,
            flickerEnabled: true,
            chromaticAberration: false,
        }
    },

    // ── Era 2: Game Boy (Streak 3–6) ────────────────────────────────
    'gameboy': {
        background: '#9BBC0F',
        textPrimary: '#0F380F',
        textSecondary: '#306230',
        accent: '#0F380F',
        fontFamily: 'PressStart2P_400Regular',
        fontSizeScale: 0.55,
        eraDisplayName: 'GAME BOY',
        footerText: 'POWER ON • GAME BOY',
        icons: {
            life: '❤️',
            streak: '🔥',
            currency: '🪙',
        },
        buttonStyle: {
            borderWidth: 3,
            borderColor: '#0F380F',
            backgroundColor: '#8BAC0F',
            borderRadius: 0,
            paddingVertical: 14,
        },
        cardStyle: {
            backgroundColor: '#8BAC0F',
            borderWidth: 3,
            borderColor: '#0F380F',
            borderRadius: 0,
        },
        headerStyle: {
            borderBottomWidth: 3,
            borderBottomColor: '#0F380F',
        },
        crtConfig: {
            scanlineOpacity: 0.12,
            vignetteOpacity: 0.2,
            flickerEnabled: true,
            chromaticAberration: false,
        }
    },

    // ── Era 3: NES (Streak 7–13) ────────────────────────────────────
    'nes': {
        background: '#1A0A0A',
        textPrimary: '#E8D0AA',
        textSecondary: '#AA8866',
        accent: '#CC3333',
        fontFamily: 'PressStart2P_400Regular',
        fontSizeScale: 0.55,
        eraDisplayName: 'NES',
        footerText: 'POWER ON • NES',
        icons: {
            life: '❤️',
            streak: '🔥',
            currency: '🪙',
        },
        buttonStyle: {
            borderWidth: 3,
            borderColor: '#CC3333',
            backgroundColor: '#2A1010',
            borderRadius: 2,
            paddingVertical: 14,
        },
        cardStyle: {
            backgroundColor: '#1E0808',
            borderWidth: 3,
            borderColor: '#CC3333',
            borderRadius: 2,
        },
        headerStyle: {
            borderBottomWidth: 3,
            borderBottomColor: '#CC3333',
        },
        crtConfig: {
            scanlineOpacity: 0.1,
            vignetteOpacity: 0.25,
            flickerEnabled: true,
            chromaticAberration: false,
        }
    },

    // ── Era 4: Sega Master System (Streak 14–20) ────────────────────
    'master-system': {
        background: '#0A0A2E',
        textPrimary: '#FFFFFF',
        textSecondary: '#8888BB',
        accent: '#3399FF',
        fontFamily: 'Silkscreen_400Regular',
        fontSizeScale: 0.75,
        eraDisplayName: 'MASTER SYSTEM',
        footerText: 'POWER ON • MASTER SYSTEM',
        icons: {
            life: '💙',
            streak: '⚡',
            currency: '💎',
        },
        buttonStyle: {
            borderWidth: 2,
            borderColor: '#3399FF',
            backgroundColor: '#141440',
            borderRadius: 4,
            paddingVertical: 12,
        },
        cardStyle: {
            backgroundColor: '#0F0F28',
            borderWidth: 2,
            borderColor: '#3399FF',
            borderRadius: 4,
        },
        headerStyle: {
            borderBottomWidth: 2,
            borderBottomColor: '#3399FF',
        },
        crtConfig: {
            scanlineOpacity: 0.08,
            vignetteOpacity: 0.15,
            flickerEnabled: true,
            chromaticAberration: false,
        }
    },

    // ── Era 5: SNES (Streak 21–29) ──────────────────────────────────
    'snes': {
        background: '#2B0F54',
        textPrimary: '#FFD700',
        textSecondary: '#C0A060',
        accent: '#FFD700',
        fontFamily: 'Silkscreen_400Regular',
        fontSizeScale: 0.8,
        eraDisplayName: 'SNES',
        footerText: 'POWER ON • SNES',
        icons: {
            life: '💖',
            streak: '⚡',
            currency: '💎',
        },
        buttonStyle: {
            borderWidth: 2,
            borderColor: '#FFD700',
            backgroundColor: '#3D1A6E',
            borderRadius: 6,
            paddingVertical: 12,
            elevation: 4,
        },
        cardStyle: {
            backgroundColor: '#331155',
            borderWidth: 2,
            borderColor: '#FFD700',
            borderRadius: 6,
        },
        headerStyle: {
            borderBottomWidth: 2,
            borderBottomColor: '#FFD700',
        },
        crtConfig: {
            scanlineOpacity: 0.05,
            vignetteOpacity: 0.1,
            flickerEnabled: true,
            chromaticAberration: false,
        }
    },

    // ── Era 6: Sega Genesis (Streak 30–44) ──────────────────────────
    'genesis': {
        background: '#0A0A1E',
        textPrimary: '#FFFFFF',
        textSecondary: '#6688CC',
        accent: '#0088FF',
        fontFamily: 'Silkscreen_400Regular',
        fontSizeScale: 0.8,
        eraDisplayName: 'SEGA GENESIS',
        footerText: 'POWER ON • SEGA GENESIS',
        icons: {
            life: '💙',
            streak: '⚡',
            currency: '💎',
        },
        buttonStyle: {
            borderWidth: 2,
            borderColor: '#0088FF',
            backgroundColor: '#0F1430',
            borderRadius: 6,
            paddingVertical: 12,
        },
        cardStyle: {
            backgroundColor: '#0D1028',
            borderWidth: 2,
            borderColor: '#0088FF',
            borderRadius: 6,
        },
        headerStyle: {
            borderBottomWidth: 2,
            borderBottomColor: '#0088FF',
        },
        crtConfig: {
            scanlineOpacity: 0.04,
            vignetteOpacity: 0.1,
            flickerEnabled: false,
            chromaticAberration: false,
        }
    },

    // ── Era 7: PlayStation 1 (Streak 45–67) ─────────────────────────
    'ps1': {
        background: '#1A1A2E',
        textPrimary: '#E0E0E0',
        textSecondary: '#888899',
        accent: '#A0A0B0',
        fontFamily: 'VT323_400Regular',
        fontSizeScale: 0.9,
        eraDisplayName: 'PLAYSTATION',
        footerText: 'POWER ON • PLAYSTATION',
        icons: {
            life: '❤️',
            streak: '🔥',
            currency: '💎',
        },
        buttonStyle: {
            borderWidth: 1,
            borderColor: '#A0A0B0',
            backgroundColor: '#222238',
            borderRadius: 8,
            paddingVertical: 12,
        },
        cardStyle: {
            backgroundColor: '#1E1E30',
            borderWidth: 1,
            borderColor: 'rgba(160, 160, 176, 0.5)',
            borderRadius: 8,
        },
        headerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: '#A0A0B0',
        },
        crtConfig: {
            scanlineOpacity: 0.02,
            vignetteOpacity: 0.08,
            flickerEnabled: false,
            chromaticAberration: false,
        }
    },

    // ── Era 8: N64 (Streak 68–89) ───────────────────────────────────
    'n64': {
        background: '#0F0F2A',
        textPrimary: '#FFFFFF',
        textSecondary: '#CC9955',
        accent: '#FF6600',
        fontFamily: 'VT323_400Regular',
        fontSizeScale: 0.9,
        eraDisplayName: 'N64',
        footerText: 'POWER ON • N64',
        icons: {
            life: '❤️',
            streak: '🔥',
            currency: '💎',
        },
        buttonStyle: {
            borderWidth: 1,
            borderColor: '#FF6600',
            backgroundColor: '#1A1530',
            borderRadius: 8,
            paddingVertical: 12,
        },
        cardStyle: {
            backgroundColor: '#141028',
            borderWidth: 1,
            borderColor: 'rgba(255, 102, 0, 0.5)',
            borderRadius: 8,
        },
        headerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: '#FF6600',
        },
        crtConfig: {
            scanlineOpacity: 0,
            vignetteOpacity: 0.06,
            flickerEnabled: false,
            chromaticAberration: false,
        }
    },

    // ── Era 9: PlayStation 2 (Streak 90+) ───────────────────────────
    'ps2': {
        background: '#0A0A1A',
        textPrimary: '#FFFFFF',
        textSecondary: '#668899',
        accent: '#00CCDD',
        fontFamily: 'Orbitron_400Regular',
        fontSizeScale: 0.85,
        eraDisplayName: 'PLAYSTATION 2',
        footerText: 'POWER ON • PLAYSTATION 2',
        icons: {
            life: '❤️',
            streak: '🔥',
            currency: '💎',
        },
        buttonStyle: {
            backgroundColor: 'rgba(0, 20, 60, 0.7)',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'rgba(0, 204, 221, 0.5)',
            paddingVertical: 12,
            shadowColor: '#00CCDD',
            shadowOpacity: 0.6,
            shadowRadius: 12,
            elevation: 8,
        },
        cardStyle: {
            backgroundColor: 'rgba(15, 15, 30, 0.9)',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'rgba(0, 204, 221, 0.3)',
        },
        headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: 'transparent',
        },
        crtConfig: {
            scanlineOpacity: 0,
            vignetteOpacity: 0.04,
            flickerEnabled: false,
            chromaticAberration: true,
        }
    },
};

export const getEraForStreak = (streak: number): Era => {
    if (streak < 3) return 'atari';
    if (streak < 7) return 'gameboy';
    if (streak < 14) return 'nes';
    if (streak < 21) return 'master-system';
    if (streak < 30) return 'snes';
    if (streak < 45) return 'genesis';
    if (streak < 68) return 'ps1';
    if (streak < 90) return 'n64';
    return 'ps2';
};

// Helper to get the next era info for "NEXT EVOLUTION" display
export const getNextEraInfo = (streak: number): { name: string; streakRequired: number; daysAway: number } | null => {
    const thresholds: { era: Era; streak: number }[] = [
        { era: 'gameboy', streak: 3 },
        { era: 'nes', streak: 7 },
        { era: 'master-system', streak: 14 },
        { era: 'snes', streak: 21 },
        { era: 'genesis', streak: 30 },
        { era: 'ps1', streak: 45 },
        { era: 'n64', streak: 68 },
        { era: 'ps2', streak: 90 },
    ];

    for (const t of thresholds) {
        if (streak < t.streak) {
            return {
                name: ERAS[t.era].eraDisplayName,
                streakRequired: t.streak,
                daysAway: t.streak - streak,
            };
        }
    }
    return null; // Already at max era
};
