import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text, Button} from 'react-native';
import CustomDrawerContent from './src/navigation/CustomDrawerContent';
import Animated from 'react-native-reanimated';
import LoginScreen from './src/screens/AuthScreen/LoginScreen';
import SignupScreen from './src/screens/AuthScreen/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import HelpDetailScreen from './src/screens/HelpDetailScreen';
import MyAccount from './src/screens/MyAccount';
import SettingsScreen from './src/screens/SettingsScreen';
import Help from './src/screens/Help';
import AboutApp from './src/screens/AboutApp';
import AboutScreen from './src/screens/AboutScreen';
import LocationSelectionScreen from './src/screens/LocationSelectionScreen';
import PrivacyPolicy from './src/screens/PrivacyPolicy';
import TermServices from './src/screens/TermServices';
import OnboardingScreen from './src/screens/Onboarding/OnboardingScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import ForgotPasswordScreen from './src/screens/AuthScreen/ForgotPasswordScreen';
import OTPVerificationScreen from './src/screens/AuthScreen/OTPVerificationScreen';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import GetPremiumScreen from './src/screens/GetPremiumScreen';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from './src/screens/AuthScreen/SplashScreen';
import TestScreen from './src/screens/TestScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

      // <application
      // android:networkSecurityConfig="@xml/network_security_config"
      // android:usesCleartextTraffic="true"


// Authentication Stack (Login, Signup, etc.)
// const AuthStack = createStackNavigator();

// "react-native-reanimated": "^3.16.3",
const AuthStack = createNativeStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator
    initialRouteName="SplashScreen"
    screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="SplashScreen" component={SplashScreen} />
    <AuthStack.Screen name="OnboardingScreen" component={OnboardingScreen} />
    <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
    <AuthStack.Screen name="SignupScreen" component={SignupScreen} />
    <AuthStack.Screen
      name="ForgotPasswordScreen"
      component={ForgotPasswordScreen}
    />
    <AuthStack.Screen
      name="OTPVerificationScreen"
      component={OTPVerificationScreen}
    />
    {/* <AuthStack.Screen name="MainDrawer" component={MainDrawer} /> */}
    <AuthStack.Screen name="TermServices" component={TermServices} />
    <AuthStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
  </AuthStack.Navigator>
);

// Main App Stack (Home, Details, etc.)
const MainStack = createNativeStackNavigator();
const MainStackScreen = () => (
  <MainStack.Navigator screenOptions={{headerShown: false}}>
    <MainStack.Screen name="HomeScreen" component={HomeScreen} />
    <MainStack.Screen name="AboutScreen" component={AboutScreen} />
    <MainStack.Screen
      name="LocationSelectionScreen"
      component={LocationSelectionScreen}
    />
    <MainStack.Screen name="GetPremiumScreen" component={GetPremiumScreen} />
  </MainStack.Navigator>
);

// Drawer Navigator (Main Stack + Drawer Items)
const Drawer = createDrawerNavigator();
const MainDrawer = () => (
  // <Drawer.Navigator>
  //  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
  <Drawer.Navigator
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: {
        backgroundColor: '#ffa500', // Gradient-like color similar to your image
        width: 300,
      },
      headerShown: false,
      drawerType: 'slide', // Drawer slides over the content
      overlayColor: 'transparent', // Transparent background during the slide
    }}>
    <Drawer.Screen name="MainStackScreen" component={MainStackScreen} />
    <Drawer.Screen name="MyAccount" component={MyAccount} />
    <Drawer.Screen
      name="SettingStackNavigator"
      component={SettingStackNavigator}
    />
    {/* <Drawer.Screen name="SettingsScreen" component={SettingsScreen} /> */}
    <Drawer.Screen name="Help" component={HelpStackNavigator} />
  </Drawer.Navigator>
);

const HelpStack = createNativeStackNavigator();

const HelpStackNavigator = () => {
  return (
    <HelpStack.Navigator initialRouteName="HelpScreen">
      <HelpStack.Screen
        name="HelpScreen"
        component={Help}
        options={{headerShown: false}} // Assuming you have a custom header
      />
      <HelpStack.Screen
        name="HelpDetailScreen"
        component={HelpDetailScreen}
        options={{headerShown: false}} // Custom header for HelpScreenDetails
      />
    </HelpStack.Navigator>
  );
};

const SettingStack = createNativeStackNavigator();
const SettingStackNavigator = () => {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{headerShown: false}} // Assuming you have a custom header
      />
      <SettingStack.Screen
        name="TestScreen"
        component={TestScreen}
        options={{headerShown: false}} // Assuming you have a custom header
      />
      <SettingStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{headerShown: false}} // Custom header for HelpScreenDetails
      />
      <SettingStack.Screen
        name="TermServices"
        component={TermServices}
        options={{headerShown: false}} // Custom header for HelpScreenDetails
      />
      <SettingStack.Screen
        name="AboutApp"
        component={AboutApp}
        options={{headerShown: false}} // Custom header for HelpScreenDetails
      />
      <SettingStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{headerShown: false}} // Custom header for HelpScreenDetails
      />
    </SettingStack.Navigator>
  );
};
// Main App Component
const App = () => {
  const isLoggedIn = true; // Change this for logged-in state

  GoogleSignin.configure({
    webClientId:
      '69377085199-1o9q6cmm27hb6l0810oujabd10mepn38.apps.googleusercontent.com',
  });

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        {user ? <MainDrawer /> : <AuthStackScreen />}
        <FlashMessage position="top" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;


// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import FlashMessage from 'react-native-flash-message';
// import auth from '@react-native-firebase/auth';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// import CustomDrawerContent from './src/navigation/CustomDrawerContent';
// import SplashScreen from './src/screens/AuthScreen/SplashScreen';
// import OnboardingScreen from './src/screens/Onboarding/OnboardingScreen';
// import LoginScreen from './src/screens/AuthScreen/LoginScreen';
// import SignupScreen from './src/screens/AuthScreen/SignupScreen';
// import ForgotPasswordScreen from './src/screens/AuthScreen/ForgotPasswordScreen';
// import OTPVerificationScreen from './src/screens/AuthScreen/OTPVerificationScreen';
// import TermServices from './src/screens/TermServices';
// import PrivacyPolicy from './src/screens/PrivacyPolicy';
// import HomeScreen from './src/screens/HomeScreen';
// import AboutScreen from './src/screens/AboutScreen';
// import LocationSelectionScreen from './src/screens/LocationSelectionScreen';
// import GetPremiumScreen from './src/screens/GetPremiumScreen';
// import MyAccount from './src/screens/MyAccount';
// import SettingsScreen from './src/screens/SettingsScreen';
// import Help from './src/screens/Help';
// import HelpDetailScreen from './src/screens/HelpDetailScreen';
// import AboutApp from './src/screens/AboutApp';
// import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
// import TestScreen from './src/screens/TestScreen';

// const AuthStack = createNativeStackNavigator();
// const AuthStackScreen = () => (
//   <AuthStack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
//     <AuthStack.Screen name="SplashScreen" component={SplashScreen} />
//     <AuthStack.Screen name="OnboardingScreen" component={OnboardingScreen} />
//     <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
//     <AuthStack.Screen name="SignupScreen" component={SignupScreen} />
//     <AuthStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
//     <AuthStack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen} />
//     <AuthStack.Screen name="TermServices" component={TermServices} />
//     <AuthStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
//   </AuthStack.Navigator>
// );

// const MainStack = createNativeStackNavigator();
// const MainStackScreen = () => (
//   <MainStack.Navigator screenOptions={{ headerShown: false }}>
//   <MainStack.Screen name="HomeScreen" component={HomeScreen} />
//   <MainStack.Screen name="AboutScreen" component={AboutScreen} />
//   <MainStack.Screen name="LocationSelectionScreen" component={LocationSelectionScreen} />
//   <MainStack.Screen name="GetPremiumScreen" component={GetPremiumScreen} />
//   <MainStack.Screen name="Help" component={Help} />
//   <MainStack.Screen name="HelpDetailScreen" component={HelpDetailScreen} />
//   <MainStack.Screen name="SettingsScreen" component={SettingsScreen} />
//   <MainStack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
//   <MainStack.Screen name="AboutApp" component={AboutApp} />
//   <MainStack.Screen name="TestScreen" component={TestScreen} />
//   <MainStack.Screen name="TermServices" component={TermServices} />
//   <MainStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
// </MainStack.Navigator>
// );

// const Drawer = createDrawerNavigator();
// const MainDrawer = () => (
//   <Drawer.Navigator
//     drawerContent={props => <CustomDrawerContent {...props} />}
//     screenOptions={{
//       drawerStyle: { backgroundColor: '#ffa500', width: 300 },
//       headerShown: false,
//       drawerType: 'slide',
//       overlayColor: 'transparent',
//     }}>
//     <Drawer.Screen name="MainStackScreen" component={MainStackScreen} />
//     <Drawer.Screen name="MyAccount" component={MyAccount} />
//     <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
//     <Drawer.Screen name="Help" component={Help} />
//   </Drawer.Navigator>
// );

// const App = () => {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState();

//   GoogleSignin.configure({
//     webClientId: '69377085199-1o9q6cmm27hb6l0810oujabd10mepn38.apps.googleusercontent.com',
//   });

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(user => {
//       setUser(user);
//       if (initializing) setInitializing(false);
//     });
//     return subscriber;
//   }, []);

//   if (initializing) return null;

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <NavigationContainer>
//         {user ? <MainDrawer /> : <AuthStackScreen />}
//         <FlashMessage position="top" />
//       </NavigationContainer>
//     </GestureHandlerRootView>
//   );
// };

// export default App;
