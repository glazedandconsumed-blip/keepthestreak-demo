import { Audio } from 'expo-av';

// Map specific sound names to require() paths
// Since we don't have assets yet, these are placeholders
const SOUND_ASSETS = {
    // 'keypress': require('../../assets/sounds/key_press.wav'),
    // 'success': require('../../assets/sounds/success.wav'),
    // 'error': require('../../assets/sounds/error.wav'),
    // 'unlock': require('../../assets/sounds/unlock_fanfare.mp3'),
    // 'door': require('../../assets/sounds/door_servo.wav'),
};

class SoundManager {
    sounds: Record<string, Audio.Sound> = {};

    async loadSounds() {
        // Preload sounds here if assets existed
    }

    async play(soundName: string) {
        // If we had assets:
        /*
        const source = SOUND_ASSETS[soundName];
        if (!source) return;
        
        try {
            const { sound } = await Audio.Sound.createAsync(source);
            await sound.playAsync();
            // Cleanup after play (or keep loaded for efficiency if commonly used)
        } catch (error) {
            console.log("Error playing sound:", error);
        }
        */
        console.log(`[SoundManager] Paying sound: ${soundName}`);
    }
}

export const soundManager = new SoundManager();
