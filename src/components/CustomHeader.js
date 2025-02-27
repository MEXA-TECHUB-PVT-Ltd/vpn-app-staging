import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';


const CustomHeader = ({ leftComponent, middleComponent, rightComponent,subscriptionComponent }) => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.leftContainer}>
                {leftComponent && leftComponent}
            </View>
            <View style={styles.middleContainer}>
                {middleComponent && middleComponent}
            </View>
            <View style={styles.SubscriptionContainer}>
                {subscriptionComponent && subscriptionComponent}
            </View>
            <View style={styles.rightContainer}>
                {rightComponent && rightComponent}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    middleContainer: {
        flex: 2.6,
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
});

export default CustomHeader;
