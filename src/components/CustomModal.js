import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomModal = ({ visible, onClose, icon, Logout, image, title, description, onConfirm, onCancel }) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
             <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    {/* Icon or Image */}
                    {icon && <Icon name={icon} size={50} color="orange" style={styles.icon} />}
                    {Logout && <MaterialIcons name={Logout} size={50} color="orange" style={styles.icon} />}
                    {image && <Image source={image} style={styles.image} />}

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Description */}
                    <Text style={styles.description}>{description}</Text>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#424242',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    icon: {
        marginBottom: 15,
    },
    image: {
        width: 50,
        height: 50,
        marginBottom: 15,
    },
    title: {
        fontSize: 20,
        fontFamily: "Poppins-SemiBold",
        
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#888',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
        fontFamily: "Poppins-SemiBold",
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
    },
});

export default CustomModal;
