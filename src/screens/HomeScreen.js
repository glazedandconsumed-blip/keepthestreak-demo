import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import DroidPixelArt from '../components/DroidPixelArt';
import { DROID_CHASSIS, getUnlockedDroids, getUnlockCountText } from '../data/droidData';
import { ERAS } from '../styles/themeEngine';
import { iapManager } from '../logic/iapManager';

export const HomeScreen = ({
    theme, era, streak, lives, credits, isPro,
    selectedDroid, onSelectDroid,
    onShowTrophies, onShowLeaderboard, onTimeAttack, onZenMode
}) => {
    const [showCollection, setShowCollection] = useState(false);
    const unlockedDroids = getUnlockedDroids(streak);
    const fs = theme.fontSizeScale;

    const handleUnlockPro = async () => {
        await iapManager.purchasePro();
    };

    const handleRestorePurchases = async () => {
        await iapManager.restorePurchases();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Title */}
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, {
                        color: theme.textPrimary,
                        fontFamily: theme.fontFamily,
                        fontSize: 22 * fs,
                    }]}>
                        MATH STREAK
                    </Text>
                    <Text style={[styles.title, {
                        color: theme.accent,
                        fontFamily: theme.fontFamily,
                        fontSize: 22 * fs,
                    }]}>
                        MECHANIC
                    </Text>
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 10 * fs,
                        marginTop: 8,
                        letterSpacing: 2,
                    }}>
                        {theme.eraDisplayName} ERA
                    </Text>
                </View>

                {/* Droid Selection Section */}
                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, {
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 10 * fs,
                    }]}>
                        SELECT MAINTENANCE DROID
                    </Text>
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 8 * fs,
                        opacity: 0.7,
                        marginTop: 4,
                        textAlign: 'center',
                    }}>
                        Your companion will evolve with the system
                    </Text>
                </View>

                {/* Droid Cards - Show only unlocked */}
                <View style={styles.droidList}>
                    {unlockedDroids.map(droidId => {
                        const droid = DROID_CHASSIS[droidId];
                        const isSelected = selectedDroid === droidId;

                        return (
                            <TouchableOpacity
                                key={droidId}
                                style={[
                                    styles.droidCard,
                                    theme.cardStyle,
                                    isSelected && {
                                        borderColor: theme.accent,
                                        borderWidth: (theme.cardStyle.borderWidth || 1) + 1,
                                    },
                                ]}
                                onPress={() => onSelectDroid(droidId)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.droidCardInner}>
                                    <DroidPixelArt
                                        droidId={droidId}
                                        theme={theme}
                                        size={56}
                                    />
                                    <View style={styles.droidInfo}>
                                        <Text style={{
                                            color: theme.textPrimary,
                                            fontFamily: theme.fontFamily,
                                            fontSize: 10 * fs,
                                            marginBottom: 4,
                                        }}>
                                            {droid.name}
                                        </Text>
                                        <Text style={{
                                            color: theme.textSecondary,
                                            fontFamily: theme.fontFamily,
                                            fontSize: 7 * fs,
                                            lineHeight: 12 * fs,
                                        }}>
                                            {droid.description}
                                        </Text>
                                        <View style={styles.traitRow}>
                                            {droid.traits.map(trait => (
                                                <View key={trait} style={[styles.traitBadge, {
                                                    borderColor: theme.accent,
                                                    borderWidth: theme.cardStyle.borderWidth || 1,
                                                    borderRadius: theme.cardStyle.borderRadius || 0,
                                                }]}>
                                                    <Text style={{
                                                        color: theme.accent,
                                                        fontFamily: theme.fontFamily,
                                                        fontSize: 5 * fs,
                                                    }}>
                                                        {trait}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                                {isSelected && (
                                    <View style={[styles.activeBadge, { backgroundColor: theme.accent }]}>
                                        <Text style={{
                                            color: theme.background,
                                            fontFamily: theme.fontFamily,
                                            fontSize: 5 * fs,
                                        }}>
                                            ACTIVE
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* View All Droids Button */}
                <TouchableOpacity
                    style={[styles.collectionButton, theme.buttonStyle]}
                    onPress={() => setShowCollection(true)}
                >
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 9 * fs,
                        textAlign: 'center',
                    }}>
                        ⊕ VIEW ALL DROIDS
                    </Text>
                    <Text style={{
                        color: theme.textSecondary,
                        fontFamily: theme.fontFamily,
                        fontSize: 7 * fs,
                        opacity: 0.6,
                        marginTop: 4,
                        textAlign: 'center',
                    }}>
                        {getUnlockCountText(streak)}
                    </Text>
                </TouchableOpacity>

                {/* Secondary Actions */}
                <View style={styles.secondaryActions}>
                    <TouchableOpacity
                        style={[styles.secondaryButton, theme.buttonStyle]}
                        onPress={onShowTrophies}
                    >
                        <Text style={{
                            color: theme.textPrimary,
                            fontFamily: theme.fontFamily,
                            fontSize: 9 * fs,
                        }}>
                            ARTIFACTS DB
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, theme.buttonStyle]}
                        onPress={onShowLeaderboard}
                    >
                        <Text style={{
                            color: theme.textPrimary,
                            fontFamily: theme.fontFamily,
                            fontSize: 9 * fs,
                        }}>
                            HIGH SCORES
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Pro Modes */}
                {!isPro && (
                    <View style={styles.proSection}>
                        <TouchableOpacity
                            onPress={handleUnlockPro}
                            style={[styles.proButton, {
                                borderColor: theme.accent,
                                backgroundColor: 'rgba(255,215,0,0.05)',
                                borderWidth: theme.cardStyle.borderWidth || 1,
                                borderRadius: theme.cardStyle.borderRadius || 0,
                            }]}
                        >
                            <Text style={{
                                color: theme.accent,
                                fontFamily: theme.fontFamily,
                                fontSize: 8 * fs,
                            }}>
                                UNLOCK PRO VERSION
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleRestorePurchases} style={{ marginTop: 8 }}>
                            <Text style={{
                                color: theme.textSecondary,
                                fontFamily: theme.fontFamily,
                                fontSize: 7 * fs,
                                textDecorationLine: 'underline',
                                opacity: 0.5,
                            }}>
                                Restore Purchases
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={{
                    color: theme.textSecondary,
                    fontFamily: theme.fontFamily,
                    fontSize: 7 * fs,
                    opacity: 0.5,
                }}>
                    ● {theme.footerText}
                </Text>
            </View>

            {/* Droid Collection Modal */}
            <DroidCollectionModal
                visible={showCollection}
                onClose={() => setShowCollection(false)}
                theme={theme}
                streak={streak}
                selectedDroid={selectedDroid}
                onSelectDroid={onSelectDroid}
            />
        </View>
    );
};

// ─── Inline Droid Collection Modal ───────────────────────────────────────
const DroidCollectionModal = ({ visible, onClose, theme, streak, selectedDroid, onSelectDroid }) => {
    const fs = theme.fontSizeScale;
    const allDroidIds = Object.keys(DROID_CHASSIS);
    const unlockedDroids = getUnlockedDroids(streak);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.85)' }]}>
                <View style={[styles.modalContent, {
                    backgroundColor: theme.background,
                    borderColor: theme.accent,
                    borderWidth: theme.cardStyle.borderWidth || 1,
                    borderRadius: theme.cardStyle.borderRadius || 0,
                }]}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <Text style={{
                            color: theme.textPrimary,
                            fontFamily: theme.fontFamily,
                            fontSize: 11 * fs,
                        }}>
                            DROID COLLECTION
                        </Text>
                        <Text style={{
                            color: theme.textSecondary,
                            fontFamily: theme.fontFamily,
                            fontSize: 7 * fs,
                            marginTop: 4,
                        }}>
                            Streak: {streak} • {getUnlockCountText(streak)}
                        </Text>
                    </View>

                    {/* Droid Grid */}
                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.droidGrid}>
                            {allDroidIds.map(droidId => {
                                const droid = DROID_CHASSIS[droidId];
                                const isUnlocked = unlockedDroids.includes(droidId);
                                const isActive = selectedDroid === droidId;

                                return (
                                    <TouchableOpacity
                                        key={droidId}
                                        style={[styles.gridCell, theme.cardStyle, {
                                            opacity: isUnlocked ? 1 : 0.5,
                                        }]}
                                        onPress={() => {
                                            if (isUnlocked) {
                                                onSelectDroid(droidId);
                                                onClose();
                                            }
                                        }}
                                        activeOpacity={isUnlocked ? 0.7 : 1}
                                        disabled={!isUnlocked}
                                    >
                                        <DroidPixelArt
                                            droidId={droidId}
                                            theme={theme}
                                            size={48}
                                            locked={!isUnlocked}
                                        />
                                        <Text style={{
                                            color: isUnlocked ? theme.textPrimary : theme.textSecondary,
                                            fontFamily: theme.fontFamily,
                                            fontSize: 6 * fs,
                                            textAlign: 'center',
                                            marginTop: 6,
                                        }} numberOfLines={2}>
                                            {isUnlocked ? droid.name : '???'}
                                        </Text>
                                        {isUnlocked ? (
                                            <Text style={{
                                                color: isActive ? theme.accent : theme.textSecondary,
                                                fontFamily: theme.fontFamily,
                                                fontSize: 5 * fs,
                                                marginTop: 2,
                                            }}>
                                                {isActive ? 'ACTIVE' : 'UNLOCKED ✓'}
                                            </Text>
                                        ) : (
                                            <Text style={{
                                                color: theme.textSecondary,
                                                fontFamily: theme.fontFamily,
                                                fontSize: 5 * fs,
                                                marginTop: 2,
                                                opacity: 0.6,
                                            }}>
                                                🔒 STREAK {droid.unlockStreak}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>

                    {/* Close Button */}
                    <TouchableOpacity
                        style={[styles.closeButton, theme.buttonStyle]}
                        onPress={onClose}
                    >
                        <Text style={{
                            color: theme.textPrimary,
                            fontFamily: theme.fontFamily,
                            fontSize: 9 * fs,
                        }}>
                            CLOSE
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        textAlign: 'center',
        lineHeight: 32,
    },
    sectionContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        letterSpacing: 2,
    },
    droidList: {
        width: '100%',
        maxWidth: 340,
        gap: 12,
        marginBottom: 16,
    },
    droidCard: {
        padding: 14,
        position: 'relative',
    },
    droidCardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    droidInfo: {
        flex: 1,
    },
    traitRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 6,
    },
    traitBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    activeBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    collectionButton: {
        width: '100%',
        maxWidth: 340,
        padding: 14,
        alignItems: 'center',
        marginBottom: 20,
    },
    secondaryActions: {
        width: '100%',
        maxWidth: 340,
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    secondaryButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
    },
    proSection: {
        alignItems: 'center',
        marginTop: 8,
        width: '100%',
        maxWidth: 340,
    },
    proButton: {
        width: '100%',
        padding: 12,
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 380,
        maxHeight: '85%',
        padding: 20,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    modalScroll: {
        flex: 1,
    },
    droidGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
    },
    gridCell: {
        width: '30%',
        minWidth: 95,
        padding: 10,
        alignItems: 'center',
    },
    closeButton: {
        marginTop: 16,
        padding: 12,
        alignItems: 'center',
    },
});
