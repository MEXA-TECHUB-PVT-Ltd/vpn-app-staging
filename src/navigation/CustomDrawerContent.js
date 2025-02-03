import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, Linking} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Images from '../constants/Image';
import {useIsFocused} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import  FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import COLORS from '../constants/COLORS';
const CustomDrawerContent = props => {
  const isFocused = useIsFocused();
  const [userDetail, setUserDetail] = useState(null);
  const [activeItem, setActiveItem] = useState('MainStackScreen');
  const handlePress = itemName => {
    setActiveItem(itemName);
    props.navigation.navigate(itemName);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            setUserDetail(userDoc.data());
          }
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [isFocused]);
  // console.log('userDetail--------in drawer', userDetail);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{flex: 1, paddingTop: 40}}>
      {/* Close Icon */}
      <View style={styles.closeIconContainer}>
        <Ionicons
          name="close"
          size={30}
          color="white"
          onPress={() => props.navigation.closeDrawer()}
        />
      </View>

      {/* User's Name */}
      <View style={styles.userInfoSection}>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.username}>
          {userDetail?.name || userDetail?.displayName || ''}{' '}
        </Text>
      </View>

      {/* Drawer Items */}
      <View style={styles.drawerItemsSection}>
        <DrawerItem
          label="Home"
         icon={() => (  <Ionicons
          name="home"
          size={22}
          color="white"
          onPress={() => props.navigation.closeDrawer()}
          />
          )}
          // icon={() => (
          //   <Image
          //     source={Images.home} // Path to your image
          //     style={{width: 24, height: 24}} // Adjust size according to your needs
          //     resizeMode="contain"
          //   />
          // )}
          onPress={() => handlePress('MainStackScreen')}
          // onPress={() => props.navigation.navigate("MainStackScreen")}
          labelStyle={styles.drawerLabel}
          style={[
            styles.drawerItem,
            activeItem === 'MainStackScreen' && styles.activeDrawerItem,
          ]}
        />

        <DrawerItem
          label="My Account"
          icon={() => (  <MaterialIcons
            name="account-circle"
            size={22}
            color="white"
            onPress={() => props.navigation.closeDrawer()}
            />
            )}
          // icon={() => (
          //   <Image
          //     source={Images.User} // Path to your image
          //     style={{width: 24, height: 24}} // Adjust size according to your needs
          //     resizeMode="contain"
          //   />
          // )}
          onPress={() => handlePress('MyAccount')}
          // onPress={() => props.navigation.navigate("MyAccount")}
          labelStyle={styles.drawerLabel}
          style={[
            styles.drawerItem,
            activeItem === 'MyAccount' && styles.activeDrawerItem,
          ]}
        />
        <DrawerItem
          label="Setting"
          icon={() => (  <Ionicons
            name="settings"
            size={22}
            color="white"
            onPress={() => props.navigation.closeDrawer()}
            />
            )}
          // icon={() => (
          //   <Image
          //     source={Images.Settings} // Path to your image
          //     style={{width: 24, height: 24}} // Adjust size according to your needs
          //     resizeMode="contain"
          //   />
          // )}
          onPress={() => handlePress('SettingStackNavigator')}
          // onPress={() => props.navigation.navigate("SettingStackNavigator")}
          labelStyle={styles.drawerLabel}
          style={[
            styles.drawerItem,
            activeItem === 'SettingStackNavigator' && styles.activeDrawerItem,
          ]}
        />
        <DrawerItem
          label="Help"
          icon={() => (  <Ionicons
            name="help-circle"
            size={22}
            color="white"
            onPress={() => props.navigation.closeDrawer()}
            />
            )}
          // icon={() => (
          //   <Image
          //     source={Images.QuestionCircle} 
          //     style={{width: 24, height: 24}} 
          //     resizeMode="contain"
          //   />
          // )}
          onPress={() => handlePress('Help')}
          // onPress={() => props.navigation.navigate("Help")}
          labelStyle={styles.drawerLabel}
          style={[
            styles.drawerItem,
            activeItem === 'Help' && styles.activeDrawerItem,
          ]}
        />
        <DrawerItem
          label="My Subscription"
          icon={() => (  <MaterialIcons
            name="subscriptions"
            size={22}
            color="white"
            onPress={() => props.navigation.closeDrawer()}
            />
            )}
          onPress={async () => {
            const url = 'https://play.google.com/store/account/subscriptions';
            try {
              const supported = await Linking.canOpenURL(url); // Check if the URL can be opened
              if (supported) {
                await Linking.openURL(url); // Open the URL
              } else {
                showMessage({
                  message: 'Unable to open subscriptions page.',
                  type: 'danger',
                });
              }
            } catch (error) {
              showMessage({
                message: 'Something went wrong.',
                type: 'danger',
              });
            }
          }}
          labelStyle={styles.drawerLabel}
          style={[
            styles.drawerItem,
            activeItem === 'MySubscription' && styles.activeDrawerItem,
          ]}
        />
      </View>

      {/* Get Premium Button */}
      <View style={styles.premiumButtonSection}>
        <TouchableOpacity
          style={styles.premiumButton}
          onPress={() =>
            props.navigation.navigate('MainStackScreen', {
              screen: 'GetPremiumScreen',
            })
          }>
              <FontAwesome5 name="crown" size={20} color={COLORS.primary} />
          {/* <Image
            source={Images.CrownLine} 
          /> */}
          <Text style={styles.premiumButtonText}>Go to Premium</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  closeIconContainer: {
    // marginTop: 20,
    marginLeft: 20,
    marginBottom: 60,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  username: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  drawerItemsSection: {
    flex: 1,
    paddingTop: 20,
  },
  drawerLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    paddingTop: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  drawerItem: {
    backgroundColor: 'transparent', 
    borderLeftWidth: 0, 
  },
  activeDrawerItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderLeftWidth: 4, 
    borderLeftColor: '#FFFFFF',
  },

  premiumButtonSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 35,
  },
  premiumButtonText: {
    color: COLORS.primary,
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
});

export default CustomDrawerContent;



////////////////////////


// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
// import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Images from '../constants/Image';
// import { useIsFocused } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';


// const CustomDrawerContent = (props) => {
//   const isFocused = useIsFocused();
//   const [userDetail, setUserDetail] = useState(null);
//   const [activeItem, setActiveItem] = useState('MainStack');

//   const handlePress = (itemName) => {
//     setActiveItem(itemName);
//     props.navigation.navigate(itemName);
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const user = auth().currentUser;
//         if (user) {
//           const userDoc = await firestore().collection('users').doc(user.uid).get();
//           if (userDoc.exists) {
//             setUserDetail(userDoc.data());
//           }
//         }
//       } catch (error) {
//         console.log('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, [isFocused]);

//   return (
//     <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, paddingTop: 40 }}>
//       <View style={styles.closeIconContainer}>
//         <Ionicons name="close" size={30} color="white" onPress={() => props.navigation.closeDrawer()} />
//       </View>
//       <View style={styles.userInfoSection}>
//         <Text style={styles.greeting}>Hello,</Text>
//         <Text style={styles.username}>{userDetail?.name || userDetail?.displayName || ''}</Text>
//       </View>
//       <View style={styles.drawerItemsSection}>
//         <DrawerItem
//           label="Home"
//           icon={() => <Ionicons name="home" size={22} color="white" />}
//           onPress={() => handlePress('MainStackScreen')}
//           labelStyle={styles.drawerLabel}
//           style={[styles.drawerItem, activeItem === 'MainStackScreen' && styles.activeDrawerItem]}
//         />
//         <DrawerItem
//           label="My Account"
//           icon={() => <MaterialIcons name="account-circle" size={22} color="white" />}
//           onPress={() => handlePress('MyAccount')}
//           labelStyle={styles.drawerLabel}
//           style={[styles.drawerItem, activeItem === 'MyAccount' && styles.activeDrawerItem]}
//         />
//         <DrawerItem
//           label="Settings"
//           icon={() => <Ionicons name="settings" size={22} color="white" />}
//           onPress={() => handlePress('SettingsScreen')}
//           labelStyle={styles.drawerLabel}
//           style={[styles.drawerItem, activeItem === 'SettingsScreen' && styles.activeDrawerItem]}
//         />
//         <DrawerItem
//           label="Help"
//           icon={() => <Ionicons name="help-circle" size={22} color="white" />}
//           onPress={() => handlePress('Help')}
//           labelStyle={styles.drawerLabel}
//           style={[styles.drawerItem, activeItem === 'Help' && styles.activeDrawerItem]}
//         />
//         <DrawerItem
//           label="My Subscription"
//           icon={() => <MaterialIcons name="subscriptions" size={22} color="white" />}
//           onPress={async () => {
//             const url = 'https://play.google.com/store/account/subscriptions';
//             try {
//               const supported = await Linking.canOpenURL(url);
//               if (supported) {
//                 await Linking.openURL(url);
//               }
//             } catch (error) {
//               console.log('Error opening URL:', error);
//             }
//           }}
//           labelStyle={styles.drawerLabel}
//           style={[styles.drawerItem, activeItem === 'MySubscription' && styles.activeDrawerItem]}
//         />
//       </View>
//       <View style={styles.premiumButtonSection}>
//         <TouchableOpacity
//           style={styles.premiumButton}
//           onPress={() => props.navigation.navigate('MainStack', { screen: 'GetPremiumScreen' })}>
//           <Image source={Images.CrownLine} />
//           <Text style={styles.premiumButtonText}>Go to Premium</Text>
//         </TouchableOpacity>
//       </View>
//     </DrawerContentScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   closeIconContainer: {
//     marginLeft: 20,
//     marginBottom: 60,
//   },
//   userInfoSection: {
//     paddingHorizontal: 20,
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   greeting: {
//     fontSize: 18,
//     color: '#FFFFFF',
//     fontFamily: 'Poppins-SemiBold',
//   },
//   username: {
//     fontSize: 20,
//     fontFamily: 'Poppins-Bold',
//     color: '#FFFFFF',
//   },
//   drawerItemsSection: {
//     flex: 1,
//     paddingTop: 20,
//   },
//   drawerLabel: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontFamily: 'Poppins-SemiBold',
//   },
//   drawerItem: {
//     backgroundColor: 'transparent',
//     borderLeftWidth: 0,
//   },
//   activeDrawerItem: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderLeftWidth: 4,
//     borderLeftColor: '#FFFFFF',
//   },
//   premiumButtonSection: {
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//     alignItems: 'center',
//   },
//   premiumButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 12,
//     borderRadius: 35,
//   },
//   premiumButtonText: {
//     color: '#ffcc00',
//     marginLeft: 10,
//     fontSize: 18,
//     fontFamily: 'Poppins-Bold',
//   },
// });

// export default CustomDrawerContent;