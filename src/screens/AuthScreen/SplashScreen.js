import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Images from "../../constants/Image";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Check if it's the first time the app is being opened
    const checkFirstInstall = async () => {
      try {
        const firstInstall = await AsyncStorage.getItem("isFirstInstall");
        if (firstInstall === null) {
         
          // First time open, navigate to onboarding screen
          await AsyncStorage.setItem("isFirstInstall", "false");
          navigation.replace("OnboardingScreen"); // Navigate to Onboarding screen
        } else {
            console.log('first instal--------', firstInstall)
          // Not the first time, navigate to login screen
          navigation.replace("LoginScreen");
        }
      } catch (error) {
        console.error("Error checking first install:", error);
        navigation.replace("LoginScreen"); // Fallback in case of error
      }
    };

    // Call the check function
    checkFirstInstall();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* <ActivityIndicator size="large" color="#FF9900" /> */}
      {/* <Image source={Images.Applogo} style={styles.logo} /> */}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c161b",
  },
  loadingText: {
    fontSize: 18,
    color: "#FF9900",
    marginTop: 10,
    fontFamily: "Poppins-SemiBold",
  },
});
