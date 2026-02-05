import { Audio } from 'expo-av';

// Map specific sound names to require() paths
// Since we don't have assets yet, these are placeholders.
// UNCOMMENT and fill path when you have files.
const SOUND_ASSETS: Record<string, any> = {
    // 'keypress': require('../../assets/sounds/key_press.wav'),
    // 'success': require('../../assets/sounds/success.wav'),
    // 'error': require('../../assets/sounds/error.wav'),
    // 'unlock': require('../../assets/sounds/unlock_fanfare.mp3'),
    // 'door': require('../../assets/sounds/door_servo.wav'),
};

export type SoundKey = keyof typeof SOUND_ASSETS;

class SoundManager {
    private sounds: Record<string, Audio.Sound> = {};
    private isMuted: boolean = false;

    async loadSounds() {
        try {
            // Preload all assets
            const loadPromises = Object.keys(SOUND_ASSETS).map(async (key) => {
                const { sound } = await Audio.Sound.createAsync(SOUND_ASSETS[key]);
                this.sounds[key] = sound;
            });
            await Promise.all(loadPromises);
        } catch (error) {
            console.warn('[SoundManager] Error loading sounds:', error);
        }
    }

    async play(soundName: string) {
        if (this.isMuted) return;

        const sound = this.sounds[soundName];
        if (sound) {
            try {
                await sound.replayAsync();
            } catch (error) {
                console.log(`[SoundManager] Error playing ${soundName}:`, error);
            }
        } else {
            console.log(`[SoundManager] Placeholder Play: ${soundName} (No Asset)`);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    async unloadAll() {
        try {
            const unloadPromises = Object.values(this.sounds).map(sound => sound.unloadAsync());
            await Promise.all(unloadPromises);
            this.sounds = {};
        } catch (error) {
            console.warn('[SoundManager] Error unloading sounds:', error);
        }
    }
}

export const soundManager = new SoundManager();
