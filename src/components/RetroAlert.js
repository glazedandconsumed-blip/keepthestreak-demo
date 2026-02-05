import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PixelIcon from './PixelIcon';

export const RetroAlert = ({ visible, title, message, onConfirm, onCancel, confirmText, cancelText, theme, type = 'info' }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onConfirm}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: theme.background, borderColor: theme.accent, borderWidth: 4 }]}>

                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: theme.textSecondary }]}>
                        <PixelIcon name={type === 'achievement' ? 'trophy' : 'bit'} size={24} />
                        <Text style={[styles.modalTitle, { color: theme.accent, fontFamily: theme.fontFamily }]}>
                            {title}
                        </Text>
                        <PixelIcon name={type === 'achievement' ? 'trophy' : 'bit'} size={24} />
                    </View>

                    {/* Body */}
                    <Text style={[styles.modalText, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                        {message}
                    </Text>

                    {/* Footer / Buttons */}
                    <View style={styles.buttonContainer}>
                        {onCancel && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton, { borderColor: theme.textSecondary }]}
                                onPress={onCancel}
                            >
                                <Text style={[styles.textStyle, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>
                                    {cancelText || 'CANCEL'}
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[styles.button, theme.buttonStyle, onCancel && { marginLeft: 10 }]}
                            onPress={onConfirm}
                        >
                            <Text style={[styles.textStyle, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                                {type === 'achievement' ? 'AWESOME!' : (confirmText || 'GOT IT')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.7)', // Dim background
    },
    modalView: {
        margin: 20,
        width: '85%',
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: 15,
        borderBottomWidth: 2,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20, // Scaled down slightly to fit pixel fonts
        textAlign: "center",
        flex: 1,
    },
    modalText: {
        marginBottom: 25,
        textAlign: "center",
        fontSize: 16,
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        padding: 15,
        elevation: 2,
        minWidth: 120,
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: 'transparent',
    },
    textStyle: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    }
});

export default RetroAlert;
