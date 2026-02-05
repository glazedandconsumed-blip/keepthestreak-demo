import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Simple wrapper to unify Haptic calls
// We can add a "mute" toggle here later if needed

export const triggerHaptic = (type: 'impactLight' | 'impactMedium' | 'impactHeavy' | 'notificationSuccess' | 'notificationError' | 'selection') => {
    // Web doesn't support these native haptics usually, but we safeguard anyway
    if (Platform.OS === 'web') return;

    switch (type) {
        case 'impactLight':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
        case 'impactMedium':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
        case 'impactHeavy':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
        case 'notificationSuccess':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
        case 'notificationError':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
        case 'selection':
            Haptics.selectionAsync();
            break;
    }
};

export const HapticPatterns = {
    keypress: () => triggerHaptic('impactLight'),
    softKey: () => triggerHaptic('selection'),
    unlock: () => triggerHaptic('notificationSuccess'),
    error: () => triggerHaptic('notificationError'),
    doorOpen: () => triggerHaptic('impactMedium'), // Mechanical clunk
    glitch: () => triggerHaptic('impactHeavy'), // Jarring
    success: () => triggerHaptic('notificationSuccess'), // Added alias
};
