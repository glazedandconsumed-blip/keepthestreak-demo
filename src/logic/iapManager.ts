import { Alert } from 'react-native';
import { useGameStore } from '../store/gameStore';

// Mock IAP Manager
// In the future, replace this with 'react-native-purchases' (RevenueCat) or 'expo-in-app-purchases'

class IAPManager {
    // Product IDs
    static PRO_BUNDLE_ID = 'com.keepthestreak.pro_bundle';

    private isProcessing = false;

    async purchasePro(): Promise<boolean> {
        if (this.isProcessing) return false;
        this.isProcessing = true;

        console.log('[IAPManager] Initiating purchase for:', IAPManager.PRO_BUNDLE_ID);

        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                // MOCK SUCCESS
                // In real app, you would validate receipt here
                const success = true;

                if (success) {
                    this.handlePurchaseSuccess(IAPManager.PRO_BUNDLE_ID);
                    resolve(true);
                } else {
                    Alert.alert("Purchase Failed", "Could not complete transaction.");
                    resolve(false);
                }
                this.isProcessing = false;
            }, 1500);
        });
    }

    async restorePurchases(): Promise<boolean> {
        if (this.isProcessing) return false;
        this.isProcessing = true;

        console.log('[IAPManager] Restoring purchases...');

        return new Promise((resolve) => {
            setTimeout(() => {
                // MOCK RESTORE
                // Check if user previously bought it
                // For now, let's just say "No previous purchases found" or explicitly unlock if testing
                const mockFound = false; // Set to true to test restore flow

                if (mockFound) {
                    this.handlePurchaseSuccess(IAPManager.PRO_BUNDLE_ID);
                    Alert.alert("Restore Successful", "Your Pro features have been restored.");
                    resolve(true);
                } else {
                    Alert.alert("Restore Complete", "No previous purchases found.");
                    resolve(false);
                }
                this.isProcessing = false;
            }, 1500);
        });
    }

    private handlePurchaseSuccess(productId: string) {
        if (productId === IAPManager.PRO_BUNDLE_ID) {
            // Unlock functionality in global store
            useGameStore.getState().unlockPro();
            console.log('[IAPManager] Pro Unlocked via Purchase');
        }
    }
}

export const iapManager = new IAPManager();
