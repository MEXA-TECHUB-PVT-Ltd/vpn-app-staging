import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const iconLibraries = {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  EvilIcons,
  AntDesign,
  Feather,
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
};

const CustomIcon = ({ name, size = 24, color = 'black', type = 'Ionicons', style }) => {
  const IconComponent = iconLibraries[type];

  if (!IconComponent) {
    console.warn(`Icon type "${type}" is not supported.`);
    return null;
  }

  return <IconComponent name={name} size={size} color={color} style={style} />;
};

export default CustomIcon;
