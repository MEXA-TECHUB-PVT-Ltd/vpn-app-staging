import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Animated, Easing } from "react-native";

const TestScreen = () => {
  const [vpnState, setVpnState] = useState("disconnected"); // VPN state
  const [timer, setTimer] = useState(5); // Countdown timer
  const progress = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    let countdownInterval;

    if (vpnState === "connecting") {
      // Start countdown when connecting
      countdownInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            setVpnState("connected"); // Auto-connect after timer ends
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(countdownInterval);
    }

    return () => clearInterval(countdownInterval);
  }, [vpnState]);

  useEffect(() => {
    if (vpnState === "connecting") {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [vpnState]);

  const startAnimation = () => {
    progress.setValue(0);
    animationRef.current = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000, // Duration for one loop
        easing: Easing.linear,
        useNativeDriver: false,
      })
    );
    animationRef.current.start();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    progress.setValue(0);
  };

  const handlePress = () => {
    if (vpnState === "disconnected") {
      setVpnState("connecting");
      setTimer(5); // Reset the timer
    } else if (vpnState === "connected") {
      setVpnState("disconnected");
    }
  };

  const animatedCircleColor = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#FFFFFF", "#00FF00", "#FFFF00"], // Half white, then green to yellow
  });

  return (
    <View style={styles.container}>
      <View style={styles.circleWrapper}>
        <Animated.View
          style={[
            styles.outerCircle,
            {
              borderColor:
                vpnState === "connected" ? "#FFFF00" : animatedCircleColor,
            },
          ]}
        />
        <View style={styles.innerCircle}>
          <Text style={styles.timerText}>{vpnState === "connected" ? "✔" : timer}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>
          {vpnState === "connected" ? "Disconnect VPN" : "Connect VPN"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
  },
  circleWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  outerCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
  },
  innerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e1e1e",
  },
  button: {
    marginTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#FFD700",
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e1e1e",
  },
});

export default TestScreen;
