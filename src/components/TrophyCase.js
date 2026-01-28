import React from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import PixelIcon from './PixelIcon';

export const TrophyCase = ({ visible, onClose, unlockedItems, theme }) => {
    // Determine unlocked state for full list
    // Ideally passed from parent or store

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={[styles.modalView, { backgroundColor: theme.background, borderColor: theme.accent, borderWidth: 4 }]}>
                <View style={[styles.header, { borderBottomColor: theme.textSecondary }]}>
                    <Text style={[styles.modalTitle, { color: theme.accent, fontFamily: theme.fontFamily }]}>
                        ARTIFACTS DB
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{ fontSize: 24, color: theme.textSecondary }}>X</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.grid}>
                    {unlockedItems.map((item) => (
                        <View key={item.id} style={[styles.artifactCard, { borderColor: theme.textSecondary }]}>
                            <View style={styles.iconContainer}>
                                <Text style={{ fontSize: 32 }}>{item.icon}</Text>
                            </View>
                            <Text style={[styles.itemTitle, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                                {item.title}
                            </Text>
                            <Text style={[styles.itemYear, { color: theme.accent, fontFamily: theme.fontFamily }]}>
                                {item.year}
                            </Text>
                            <Text style={[styles.itemDesc, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                                {item.description}
                            </Text>
                        </View>
                    ))}
                    {unlockedItems.length === 0 && (
                        <Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                            NO ARTIFACTS RECOVERED
                        </Text>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        margin: 10,
        marginTop: 60,
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 15,
        borderBottomWidth: 2,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
    },
    grid: {
        paddingBottom: 20,
    },
    artifactCard: {
        marginBottom: 15,
        borderWidth: 2,
        borderRadius: 8,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 8,
    },
    itemTitle: {
        fontSize: 16,
        marginBottom: 4,
        textAlign: 'center',
    },
    itemYear: {
        fontSize: 12,
        marginBottom: 6,
    },
    itemDesc: {
        fontSize: 10,
        textAlign: 'center',
        lineHeight: 14,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        opacity: 0.6,
    }
});
