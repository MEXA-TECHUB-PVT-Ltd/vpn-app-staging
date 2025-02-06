import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Modal,
  Animated,
  Easing,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';
import CountryFlag from 'react-native-country-flag';
import CustomModal from '../components/CustomModal';
import Images from '../constants/Image';
import {
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter,
} from 'react-native';
const {VpnServiceModule, MainActivity} = NativeModules;
import {Buffer} from 'buffer'; // Make sure to install buffer with `npm install buffer`
import CustomSnackbar from '../components/CustomSnackbar';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  requestSubscription,
  getSubscriptions,
  initConnection,
  purchaseUpdatedListener,
  purchaseErrorListener,
  endConnection,
  requestPurchase,
  getProducts,
  finishTransaction,
  getPurchaseHistory,
  getAvailablePurchases,
} from 'react-native-iap';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
const decodeBase64 = base64String => {
  const buffer = Buffer.from(base64String, 'base64');
  return buffer.toString('utf-8');
};
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/COLORS';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const productId = ['vpn_002_stealthlinkvpnapp'];
// const productId = 'vpn_001_test';

const HomeScreen = ({route}) => {
  // const locationselect =  route.params
  const [isConnected, setIsConnected] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [location, setLocation] = useState(null);

  const [vpnState, setVpnState] = useState('disconnected');
  const [vpnList, setVpnList] = useState([]);
  const [selectedVpn, setSelectedVpn] = useState(null);
  const [vpnStatus, setVpnStatus] = useState('');
  const [snackbarVisible, setsnackbarVisible] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [byteIn, setByteIn] = useState(0);
  const [byteOut, setByteOut] = useState(0);
  const [ConnectText, setConnectText] = useState('');
  useEffect(() => {
    // Initialize VPNs
    initVpn();
    const vpnStateListener = DeviceEventEmitter.addListener(
      'VpnStage',
      stage => {
        setVpnState(stage.stage.toLowerCase());
      },
    );
    const vpnStatusSubscription = DeviceEventEmitter.addListener(
      'VpnStatus',
      event => {
        setByteIn(event.byte_in || 0);
        setByteOut(event.byte_out || 0);
      },
    );

    return () => {
      vpnStateListener.remove();
      vpnStatusSubscription.remove();
    };
  }, []);

  const initVpn = async () => {
    const vpnList = [
      {
        country: 'Japan',
        username: 'vpn',
        password: 'vpn',
        // config: await fetchConfigFile('japan.ovpn'),
      },
      // {
      //   country: 'Thailand',
      //   username: 'vpn',
      //   password: 'vpn',
      //   config: await fetchConfigFile(),
      // },
    ];
    setVpnList(vpnList);
  };

  const [connectionTime, setConnectionTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const handleVpnState = async () => {
      if (vpnState === 'connected') {
        setIsTimerRunning(true);
        if (selectedVpn) {
          await storeVpnData(selectedVpn); // Store VPN data once when connected
        }
      } else {
        setIsTimerRunning(false);
        setConnectionTime(0); // Reset time when disconnected
        // Remove VPN data when disconnected
      }
    };

    handleVpnState(); // Execute the logic when vpnState changes
  }, [vpnState, selectedVpn]);

  // useEffect(() => {
  //   let timer; // Variable to hold the timer reference
  //   let startTime = Date.now(); // Track the start time of the timer

  //   if (vpnState === "connected") {
  //     // Start the timer when VPN is connected
  //     timer = BackgroundTimer.runBackgroundTimer(() => {
  //       const now = Date.now();
  //       const elapsedSeconds = Math.floor((now - startTime) / 1000); // Calculate elapsed time in seconds
  //       setConnectionTime(elapsedSeconds); // Update connection time
  //     }, 1000); // Run every second
  //   } else if (vpnState === "disconnected") {
  //     // Stop the timer when VPN is disconnected
  //     BackgroundTimer.stopBackgroundTimer();
  //     setConnectionTime(0); // Reset connection time
  //     startTime = Date.now(); // Reset start time
  //   }

  //   // Cleanup function to stop the timer when the component unmounts or vpnState changes
  //   return () => {
  //     BackgroundTimer.stopBackgroundTimer();
  //   };
  // }, [vpnState]);
  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      // Increment connection time every second
      timer = setInterval(() => {
        setConnectionTime(prevTime => prevTime + 1);
      }, 1000);
    }

    // Clean up timer on component unmount or when timer stops
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  // Convert connectionTime to hours, minutes, seconds
  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(secs).padStart(2, '0')}`;
  };

  // ////////////////////// subscription on 30-1-2025

  const isfucsed = useIsFocused();
  const purchaseUpdateSubscription = useRef(null);
  const purchaseErrorSubscription = useRef(null);
  const refRBSheet = useRef();
  const RenewrefRBSheet = useRef();
  const [RenewmodalVisible, setReNewModalVisible] = useState(false);
  const [purchasedNumbers, setPurchasedNumbers] = useState([]);
  const [Stripesubscriptions, setStripeSubscriptions] = useState([]);
  const [flashMessageData, setFlashMessageData] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [autoRenewalInfo, setAutoRenewalInfo] = useState(null);
  const [substatus, setSubscriptionStatus] = useState('');
  const [SubscriptionStatusMessage, setSubscriptionStatusMessage] =
    useState('');
  const [purchasedNumbersWithStatus, setPurchasedNumbersWithStatus] = useState(
    [],
  );
  const [activeProductId, setActiveProductId] = useState(null);
  useEffect(() => {
    purchaseUpdateSubscription.current =
      purchaseUpdatedListener(handlePurchaseUpdate);
    purchaseErrorSubscription.current =
      purchaseErrorListener(handlePurchaseError);

    return () => {
      if (purchaseUpdateSubscription.current) {
        purchaseUpdateSubscription.current.remove();
        purchaseUpdateSubscription.current = null;
      }

      if (purchaseErrorSubscription.current) {
        purchaseErrorSubscription.current.remove();
        purchaseErrorSubscription.current = null;
      }
    };
  }, []);

  const handlePurchaseError = error => {
    // console.warn('purchaseErrorListener', error);

    // Check if the error is related to the payment being cancelled
    if (error.code === 'E_USER_CANCELLED') {
      showMessage({
        message: 'Payment Cancelled',
        type: 'info',
      });
    } else if (error.code === 'E_USER_ERROR') {
      showMessage({
        message: 'An error occurred during the purchase',
        type: 'danger',
      });
    } else {
      showMessage({
        message: 'Something went wrong with the purchase.',
        type: 'danger',
      });
    }
  };

  const handlePurchaseUpdate = async purchase => {
    const receipt = purchase.transactionReceipt;
  };

  useEffect(() => {
    const initializeIAP = async () => {
      try {
        await initConnection();
        console.log('IAP initialized');

        // Fetch available subscriptions
        // const availableSubscriptions = await getSubscriptions({
        //   skus: [productId],
        // });
        const availableSubscriptions = await getSubscriptions({ skus: productId });
        const subscriptionList = [];

        // Map through subscriptions and extract offer details
        availableSubscriptions.forEach(subscription => {
          subscription.subscriptionOfferDetails.forEach(offerDetail => {
            const pricingPhases =
              offerDetail.pricingPhases?.pricingPhaseList?.map(phase => ({
                billingCycleCount: phase.billingCycleCount,
                billingPeriod: phase.billingPeriod,
                formattedPrice: phase.formattedPrice,
                priceAmountMicros: phase.priceAmountMicros,
                priceCurrencyCode: phase.priceCurrencyCode,
                recurrenceMode: phase.recurrenceMode,
              }));

            // Push subscription details with offer tokens and pricing phases into the list
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

        setSubscriptions(subscriptionList); // Update state with extracted subscription data
      } catch (error) {
        console.log('Error initializing IAP:', error);
      }
    };

    initializeIAP();
  }, []);

  const restoreSubscription = async () => {
    try {
      const availablePurchases = await getAvailablePurchases();
      console.log('Available purchases:', availablePurchases);

      const activeSubscription = availablePurchases.find(purchase =>
        purchase.productId.includes('subscription'),
      );
      // Check for the active subscription
    // const activeSubscription = availablePurchases.find(purchase =>
    //   purchase.productId === 'vpn_002_stealthlinkvpnapp', // Replace with your actual product ID
    // );


      if (activeSubscription) {
        console.log('Restored subscription:', activeSubscription.productId);
        setSubscriptionStatus('active');
        setActiveProductId(activeSubscription.productId);
        setSubscriptionStatusMessage('Subscription restored');
      } else {
        console.log('No subscription to restore.');
        setSubscriptionStatusMessage('No subscription to restore.');
        // Alert.alert('Info', 'No subscription to restore.');
      }
    } catch (error) {
      console.log('Error restoring subscription:', error);
      // showMessage({
      //   message: 'Failed to restore subscription. Please try again later.',
      //   type: 'Info',
      // });
    }
  };

  // const restoreSubscription = async () => {
  //   try {
  //     // Step 1: Fetch the current user
  //     const user = auth().currentUser;
  //     if (!user) {
  //       console.log('No user logged in');
  //       return;
  //     }
  
  //     // Step 2: Get the user document from Firestore
  //     const userDocRef = firestore().collection('users').doc(user.uid);
  //     const userDoc = await userDocRef.get();
  
  //     if (!userDoc.exists) {
  //       console.log('User data not found in Firestore');
  //       return;
  //     }
  
  //     // Step 3: Get the subscriptions array from Firestore
  //     const subscriptions = userDoc.data()?.subscriptions || [];
  //     console.log('Subscriptions from Firestore:', subscriptions);
  
  //     // Step 4: Look for the subscription with the correct productId and purchaseToken
  //     let storedPurchaseToken = null;
  //     let storedSubscription = null;
  
  //     // Loop through each subscription and find the one with the productId you're looking for
  //     for (let sub of subscriptions) {
  //       if (sub.productId === 'vpn_002_stealthlinkvpnapp') {
  //         storedPurchaseToken = sub.purchaseToken || null;
  //         storedSubscription = sub;
  //         break; // Exit once we find the correct subscription
  //       }
  //     }
  
  //     if (!storedPurchaseToken) {
  //       console.log('No purchaseToken found for the productId in Firestore');
  //       Alert.alert('No subscription found to restore.');
  //       return;
  //     }
  
  //     console.log('Stored purchaseToken from Firestore:', storedPurchaseToken);
  
  //     // Step 5: Get available purchases from the store
  //     const availablePurchases = await getAvailablePurchases();
  //     console.log('Available purchases:', availablePurchases);
  
  //     // Step 6: Match the stored purchaseToken with the available purchases
  //     const restoredSubscription = availablePurchases.find(purchase =>
  //       purchase.purchaseToken === storedPurchaseToken
  //     );
  
  //     if (restoredSubscription) {
  //       console.log('Restored subscription:', restoredSubscription.productId);
  //       // Set the restored subscription state
  //       setSubscriptionStatus('active');
  //       setActiveProductId(restoredSubscription.productId);
  //       setSubscriptionStatusMessage('Subscription restored');
  //       Alert.alert('Subscription Restored', 'Your subscription has been successfully restored!');
  //     } else {
  //       console.log('No matching subscription found to restore.');
  //       setSubscriptionStatusMessage('No matching subscription found to restore.');
  //       Alert.alert('No Matching Subscription', 'We could not find a matching subscription to restore.');
  //     }
  //   } catch (error) {
  //     console.log('Error restoring subscription:', error);
  //     Alert.alert('Error', 'Failed to restore subscription. Please try again later.');
  //   }
  // };
  
  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const activeSubscriptions = await getAvailablePurchases();
      // console.log('Active subscriptions:', activeSubscriptions);

      // Check if any subscription is active
      const activeSubscription = activeSubscriptions.find(
        subscription => subscription.productId === productId,
      );

      if (activeSubscription) {
        console.log(
          'Subscription is active for product:',
          activeSubscription.productId,
        );

        // Extract auto-renewal details
        const autoRenewing = activeSubscription.autoRenewingAndroid;
        const expiryTime = activeSubscription.expirationDateAndroid;

        setAutoRenewalInfo({
          autoRenewing,
          expiryDate: new Date(Number(expiryTime)),
        });

        setSubscriptionStatus('active');
        // setActiveProductId(activeSubscription.productId);
      } else {
        // console.log('No active subscription found');
        setSubscriptionStatus('inactive');
        setAutoRenewalInfo(null);

        // Optionally update subscription status in Firestore
        // await updateSubscriptionStatusInFirestore('inactive');
      }
    } catch (error) {
      // console.error('Error checking subscription status:', error);
      console.log('Error checking subscription status:', error);
    }
  }, [productId]); // Dependency array ensures the callback updates when `productId` changes

  useEffect(() => {
    checkSubscriptionStatus();
  }, [isfucsed, productId]);

  const calculateNextPaymentDate = () => {
    // Example: Add one month to the current date for the next payment date
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    return nextPaymentDate;
  };

  // const handleBuySubscription = async offerToken => {
    const handleBuySubscription = async (productId, offerToken) => {
    setReNewModalVisible(false);
    console.log('selectedOfferToken', offerToken);
    if (!offerToken) {
      console.log('Offer token is required for purchasing the subscription');
      return;
    }
    try {
      const response =  await requestSubscription({
        sku: productId,
        subscriptionOffers: [
          {
            sku: productId,
            offerToken: offerToken,
          },
        ],
      });

      // Extracting the required fields from the response
    const subscriptionDetails = response[0];
    const purchaseToken = subscriptionDetails.purchaseToken;
    const autoRenewingAndroid = subscriptionDetails.autoRenewingAndroid;
    const signatureAndroid = subscriptionDetails.signatureAndroid;

      // Step 2: Get the current user
      const user = auth().currentUser;
      if (user) {
        // Step 3: Prepare subscription details
        const subscriptionDetails = {
          productId,
          offerToken,
          userId: user.uid,
          startDate: new Date(),
          nextPaymentDate: calculateNextPaymentDate(),
          endDate: calculateNextPaymentDate(),
          status: 'active',
          purchaseToken: purchaseToken, // Save the purchaseToken
          autoRenewingAndroid: autoRenewingAndroid, // Save autoRenewingAndroid
          signatureAndroid: signatureAndroid, // Save signatureAndroid
        };
        // Step 4: Save subscription details to Firestore
        const userDocRef = firestore().collection('users').doc(user.uid);
        await userDocRef.update({
          subscriptions: firestore.FieldValue.arrayUnion(subscriptionDetails),
        });
        setSubscriptionStatus('active');
        setReNewModalVisible(false);
        // Close the sheet first
        refRBSheet.current.close();

        showMessage({
          message: 'Subscription purchased successfully.',
          type: 'success',
        });
        setSubscriptionStatusMessage('');
        // Show success message after 3 seconds
        // setTimeout(() => {
        //   setFlashMessageData({
        //     message: 'Success',
        //     description: 'Subscription purchased successfully.',
        //     type: 'success',
        //     icon: 'check-circle',
        //     textColor: COLORS.white,
        //     backgroundColor: COLORS.successGreen,
        //   });
        // }, 1000);
        console.log('Subscription purchase initiated');
      }
    } catch (error) {
      console.log('Purchase Error:', error);
      setReNewModalVisible(false);
      // Close the sheet first
      refRBSheet.current.close();
      setSubscriptionStatusMessage('');
      // Error Handling

      if (
        error.message.includes(
          'Google is indicating that we have some issue connecting to payment.',
        )
      ) {
        showMessage({
          message:
            'Google is indicating that we have some issue connecting to payment.',
          type: 'danger',
        });
      } else if (error.message.includes('You already own this item.')) {
        showMessage({
          message: 'You already own this item.',
          type: 'info',
        });
      } else if (error.message.includes('Payment is Cancelled.')) {
        showMessage({
          message: 'Payment Cancelled.',
          type: 'info',
        });
      } else {
        showMessage({
          message: error.message || 'Something went wrong.',
          type: 'danger',
        });
      }
    }
  };

  const renderSubscriptionPlan = ({item}) => {
    // console.log('subscription------------', item);
    const isSubscribed = item.productId === activeProductId;

    return (
      <View style={styles.subscriptionPlan}>
        <Text style={styles.subscriptionTitle}>{item.title}</Text>
        <Text style={styles.subscriptionDescription}>{item.description}</Text>
        {/* <Text style={styles.subscriptionDetail}>
          Base Plan ID: {item.basePlanId}
        </Text> */}

        {item.pricingPhases?.length > 0 && (
          <View style={styles.pricingDetails}>
            <Text style={styles.pricingTitle}>Pricing Details:</Text>
            {item.pricingPhases.map((phase, index) => (
              <View key={index} style={{marginTop: 5}}>
                <Text style={styles.pricingText}>
                  Billing Period: {phase.billingPeriod}
                </Text>
                <Text style={styles.pricingText}>
                  Formatted Price: {phase.formattedPrice}
                </Text>
                <Text style={styles.pricingText}>
                  Currency: {phase.priceCurrencyCode}
                </Text>
                {/* <Text style={styles.pricingText}>
                  Billing Cycles: {phase.billingCycleCount || 'Unlimited'}
                </Text> */}
              </View>
            ))}
          </View>
        )}

        {isSubscribed ? (
          <>
            <Text style={styles.subscribedText}>Already Subscribed</Text>
            <TouchableOpacity
              // onPress={() => handleBuySubscription(item.offerToken)}
              onPress={() => handleBuySubscription(item.productId, item.offerToken)}

              style={styles.button}>
              <Text style={styles.buttonText}>Cancel Subscription</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            // onPress={() => handleBuySubscription(item.offerToken)}
            onPress={() => handleBuySubscription(item.productId, item.offerToken)}

            style={styles.button}>
            <Text style={styles.buttonText}>Subscribe</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  // ye final and working modal hai
  // const startVpn = async () => {
  //   if (selectedVpn == null) return;
  //   const config = decodeBase64(selectedVpn.OpenVPN_ConfigData_Base64);
  //   console.log("-----------", config);
  //   // if (selectedVpn) {
  //   if (vpnState === "disconnected") {
  //     VpnServiceModule.startVpn(
  //       config,
  //       selectedVpn.CountryLong,
  //       // 'japan',
  //       "vpn",
  //       "vpn",
  //       null,
  //       null

  //     );
  //   } else {
  //     VpnServiceModule.stopVpn();
  //     setVpnState("disconnected");
  //     setVpnStatus("Disconnected from VPN");
  //   }
  // };

  const startVpn = async () => {
    if (substatus === 'active') {
      setReNewModalVisible(false);
    } else {
      setReNewModalVisible(true);
      return; // Exit function if substatus is not active
    }
    if (!selectedVpn) return;
    // Use configdatafile directly if available, otherwise decode the Base64 encoded config data
    const config = selectedVpn.configdatafile
      ? selectedVpn.configdatafile // Use directly if configdatafile is present
      : decodeBase64(selectedVpn.OpenVPN_ConfigData_Base64); // Decode the Base64 string if configdatafile isn't present

    if (vpnState === 'disconnected') {
      VpnServiceModule.startVpn(
        config, // Pass the config (either directly or decoded)
        selectedVpn.CountryLong,
        'vpn',
        'vpn',
        null,
        null,
      );
    } else {
      VpnServiceModule.stopVpn();
      setVpnState('disconnected');
      setVpnStatus('Disconnected from VPN');
    }
  };

  const handleConnectionToggle = () => {
    if (substatus === 'active') {
      setReNewModalVisible(false);
    } else {
      setReNewModalVisible(true);
      return; // Exit function if substatus is not active
    }
    if (isConnected) {
      // Show the modal to confirm disconnection
      setModalVisible(true);
    } else {
      // If not connected, directly connect with animation
      startConnectionAnimation();
    }
  };

  const startConnectionAnimation = () => {
    Animated.timing(progress, {
      toValue: 2,
      duration: 9000, // Animation duration
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setIsConnected(true); // Set connected state after animation
    });
  };

  const handleDisconnect = () => {
    startVpn();
    setIsConnected(false);
    progress.setValue(0); // Reset animation if disconnected
    setModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const dismissSnackbar = () => {
    setsnackbarVisible(false);
  };
  const handleUpdatePassword = async () => {
    setsnackbarVisible(true);
    setTimeout(() => {
      setsnackbarVisible(false);
    }, 3000);
  };

  // Function to store selected VPN in AsyncStorage
  const storeVpnData = async vpnData => {
    try {
      await AsyncStorage.setItem('selectedVpndata', JSON.stringify(vpnData));
      console.log('VPN data stored successfully');
    } catch (error) {
      console.log('Error storing VPN data', error);
    }
  };

  // Function to remove selected VPN from AsyncStorage
  const getStoredVpnData = async () => {
    try {
      const storedVpn = await AsyncStorage.getItem('selectedVpndata');
      if (storedVpn !== null) {
        console.log('VPN data retrieved successfully');
      }
    } catch (error) {
      console.log('Error retrieving VPN data', error);
    }
  };

  // Call the getStoredVpnData inside useEffect to load stored VPN on component mount
  useEffect(() => {
    // Check if byteIn has a value and handleUpdatePassword has not been called yet
    if (byteIn.length > 0 && !isPasswordUpdated) {
      handleUpdatePassword();
      getStoredVpnData();
      setIsPasswordUpdated(true); // Prevent further calls to handleUpdatePassword
    }
  }, [byteIn, isPasswordUpdated]);

  useEffect(() => {
    // Check if byteIn has a value and handleUpdatePassword has not been called yet
    if (vpnState === 'disconnected') {
      setConnectText('');
    } else if (
      vpnState === 'prepare' ||
      vpnState === 'connecting' ||
      vpnState === 'noprocess' ||
      vpnState === 'vpn_generate_config' ||
      vpnState === 'tcp_connect' ||
      vpnState === 'wait' ||
      vpnState === 'auth'
    ) {
      setConnectText('Connecting');
    } else if (vpnState === 'get_config') {
      setConnectText('trying...');
    } else if (vpnState === 'assign_ip') {
      setConnectText('Poor Connection');
    } else {
      setConnectText('Connected');
    }
  }, [vpnState]);

  const animatedOuterCircle = {
    borderColor: progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255, 255, 255, 0.2)', '#DBD6CE'],
    }),
    transform: [
      {
        rotate: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  const animatedInnerCircle = {
    borderColor: progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255, 255, 255, 0.5)', '#fcdb03'],
      // outputRange: ['rgba(255, 255, 255, 0.5)', '#6D6C69'],
    }),
  };

  React.useEffect(() => {
    const setStaticData = async () => {
      const configData = await fetchConfigFile();

      setLocation({
        CountryLong: 'Japan',
        region: 'Ibaraki',
        location: 'JP',
        signalStrength: 4,
        Speed: '158790109',
        CountryShort: 'JP',
        IP: '219.100.37.178',
      });

      setSelectedVpn({
        CountryLong: 'Japan',
        region: 'Ibaraki',
        location: 'JP',
        signalStrength: 43,
        CountryShort: 'JP',
        Speed: '158790109',
        IP: '219.100.37.178',
        configdatafile: configData, // Using the fetched config data
      });
    };

    if (route.params?.selectedVpn) {
      setLocation(route.params.selectedVpn);
      setSelectedVpn(route.params.selectedVpn);
      // console.log(
      //   'route ka data ------',
      //   route.params.selectedVpn.CountryShort,
      // );
    } else {
      setStaticData(); // Call async function to fetch and set static data
    }
  }, [route.params?.selectedVpn]);

  const fetchConfigFile = async () => {
    return configFile;
    // return JAPAN_OVPN_CONFIG;
  };
  const configFile = `###############################################################################
# OpenVPN 2.0 Sample Configuration File
# for PacketiX VPN / SoftEther VPN Server
# 
# !!! AUTO-GENERATED BY SOFTETHER VPN SERVER MANAGEMENT TOOL !!!
# 
# !!! YOU HAVE TO REVIEW IT BEFORE USE AND MODIFY IT AS NECESSARY !!!
# 
# This configuration file is auto-generated. You might use this config file
# in order to connect to the PacketiX VPN / SoftEther VPN Server.
# However, before you try it, you should review the descriptions of the file
# to determine the necessity to modify to suitable for your real environment.
# If necessary, you have to modify a little adequately on the file.
# For example, the IP address or the hostname as a destination VPN Server
# should be confirmed.
# 
# Note that to use OpenVPN 2.0, you have to put the certification file of
# the destination VPN Server on the OpenVPN Client computer when you use this
# config file. Please refer the below descriptions carefully.


###############################################################################
# Specify the type of the layer of the VPN connection.
# 
# To connect to the VPN Server as a "Remote-Access VPN Client PC",
#  specify 'dev tun'. (Layer-3 IP Routing Mode)
#
# To connect to the VPN Server as a bridging equipment of "Site-to-Site VPN",
#  specify 'dev tap'. (Layer-2 Ethernet Bridgine Mode)

dev tun


###############################################################################
# Specify the underlying protocol beyond the Internet.
# Note that this setting must be correspond with the listening setting on
# the VPN Server.
# 
# Specify either 'proto tcp' or 'proto udp'.

proto tcp


###############################################################################
# The destination hostname / IP address, and port number of
# the target VPN Server.
# 
# You have to specify as 'remote <HOSTNAME> <PORT>'. You can also
# specify the IP address instead of the hostname.
# 
# Note that the auto-generated below hostname are a "auto-detected
# IP address" of the VPN Server. You have to confirm the correctness
# beforehand.
# 
# When you want to connect to the VPN Server by using TCP protocol,
# the port number of the destination TCP port should be same as one of
# the available TCP listeners on the VPN Server.
# 
# When you use UDP protocol, the port number must same as the configuration
# setting of "OpenVPN Server Compatible Function" on the VPN Server.

remote 219.100.37.178 443


###############################################################################
# The HTTP/HTTPS proxy setting.
# 
# Only if you have to use the Internet via a proxy, uncomment the below
# two lines and specify the proxy address and the port number.
# In the case of using proxy-authentication, refer the OpenVPN manual.

;http-proxy-retry
;http-proxy [proxy server] [proxy port]


###############################################################################
# The encryption and authentication algorithm.
# 
# Default setting is good. Modify it as you prefer.
# When you specify an unsupported algorithm, the error will occur.
# 
# The supported algorithms are as follows:
#  cipher: [NULL-CIPHER] NULL AES-128-CBC AES-192-CBC AES-256-CBC BF-CBC
#          CAST-CBC CAST5-CBC DES-CBC DES-EDE-CBC DES-EDE3-CBC DESX-CBC
#          RC2-40-CBC RC2-64-CBC RC2-CBC
#  auth:   SHA SHA1 MD5 MD4 RMD160

cipher AES-128-CBC
auth SHA1


###############################################################################
# Other parameters necessary to connect to the VPN Server.
# 
# It is not recommended to modify it unless you have a particular need.

resolv-retry infinite
nobind
persist-key
persist-tun
client
verb 3
#auth-user-pass


###############################################################################
# The certificate file of the destination VPN Server.
# 
# The CA certificate file is embedded in the inline format.
# You can replace this CA contents if necessary.
# Please note that if the server certificate is not a self-signed, you have to
# specify the signer's root certificate (CA) here.

<ca>
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----

</ca>


###############################################################################
# The client certificate file (dummy).
# 
# In some implementations of OpenVPN Client software
# (for example: OpenVPN Client for iOS),
# a pair of client certificate and private key must be included on the
# configuration file due to the limitation of the client.
# So this sample configuration file has a dummy pair of client certificate
# and private key as follows.

<cert>
-----BEGIN CERTIFICATE-----
MIICxjCCAa4CAQAwDQYJKoZIhvcNAQEFBQAwKTEaMBgGA1UEAxMRVlBOR2F0ZUNs
aWVudENlcnQxCzAJBgNVBAYTAkpQMB4XDTEzMDIxMTAzNDk0OVoXDTM3MDExOTAz
MTQwN1owKTEaMBgGA1UEAxMRVlBOR2F0ZUNsaWVudENlcnQxCzAJBgNVBAYTAkpQ
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5h2lgQQYUjwoKYJbzVZA
5VcIGd5otPc/qZRMt0KItCFA0s9RwReNVa9fDRFLRBhcITOlv3FBcW3E8h1Us7RD
4W8GmJe8zapJnLsD39OSMRCzZJnczW4OCH1PZRZWKqDtjlNca9AF8a65jTmlDxCQ
CjntLIWk5OLLVkFt9/tScc1GDtci55ofhaNAYMPiH7V8+1g66pGHXAoWK6AQVH67
XCKJnGB5nlQ+HsMYPV/O49Ld91ZN/2tHkcaLLyNtywxVPRSsRh480jju0fcCsv6h
p/0yXnTB//mWutBGpdUlIbwiITbAmrsbYnjigRvnPqX1RNJUbi9Fp6C2c/HIFJGD
ywIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQChO5hgcw/4oWfoEFLu9kBa1B//kxH8
hQkChVNn8BRC7Y0URQitPl3DKEed9URBDdg2KOAz77bb6ENPiliD+a38UJHIRMqe
UBHhllOHIzvDhHFbaovALBQceeBzdkQxsKQESKmQmR832950UCovoyRB61UyAV7h
+mZhYPGRKXKSJI6s0Egg/Cri+Cwk4bjJfrb5hVse11yh4D9MHhwSfCOH+0z4hPUT
Fku7dGavURO5SVxMn/sL6En5D+oSeXkadHpDs+Airym2YHh15h0+jPSOoR6yiVp/
6zZeZkrN43kuS73KpKDFjfFPh8t4r1gOIjttkNcQqBccusnplQ7HJpsk
-----END CERTIFICATE-----

</cert>

<key>
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA5h2lgQQYUjwoKYJbzVZA5VcIGd5otPc/qZRMt0KItCFA0s9R
wReNVa9fDRFLRBhcITOlv3FBcW3E8h1Us7RD4W8GmJe8zapJnLsD39OSMRCzZJnc
zW4OCH1PZRZWKqDtjlNca9AF8a65jTmlDxCQCjntLIWk5OLLVkFt9/tScc1GDtci
55ofhaNAYMPiH7V8+1g66pGHXAoWK6AQVH67XCKJnGB5nlQ+HsMYPV/O49Ld91ZN
/2tHkcaLLyNtywxVPRSsRh480jju0fcCsv6hp/0yXnTB//mWutBGpdUlIbwiITbA
mrsbYnjigRvnPqX1RNJUbi9Fp6C2c/HIFJGDywIDAQABAoIBAERV7X5AvxA8uRiK
k8SIpsD0dX1pJOMIwakUVyvc4EfN0DhKRNb4rYoSiEGTLyzLpyBc/A28Dlkm5eOY
fjzXfYkGtYi/Ftxkg3O9vcrMQ4+6i+uGHaIL2rL+s4MrfO8v1xv6+Wky33EEGCou
QiwVGRFQXnRoQ62NBCFbUNLhmXwdj1akZzLU4p5R4zA3QhdxwEIatVLt0+7owLQ3
lP8sfXhppPOXjTqMD4QkYwzPAa8/zF7acn4kryrUP7Q6PAfd0zEVqNy9ZCZ9ffho
zXedFj486IFoc5gnTp2N6jsnVj4LCGIhlVHlYGozKKFqJcQVGsHCqq1oz2zjW6LS
oRYIHgECgYEA8zZrkCwNYSXJuODJ3m/hOLVxcxgJuwXoiErWd0E42vPanjjVMhnt
KY5l8qGMJ6FhK9LYx2qCrf/E0XtUAZ2wVq3ORTyGnsMWre9tLYs55X+ZN10Tc75z
4hacbU0hqKN1HiDmsMRY3/2NaZHoy7MKnwJJBaG48l9CCTlVwMHocIECgYEA8jby
dGjxTH+6XHWNizb5SRbZxAnyEeJeRwTMh0gGzwGPpH/sZYGzyu0SySXWCnZh3Rgq
5uLlNxtrXrljZlyi2nQdQgsq2YrWUs0+zgU+22uQsZpSAftmhVrtvet6MjVjbByY
DADciEVUdJYIXk+qnFUJyeroLIkTj7WYKZ6RjksCgYBoCFIwRDeg42oK89RFmnOr
LymNAq4+2oMhsWlVb4ejWIWeAk9nc+GXUfrXszRhS01mUnU5r5ygUvRcarV/T3U7
TnMZ+I7Y4DgWRIDd51znhxIBtYV5j/C/t85HjqOkH+8b6RTkbchaX3mau7fpUfds
Fq0nhIq42fhEO8srfYYwgQKBgQCyhi1N/8taRwpk+3/IDEzQwjbfdzUkWWSDk9Xs
H/pkuRHWfTMP3flWqEYgW/LW40peW2HDq5imdV8+AgZxe/XMbaji9Lgwf1RY005n
KxaZQz7yqHupWlLGF68DPHxkZVVSagDnV/sztWX6SFsCqFVnxIXifXGC4cW5Nm9g
va8q4QKBgQCEhLVeUfdwKvkZ94g/GFz731Z2hrdVhgMZaU/u6t0V95+YezPNCQZB
wmE9Mmlbq1emDeROivjCfoGhR3kZXW1pTKlLh6ZMUQUOpptdXva8XxfoqQwa3enA
M7muBbF0XN7VO80iJPv+PmIZdEIAkpwKfi201YB+BafCIuGxIF50Vg==
-----END RSA PRIVATE KEY-----

</key>

`;

  // Utility to determine signal strength based on speed
  const getSignalStrength = speed => {
    if (speed > 1_000_000_000) return 4;
    if (speed > 500_000_000) return 3;
    if (speed > 100_000_000) return 2;
    return 1;
  };

  // Dynamically calculate signal strength
  const signalStrength = selectedVpn ? getSignalStrength(selectedVpn.Speed) : 3;
  // Function to render signal bars based on signal strength
  const renderSignalBars = () => {
    const bars = [];
    for (let i = 1; i <= 4; i++) {
      bars.push(
        <View
          key={i}
          style={[
            styles.bar,
            {height: 10 * i}, // Adjust height for visual effect
            i <= signalStrength ? styles.activeBar : styles.inactiveBar, // Conditional styling
          ]}
        />,
      );
    }
    return bars;
  };

  return (
    <View style={styles.container}>
      <SubscriptionModal
        isVisible={RenewmodalVisible}
        refRBSheet={refRBSheet}
        onClose={() => setReNewModalVisible(false)}
      />
      <ImageBackground source={Images.Maps} style={styles.drawerBackground}>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}>
          <View
            style={{
              paddingLeft: 6,
            }}>
            <CustomHeader
              leftComponent={
                <TouchableOpacity
                  onPress={() => navigation.toggleDrawer()}
                  style={{
                    backgroundColor: '#6D6C69',
                    borderRadius: 30,
                    padding: 5,
                  }}>
                  {/* <Image source={Images.DrawerMenu} /> */}
                  
                  <Icon name="menu" size={30} color={COLORS.primary} />
                </TouchableOpacity>
              }
              middleComponent={
                <Image source={Images.Applogo} style={styles.logo} />
              }
              subscriptionComponent={
                <>
                  {/* {substatus !== 'active' && ( */}
                    <TouchableOpacity
                      onPress={() => refRBSheet.current.open()}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 50,
                        padding: 8,
                      }}>
                      <View style={{}}>
                        <MaterialIcons
                          name="workspace-premium"
                          size={24}
                          color={COLORS.red}
                        />
                      </View>
                    </TouchableOpacity>
                  {/* )} */}
                </>
              }
              rightComponent={
                <TouchableOpacity
                  style={{
                    backgroundColor: 'white',
                    width: wp(12),
                    height: wp(12), // Use wp instead of hp to keep it equal
                    borderRadius: wp(6), // Half of width/height to make it a circle
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => navigation.navigate('GetPremiumScreen')}>
                  {/* <Image source={Images.tajIcon} /> */}
                  <FontAwesome5 name="crown" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              }
            />
          </View>

          {/* Conditionally render content based on whether location is selected */}
          {location ? (
            <View style={styles.locationContainer}>
              <CountryFlag isoCode={location.CountryShort} size={34} />
              <View style={styles.locationDetails}>
                <Text style={styles.locationText}>{location.CountryLong}</Text>
                <Text style={styles.cityText}>{location.region}</Text>
              </View>
              <View style={styles.signalContainer}>{renderSignalBars()}</View>
            </View>
          ) : (
            <View style={styles.selectLocationPrompt}>
              <Text style={styles.selectLocationText}>
                Please select a location
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.changeLocationButton}
            onPress={() => navigation.navigate('LocationSelectionScreen')}>
            <Image source={Images.ChangeLocation} />
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: '#1c161b',
              borderRadius: 8,
              alignItems: 'center',
            }}>
            <Text style={styles.timer}>{formatTime(connectionTime)}</Text>
          </View>

          {location ? (
            <View style={styles.selectLocationPrompt}>
              <Text style={styles.selectLocationText}>
                Your IP : {location.IP}
              </Text>
            </View>
          ) : null}
          <View style={styles.animationWrapper}>
            <Animated.View
              style={[styles.outerAnimatedCircle, animatedOuterCircle]}
            />
            <Animated.View
              style={[styles.innerAnimatedCircle, animatedInnerCircle]}
            />
            <TouchableOpacity
              style={
                isConnected
                  ? styles.disconnectButtonMain
                  : styles.connectButtonMain
              }
              onPress={() => {
                if (vpnState === 'disconnected') {
                  startVpn(); // Function to connect VPN
                  handleConnectionToggle();
                } else {
                  // startVpn();  // Function to disconnect VPN
                  handleConnectionToggle();
                }
              }}>
              <Image
                source={vpnState === 'connected' ? Images.x : Images.Connect}
              />
            </TouchableOpacity>
          </View>

          <CustomModal
            visible={modalVisible}
            onClose={closeModal}
            title="Do you want to disconnect?"
            onConfirm={handleDisconnect}
            onCancel={closeModal}
            icon="close-o"
          />
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <ImageBackground
            source={Images.Background}
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              bottom: 0,
              right: 0,
              left: 0,
            }}
            resizeMode="stretch">
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: hp('15%'),
              }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 18,
                  fontFamily: 'Poppins-Medium',
                }}>
                {ConnectText || ''}
              </Text>
            </View>
            {isConnected ? (
              <View style={styles.speedContainer}>
                <View style={styles.speedBox}>
                  <Image
                    source={Images.arrowUP}
                    style={{marginRight: 8, height: 20, width: 20}}
                  />
                  <Text style={styles.timerText}>{byteIn}</Text>
                </View>
                <View style={styles.speedBox}>
                  <Image
                    source={Images.arrowDown}
                    style={{marginRight: 8, height: 20, width: 20}}
                  />
                  <Text style={styles.timerText}>{byteOut}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.speedContainer}>
                <Text style={styles.tapToConnectText}>Tap to Connect</Text>
              </View>
            )}
          </ImageBackground>
        </View>

        <View style={{alignItems: 'center'}}>
          <RBSheet
            ref={refRBSheet}
            height={450}
            closeOnDragDown
            closeOnPressMask
            customStyles={{
              wrapper: styles.sheetWrapper,
              container: styles.sheetContainer,
              draggableIcon: styles.draggableIcon,
            }}>
            <View style={styles.RBcontainer}>
              <Text style={styles.title}>Available Plans</Text>
              <View style={styles.RBInnercontainer}>
                <TouchableOpacity
                  onPress={restoreSubscription}
                  style={styles.restoreButton}>
                  <Text style={styles.restoreButtonText}>
                    Restore Subscription
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet.current.close(),
                      setSubscriptionStatusMessage('');
                  }}>
                  <Icon name="close-circle" size={24} color={COLORS.red} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.pricingText, {paddingBottom: 4}]}>
              {SubscriptionStatusMessage}
            </Text>

            <FlatList
              data={subscriptions}
              renderItem={renderSubscriptionPlan}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </RBSheet>
        </View>

        <CustomSnackbar
          message="Success"
          messageDescription="VPN Connected Successfully"
          onDismiss={dismissSnackbar}
          visible={snackbarVisible}
        />
      </ImageBackground>
    </View>
  );
};
const SubscriptionModal = ({isVisible, refRBSheet, onClose}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Subscription</Text>
          <Text style={styles.modalMessage}>
            To use this feature app services subscribe to app.
          </Text>
          <TouchableOpacity
            style={styles.ReNewbutton}
            onPress={() => {
              refRBSheet.current.open();
              onClose;
            }}>
            {/* <TouchableOpacity style={styles.button} onPress={onClose}> */}
            <Text style={styles.buttonText}>Renew Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c161b',
  },
  drawerBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  logo: {
    width: 50,
    height: 50,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#FFFFFF1A',
    marginHorizontal: 10,
    padding: 10,
  },
  locationDetails: {
    flex: 1,
    marginLeft: 10,
  },
  locationText: {
    color: '#DBD6CE',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  cityText: {
    color: '#DBD6CE',
    fontSize: 12,
    fontFamily: 'Poppins-Light',
  },
  changeLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 20,
  },
  timerText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  speedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '6%',
    margin: 4,
    marginHorizontal: 10,
  },
  speedBox: {
    backgroundColor: '#FFFFFF33',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
  },
  connectButtonMain: {
    backgroundColor: 'white',
    width: 124,
    height: 124,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  disconnectButtonMain: {
    backgroundColor: 'white',
    width: 124,
    height: 124,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  tapToConnectText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontFamily: 'Poppins-Medium',
  },
  animationWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: 80,
    marginBottom: -50,
    zIndex: 9999,
  },
  outerAnimatedCircle: {
    position: 'absolute',
    width: wp('54.5%'),
    height: hp('27%'),
    borderRadius: wp('26%'),
    borderWidth: wp('5%'),
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  innerAnimatedCircle: {
    position: 'absolute',
    width: wp('44%'),
    height: hp('21.5%'),
    borderRadius: wp('22%'),
    borderWidth: wp('5%'),
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectLocationPrompt: {
    alignItems: 'center',
  },
  selectLocationText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },

  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 1,
  },
  bar: {
    width: 8,
    marginHorizontal: 1,
    borderRadius: 2,
  },
  activeBar: {
    backgroundColor: 'green',
  },
  inactiveBar: {
    backgroundColor: '#ccc',
  },

  timer: {
    color: COLORS.primary,
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
  },

  // subcirption style start hai
  RBcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 3,
  },
  RBInnercontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: COLORS.black,
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  restoreButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  restoreButtonText: {
    fontSize: 13,
    color: COLORS.white,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  sheetWrapper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  draggableIcon: {
    backgroundColor: '#000',
  },
  subscriptionPlan: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  subscriptionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#0D47A1',
    marginBottom: 5,
  },
  subscriptionDescription: {
    fontSize: 14,
    color: '#1E88E5',
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },
  subscriptionDetail: {
    color: '#1565C0',
    marginBottom: 5,
    fontFamily: 'Poppins--Regular',
  },
  pricingDetails: {
    backgroundColor: '#BBDEFB',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  pricingTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#0D47A1',
  },
  pricingText: {
    color: '#1565C0',
    fontFamily: 'Poppins-Regular',
  },
  button: {
    marginTop: 15,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  subscribedText: {
    marginTop: 15,
    color: 'green',
    fontFamily: 'Poppins-Bold',
  },

  /////////////////
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: COLORS.greyDark,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.greyDark,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Regular',
  },
  ReNewbutton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default HomeScreen;
