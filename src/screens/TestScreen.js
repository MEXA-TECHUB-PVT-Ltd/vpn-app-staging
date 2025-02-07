// // import React, { useState, useRef, useEffect } from "react";
// // import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// // import { Animated, Easing } from "react-native";

// // const TestScreen = () => {
// //   const [vpnState, setVpnState] = useState("disconnected"); // VPN state
// //   const [timer, setTimer] = useState(5); // Countdown timer
// //   const progress = useRef(new Animated.Value(0)).current;
// //   const animationRef = useRef(null);

// //   useEffect(() => {
// //     let countdownInterval;

// //     if (vpnState === "connecting") {
// //       // Start countdown when connecting
// //       countdownInterval = setInterval(() => {
// //         setTimer((prev) => {
// //           if (prev === 1) {
// //             clearInterval(countdownInterval);
// //             setVpnState("connected"); // Auto-connect after timer ends
// //           }
// //           return prev - 1;
// //         });
// //       }, 1000);
// //     } else {
// //       clearInterval(countdownInterval);
// //     }

// //     return () => clearInterval(countdownInterval);
// //   }, [vpnState]);

// //   useEffect(() => {
// //     if (vpnState === "connecting") {
// //       startAnimation();
// //     } else {
// //       stopAnimation();
// //     }
// //   }, [vpnState]);

// //   const startAnimation = () => {
// //     progress.setValue(0);
// //     animationRef.current = Animated.loop(
// //       Animated.timing(progress, {
// //         toValue: 1,
// //         duration: 2000, // Duration for one loop
// //         easing: Easing.linear,
// //         useNativeDriver: false,
// //       })
// //     );
// //     animationRef.current.start();
// //   };

// //   const stopAnimation = () => {
// //     if (animationRef.current) {
// //       animationRef.current.stop();
// //     }
// //     progress.setValue(0);
// //   };

// //   const handlePress = () => {
// //     if (vpnState === "disconnected") {
// //       setVpnState("connecting");
// //       setTimer(5); // Reset the timer
// //     } else if (vpnState === "connected") {
// //       setVpnState("disconnected");
// //     }
// //   };

// //   const animatedCircleColor = progress.interpolate({
// //     inputRange: [0, 0.5, 1],
// //     outputRange: ["#FFFFFF", "#00FF00", "#FFFF00"], // Half white, then green to yellow
// //   });

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.circleWrapper}>
// //         <Animated.View
// //           style={[
// //             styles.outerCircle,
// //             {
// //               borderColor:
// //                 vpnState === "connected" ? "#FFFF00" : animatedCircleColor,
// //             },
// //           ]}
// //         />
// //         <View style={styles.innerCircle}>
// //           <Text style={styles.timerText}>{vpnState === "connected" ? "✔" : timer}</Text>
// //         </View>
// //       </View>
// //       <TouchableOpacity style={styles.button} onPress={handlePress}>
// //         <Text style={styles.buttonText}>
// //           {vpnState === "connected" ? "Disconnect VPN" : "Connect VPN"}
// //         </Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "#1e1e1e",
// //   },
// //   circleWrapper: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   outerCircle: {
// //     position: "absolute",
// //     width: 200,
// //     height: 200,
// //     borderRadius: 100,
// //     borderWidth: 10,
// //   },
// //   innerCircle: {
// //     width: 150,
// //     height: 150,
// //     borderRadius: 75,
// //     backgroundColor: "#fff",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   timerText: {
// //     fontSize: 24,
// //     fontWeight: "bold",
// //     color: "#1e1e1e",
// //   },
// //   button: {
// //     marginTop: 40,
// //     paddingVertical: 15,
// //     paddingHorizontal: 30,
// //     backgroundColor: "#FFD700",
// //     borderRadius: 25,
// //   },
// //   buttonText: {
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     color: "#1e1e1e",
// //   },
// // });

// // export default TestScreen;


// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import * as Progress from 'react-native-progress';

// const TestScreen = () => {
//   const [vpnState, setVpnState] = useState("disconnected"); // VPN state
//   const [timer, setTimer] = useState(10); // Countdown timer
//   const [progress, setProgress] = useState(0); // Progress bar state

//   useEffect(() => {
//     let countdownInterval;

//     if (vpnState === "connecting") {
//       countdownInterval = setInterval(() => {
//         setTimer((prev) => {
//           if (prev === 1) {
//             clearInterval(countdownInterval);
//             setVpnState("connected"); // Auto-connect after timer ends
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     } else {
//       clearInterval(countdownInterval);
//     }

//     return () => clearInterval(countdownInterval);
//   }, [vpnState]);

//   // Progress bar logic that runs independently of the timer
//   useEffect(() => {
//     let progressInterval;

//     if (vpnState === "connecting" && progress < 1) {
//       progressInterval = setInterval(() => {
//         setProgress((prevProgress) => {
//           if (prevProgress < 1) {
//             return prevProgress + 0.1; // Increment the progress
//           }
//           return 1; // Stop at 100% progress
//         });
//       }, 1000);
//     } else {
//       clearInterval(progressInterval);
//     }

//     return () => clearInterval(progressInterval);
//   }, [vpnState, progress]);

//   const handlePress = () => {
//     if (vpnState === "disconnected") {
//       setVpnState("connecting");
//       setTimer(10); // Reset the timer to 10 seconds
//       setProgress(0); // Reset the progress bar
//     } else if (vpnState === "connected") {
//       setVpnState("disconnected");
//       setProgress(0); // Reset progress when disconnected
//     }
//   };

//   console.log('vpnState----------', vpnState)
//   return (
//     <View style={styles.container}>
//       <View style={styles.progressWrapper}>
//         <Progress.Circle
//           progress={progress}
//           size={200}
//           color={vpnState === "connected" ? "#00FF00" : "#FFD700"}
//           unfilledColor="#FFFFFF"
//           borderWidth={1}
//           borderColor="#000000"
//         />
//         <Text style={styles.timerText}>
//           {vpnState === "connected" ? "✔ Connected" : `Time Left: ${timer}s`}
//         </Text>
//       </View>
//       <TouchableOpacity style={styles.button} onPress={handlePress}>
//         <Text style={styles.buttonText}>
//           {vpnState === "connected" ? "Disconnect VPN" : "Connect VPN"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#1e1e1e",
//   },
//   progressWrapper: {
//     marginBottom: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   timerText: {
//     marginTop: 10,
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//   },
//   button: {
//     marginTop: 40,
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     backgroundColor: "#FFD700",
//     borderRadius: 25,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1e1e1e",
//   },
// });

// export default TestScreen;

///////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
// import { requestSubscription, getSubscriptions, initConnection, endConnection } from 'react-native-iap';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';
// import { showMessage } from 'react-native-flash-message';


// const productId = ['vpn_002_stealthlinkvpnapp'];
// const TestScreen = () => {
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [loading, setLoading] = useState(false);


//   useEffect(() => {
//     const initializeIAP = async () => {
//       try {
//         setLoading(true);
//         await initConnection(); // Initialize IAP connection
//         console.log('IAP connection established');

//         // Fetch available subscriptions
//         const availableSubscriptions = await getSubscriptions({ skus: productId });
// // console.log('Available Subscriptions:', availableSubscriptions);

//         // const availableSubscriptions = await getSubscriptions({ skus: [productId] });
//         const subscriptionList = [];
//         // console.log('IAP availableSubscriptions',availableSubscriptions);
//         // Map through subscriptions and extract offer details
//         availableSubscriptions.forEach(subscription => {
//           subscription.subscriptionOfferDetails.forEach(offerDetail => {
//             const pricingPhases =
//               offerDetail.pricingPhases?.pricingPhaseList?.map(phase => ({
//                 billingCycleCount: phase.billingCycleCount,
//                 billingPeriod: phase.billingPeriod,
//                 formattedPrice: phase.formattedPrice,
//                 priceAmountMicros: phase.priceAmountMicros,
//                 priceCurrencyCode: phase.priceCurrencyCode,
//                 recurrenceMode: phase.recurrenceMode,
//               }));

//             // Push subscription details with offer tokens and pricing phases into the list
//             subscriptionList.push({
//               title: subscription.title,
//               description: subscription.description,
//               productId: subscription.productId,
//               offerToken: offerDetail.offerToken, // Extract offerToken
//               basePlanId: offerDetail.basePlanId,
//               pricingPhases: pricingPhases || [],
//             });
//           });
//         });

//         setSubscriptions(subscriptionList); // Set the list of subscriptions with offer details
//       } catch (error) {
//         console.log('Error initializing IAP:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     initializeIAP();

//     return () => {
//       endConnection(); // Close IAP connection when unmounting
//     };
//   }, []); // Runs only once when the component mounts

//   // Calculate next payment date (assuming 1 month)
//   const calculateNextPaymentDate = () => {
//     const nextPayment = new Date();
//     nextPayment.setMonth(nextPayment.getMonth() + 1);
//     return nextPayment.toISOString();
//   };

//   // Handle subscription purchase
//   // const handleBuySubscription = async (offerToken) => {
//     const handleBuySubscription = async (productId, offerToken) => {
//     console.log('Selected Offer Token:', offerToken); // Log the offerToken for debugging

//     if (!offerToken) {
//       showMessage({ message: 'Offer token is required.', type: 'danger' });
//       return;
//     }

//     try {
//       await requestSubscription({
//         sku: productId,
//         subscriptionOffers: [{ sku: productId, offerToken }],
//       });

//       const user = auth().currentUser;
//       if (user) {

//         showMessage({ message: 'Subscription purchased successfully.', type: 'success' });
//       }
//     } catch (error) {
//       console.error('Purchase Error:', error);
//       let errorMessage = 'Something went wrong.';

//       if (error.message.includes('Google is indicating')) {
//         errorMessage = 'Google Play is having trouble processing the payment.';
//       } else if (error.message.includes('You already own this item.')) {
//         errorMessage = 'You already have an active subscription.';
//       } else if (error.message.includes('Payment is Cancelled.')) {
//         errorMessage = 'Payment was cancelled.';
//       } else {
//         errorMessage = error.message;
//       }

//       showMessage({ message: errorMessage, type: 'danger' });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Choose Your Subscription</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="blue" />
//       ) : subscriptions.length > 0 ? (
//         <FlatList
//           data={subscriptions}
//           keyExtractor={(item) => item.basePlanId}
//           renderItem={({ item }) => (
//             <View style={styles.subscriptionCard}>
//               <Text style={styles.planTitle}>{item.basePlanId}</Text>
          
//               {Array.isArray(item.pricingPhases) && item.pricingPhases.length > 0 ? (
//                 item.pricingPhases.map((phase, index) => (
//                   <View key={index} style={styles.priceContainer}>
//                     <Text style={styles.priceText}>Billing: {phase.billingPeriod}</Text>
//                     <Text style={styles.priceText}>
//                       Price: {phase.formattedPrice} ({phase.priceCurrencyCode})
//                     </Text>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.priceText}>No pricing information available.</Text>
//               )}
          
//               <TouchableOpacity
//                 style={styles.subscribeButton}
//                 // onPress={() => handleBuySubscription(item.offerToken)}
//                 onPress={() => handleBuySubscription(item.productId, item.offerToken)}
//               >
//                 <Text style={styles.buttonText}>Subscribe</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       ) : (
//         <Text style={styles.noSubscriptions}>No subscriptions available.</Text>
//       )}
//     </View>
//   );
// };

// export default TestScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#007bff',
//   },
//   subscriptionCard: {
//     backgroundColor: '#f8f9fa',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   planTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#333',
//   },
//   priceContainer: {
//     marginBottom: 10,
//   },
//   priceText: {
//     fontSize: 14,
//     color: '#555',
//   },
//   subscribeButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 12,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   noSubscriptions: {
//     fontSize: 16,
//     textAlign: 'center',
//     color: '#555',
//     marginTop: 20,
//   },
// });

////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { requestSubscription, getSubscriptions, initConnection, endConnection } from 'react-native-iap';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';

const productId = ['vpn_002_stealthlinkvpnapp'];

const TestScreen = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  useEffect(() => {
    const initializeIAP = async () => {
      try {
        setLoading(true);
        await initConnection();
        console.log('IAP connection established');

        const availableSubscriptions = await getSubscriptions({ skus: productId });
        const subscriptionList = [];

        availableSubscriptions.forEach(subscription => {
          subscription.subscriptionOfferDetails.forEach(offerDetail => {
            const pricingPhases = offerDetail.pricingPhases?.pricingPhaseList?.map(phase => ({
              billingCycleCount: phase.billingCycleCount,
              billingPeriod: phase.billingPeriod,
              formattedPrice: phase.formattedPrice,
              priceAmountMicros: phase.priceAmountMicros,
              priceCurrencyCode: phase.priceCurrencyCode,
              recurrenceMode: phase.recurrenceMode,
            }));

            subscriptionList.push({
              title: subscription.title,
              description: subscription.description,
              productId: subscription.productId,
              offerToken: offerDetail.offerToken,
              basePlanId: offerDetail.basePlanId,
              pricingPhases: pricingPhases || [],
            });
          });
        });

        setSubscriptions(subscriptionList);
      } catch (error) {
        console.log('Error initializing IAP:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeIAP();
    return () => {
      endConnection();
    };
  }, []);

  const handleBuySubscription = async (productId, offerToken) => {
    if (!offerToken) {
      showMessage({ message: 'Offer token is required.', type: 'danger' });
      return;
    }

    try {
      await requestSubscription({
        sku: productId,
        subscriptionOffers: [{ sku: productId, offerToken }],
      });

      showMessage({ message: 'Subscription purchased successfully.', type: 'success' });
      setCurrentSubscription(productId);
    } catch (error) {
      showMessage({ message: error.message || 'Subscription failed.', type: 'danger' });
    }
  };

  // const handleUpgradeDowngrade = async (newProductId, newOfferToken) => {
  //   if (!currentSubscription) {
  //     showMessage({ message: 'No active subscription found.', type: 'danger' });
  //     return;
  //   }

  //   try {
  //     await requestSubscription({
  //       sku: newProductId,
  //       subscriptionOffers: [{ sku: newProductId, offerToken: newOfferToken }],
  //       prorationMode: 2, // IMMEDIATE_WITHOUT_PRORATION (change this based on your needs)
  //     });
      
  //     showMessage({ message: 'Subscription changed successfully.', type: 'success' });
  //     setCurrentSubscription(newProductId);
  //   } catch (error) {
  //     showMessage({ message: error.message || 'Upgrade/Downgrade failed.', type: 'danger' });
  //   }
  // };

  const handleUpgradeDowngrade = async (productId, offerToken) => {
    console.log('Upgrading/Downgrading to:', productId, 'with offerToken:', offerToken);
  
    if (!offerToken) {
      showMessage({ message: 'Offer token is required for upgrade/downgrade.', type: 'danger' });
      return;
    }
  
    try {
      await requestSubscription({
        sku: productId,
        subscriptionOffers: [{ sku: productId, offerToken }],
        prorationMode: 1, // Immediate with charge prorated (adjust this based on your logic)
      });
  
      showMessage({ message: 'Subscription updated successfully.', type: 'success' });
    } catch (error) {
      console.error('Upgrade/Downgrade Error:', error);
      let errorMessage = 'Failed to update subscription.';
  
      if (error.message.includes('Google is indicating')) {
        errorMessage = 'Google Play is having trouble processing the change.';
      } else {
        errorMessage = error.message;
      }
  
      showMessage({ message: errorMessage, type: 'danger' });
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose Your Subscription bhai</Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : subscriptions.length > 0 ? (
        <FlatList
          data={subscriptions}
          keyExtractor={(item) => item.basePlanId}
          renderItem={({ item }) => (
            <View style={styles.subscriptionCard}>
              <Text style={styles.planTitle}>{item.basePlanId}</Text>
              {item.pricingPhases.map((phase, index) => (
                <View key={index} style={styles.priceContainer}>
                  <Text style={styles.priceText}>Billing: {phase.billingPeriod}</Text>
                  <Text style={styles.priceText}>Price: {phase.formattedPrice} ({phase.priceCurrencyCode})</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.subscribeButton} onPress={() => handleBuySubscription(item.productId, item.offerToken)}>
                <Text style={styles.buttonText}>Subscribe</Text>
              </TouchableOpacity>
        

              {/* {currentSubscription && currentSubscription.offerToken !== item.offerToken && ( */}
  <TouchableOpacity style={styles.upgradeButton} onPress={() => handleUpgradeDowngrade(item.productId, item.offerToken)}>
    <Text style={styles.buttonText}>Upgrade/Downgrade</Text>
  </TouchableOpacity>
{/* )} */}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noSubscriptions}>No subscriptions available.</Text>
      )}
    </View>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#007bff' },
  subscriptionCard: { backgroundColor: '#f8f9fa', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  planTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  priceContainer: { marginBottom: 10 },
  priceText: { fontSize: 14, color: '#555' },
  subscribeButton: { backgroundColor: '#007bff', paddingVertical: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  upgradeButton: { backgroundColor: '#28a745', paddingVertical: 12, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  noSubscriptions: { fontSize: 16, textAlign: 'center', color: '#555', marginTop: 20 },
});
