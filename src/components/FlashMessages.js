import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { height } from '../constants/Dimension';

const FlashMessages = ({ flashMessageData }) => {
  React.useEffect(() => {
    showMessage({
      message: flashMessageData.message,
      description: flashMessageData.description,
      type: flashMessageData.type,
      icon: {
        icon: flashMessageData.icon,
        position: 'left',
        color: flashMessageData.textColor,
      },

    });
  }, []);
  return <FlashMessage
    style={{
      backgroundColor: flashMessageData.backgroundColor,
      paddingTop: -height * 0.022,
      zIndex: 99999,

    }}
    titleStyle={{
      fontWeight: 'bold',
      color: flashMessageData.textColor,
      marginBottom: height * 0.01,
      fontSize: 20,
    }}
    textStyle={{
      fontWeight: 'bold',
      color: flashMessageData.textColor,
    }}


    position="top" />


};


export default FlashMessages;