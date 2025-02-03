import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {TextInput as PaperTextInput} from 'react-native-paper'; // Import Paper TextInput
import Button from '../../components/Button';
import Images from '../../constants/Image';
import CustomSnackbar from '../../components/CustomSnackbar';
import {useIsFocused} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import FlashMessages from '../../components/FlashMessages';
import COLORS from '../../constants/COLORS';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setsnackbarVisible] = useState(false);

  const isFocused = useIsFocused();
  const [flashMessage, setFlashMessage] = useState(false);
  const [flashMessageData, setFlashMessageData] = useState({
    message: '',
    description: '',
    type: '',
    icon: '',
  });
  const [deviceId, setDeviceId] = useState('');
  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        // Fetch the device ID
        const id = await DeviceInfo.getUniqueId();
        // Check if id is an object and extract the value
        if (id && typeof id === 'object' && '_j' in id) {
          setDeviceId(id._j); // Extract the device ID
        } else {
          setDeviceId(id); // If it's a plain string, set it directly
        }
        console.log('Device ID fetched:', id);
      } catch (error) {
        console.error('Failed to fetch device ID:', error);
      }
    };

    fetchDeviceId();
  }, []);

  useEffect(() => {
    console.log('test');
    GoogleSignin.configure({
      webClientId:
        '124123034810-rakb9fpqv8al9l551kpb4sqpo9o5iuva.apps.googleusercontent.com',
    });
  }, [isFocused]);

  const [usersData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userSnapshot = await firestore()
          .collection('users')
          .where('email', '==', email)
          .get();

        if (userSnapshot.empty) {
          throw new Error('No user found with this email.');
        }

        let fetchedUserData = null;
        userSnapshot.forEach(doc => {
          fetchedUserData = {id: doc.id, ...doc.data()};
        });

        setUserData(fetchedUserData);
      } catch (error) {}
    };

    fetchUserData();
  }, [email]);

  useEffect(() => {
  }, [isFocused]);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const showFlashMessage = (message, description, type, backgroundColor) => {
    setFlashMessageData({
      message,
      description,
      type,
      icon: type,
      backgroundColor,
      textColor: 'white',
    });
    setFlashMessage(true);
    setTimeout(() => setFlashMessage(false), 2000);
  };
  const handleSignin = async () => {
    if (!email || !password) {
      showFlashMessage(
        'Error',
        'Please provide both email and password.',
        'info',
        COLORS.red,
      );
      return;
    }

    if (!validateEmail(email)) {
      showFlashMessage(
        'Error',
        'Please enter a valid email address.',
        'info',
        COLORS.red,
      );
      return;
    }

    // Attempt login
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
     
      handleUpdatePassword();
      console.log('User logged in:', userCredential.user);
      showFlashMessage(
        'Success',
        'You have successfully logged in.',
        'success',
        'green',
      );
      if (usersData?.id) {
        await firestore().collection('users').doc(usersData.id).update({
          password: password, // Updating the password field in Firestore
        });
        console.log('Password updated successfully in Firestore');
      } else {
        console.error('User ID not available to update Firestore');
      }
    } catch (error) {
      console.log('error-------------', error)
      const errorMessages = {
        'auth/invalid-credential': 'Invalid credentials.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/invalid-login': 'Invalid credentials. Please try again.',
        'auth/wrong-password': 'Invalid credentials. Please try again.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/invalid-email': 'The email address is not valid.',
      };
      const errorMessage =
        errorMessages[error.code] || 'Something Went Wrong. Please try again.';
      showFlashMessage('Error', errorMessage, 'info', COLORS.red);
      // console.log('Login error: ', error);
      // let errorMessage = 'Too many attempts. Please try again later.'; // Default message
      // switch (error.code) {
      //   case 'auth/user-not-found':
      //     errorMessage = 'No account found with this email.';
      //     break;
      //   case 'auth/invalid-credential':
      //     errorMessage = 'Invalid credentials.';
      //     break;
      //   case 'auth/invalid-login':
      //     errorMessage = 'Invalid credentials. Please try again.';
      //     break;
      //   case 'auth/wrong-password':
      //     errorMessage = 'Invalid credentials. Please try again.';
      //     break;
      //   case 'auth/invalid-email':
      //     errorMessage = 'The email address is not valid.';
      //     break;
      //   case 'auth/too-many-requests':
      //     errorMessage = 'Too many attempts. Please try again later.';
      //     break;
      // }

      // // Set the flash message state
      // setFlashMessageData({
      //   message: 'Error',
      //   description: errorMessage,
      //   type: 'info',
      //   icon: 'info',
      //   backgroundColor: COLORS.red,
      //   textColor: COLORS.white,
      // });
      // setFlashMessage(true);
      // setTimeout(() => {
      //   setFlashMessage(false);
      // }, 2000);
    } finally {
      setLoading(false);
    }
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

  const onGoogleButtonPress = async () => {
    setLoading(true);
    try {
      // Sign out of any previous Google account
      await GoogleSignin.signOut();
      // Check if the device supports Google Play services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Attempt to sign in and get user information
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In successful. User Info:', userInfo);
      // Extract the idToken
      const {idToken} = userInfo.data; // Updated to access idToken correctly
      // Check if the idToken is available
      if (!idToken) {
        throw new Error('Google Sign-In failed: No idToken returned.');
      }
      console.log('user idToken haiii-------------', idToken);
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      // console.log("You have successfully signed in with Google!", userCredential);
      // Get user details

      const userDetail = userCredential.user.toJSON();
      console.log('user detail haiiiiiiiiiiii', userDetail);
      const userId = userDetail.uid;
      const email = userDetail.email;
      const fullName = userDetail.displayName;

      // Check if user already exists in Firestore
      const userRef = firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // If user doesn't exist, create a new record
        await userRef.set({
          name: fullName || '',
          email: email,
          password: '', // Google sign-in does not provide the password
          deviceId: deviceId,
          image: '',
          purchasedServersList: [],
        });
        showFlashMessage(
          'Success',
          'You have successfully signed up with Google!',
          'success',
          'green',
        );
        console.log('You have successfully signed up with Google!');
      } else {
        showFlashMessage(
          'Welcome Back',
          'You have successfully logged in with Google!',
          'success',
          'green',
        );
      }
    } catch (error) {
      console.log('Google Sign-In error:', error);
      // console.log("Login error: ", error);
      // let message = "An error occurred. Please try again.";

      // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      //   message = "Sign-in was cancelled by the user.";
      // } else if (error.code === statusCodes.IN_PROGRESS) {
      //   message = "Sign-in is in progress.";
      // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      //   message = "Google Play Services is not available.";
      // } else {
      //   message = `Error: you have cancle the Google auth`;
      // }

      // setFlashMessageData({
      //   message: 'Error',
      //   description: 'Something went wrong, Please try again.',
      //   type: 'info',
      //   icon: 'info',
      //   backgroundColor: COLORS.red,
      //   textColor: COLORS.white,
      // });
      // setFlashMessage(true);
      // setTimeout(() => {
      //   setFlashMessage(false);
      // }, 2000);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{alignItems: 'center', paddingBottom: 40}}>
        <Image source={Images.Applogo} style={styles.logo} />
      </View>
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.inputContainer}>
        <PaperTextInput
          label="Email"
          mode="outlined"
          placeholder="Enter Email"
          value={email}
          // onChangeText={setEmail}
          onChangeText={text => setEmail(text.trim())}
          keyboardType="email-address"
          textColor="white"
          placeholderTextColor="white"
          autoCapitalize="none"
          theme={{
            colors: {
              primary: 'orange',
              placeholder: '#888',
              text: '#FFFFFF',
              fontFamily: 'Poppins-Regular',
            },
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
        />
        <PaperTextInput
          label="Password"
          mode="outlined"
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          textColor="white"
          placeholderTextColor="white"
          secureTextEntry={!showPassword}
          theme={{
            colors: {
              primary: 'orange',
              placeholder: '#888',
              text: '#FFFFFF',
              fontFamily: 'Poppins-Regular',
            },
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
          right={
            <PaperTextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)} // Toggle state
            />
          }
        />
      </View>
      {flashMessage && <FlashMessages flashMessageData={flashMessageData} />}
      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
   
      <View style={{paddingTop: 100}}>
        <Button
          title="Login"
          onPress={handleSignin}
          loading={loading}
          style={{backgroundColor: agreeTerms ? 'orange' : '#888'}}
        />

        <View style={styles.socialLoginContainer}>
          <Text style={styles.orText}>Or sign in with</Text>
          <TouchableOpacity onPress={() => onGoogleButtonPress()}>
            <Image source={Images.Google} style={{height:40, width:40}} />
          </TouchableOpacity>
        </View>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
            <Text style={styles.linkText}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomSnackbar
        message="Success"
        messageDescription="User logged in successfully"
        onDismiss={dismissSnackbar}
        visible={snackbarVisible}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1c161b',
  },
  title: {
    fontSize: 32,
    color:COLORS.primary,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#333',
    marginBottom: 15,
  },
  forgetPasswordText: {
    color: COLORS.primary,
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'Poppins-Medium',
  },

  socialLoginContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  orText: {
    color: '#6D6C69',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Poppins-Medium',
  },

  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signInText: {
    color: '#DBD6CE',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  linkText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -4,
    fontFamily: 'Poppins-Regular',
  },
});

export default LoginScreen;
