import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {TextInput as PaperTextInput} from 'react-native-paper';
import Button from '../../components/Button';
import Images from '../../constants/Image';
import DeviceInfo from 'react-native-device-info';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CustomSnackbar from '../../components/CustomSnackbar';
import {useIsFocused} from '@react-navigation/native';
import FlashMessages from '../../components/FlashMessages';
import COLORS from '../../constants/COLORS';

const SignupScreen = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setsnackbarVisible] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const isFocused = useIsFocused();
  const [flashMessage, setFlashMessage] = useState(false);
  const [flashMessageData, setFlashMessageData] = useState({
    message: '',
    description: '',
    type: '',
    icon: '',
  });
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
  }, []); // Dependency array

  useEffect(() => {
    console.log('test');
    GoogleSignin.configure({
      webClientId:
        '124123034810-rakb9fpqv8al9l551kpb4sqpo9o5iuva.apps.googleusercontent.com',
    });
  }, [isFocused]);

  const dismissSnackbar = () => {
    setsnackbarVisible(false);
  };
  const handleUpdatePassword = async () => {
    setsnackbarVisible(true);
    setTimeout(() => {
      setsnackbarVisible(false);
    }, 3000);
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

  // /ye final thi for register and store in firestore with local sotrage
  const handleSignup = async () => {
    console.log('signup press');
    if (email === '' || password === '' || confirmPassword === '') {
      showFlashMessage(
        'Error',
        'Please Fill All the Fields.',
        'info',
        COLORS.red,
      );
      return;
    }

    if (password !== confirmPassword) {
      showFlashMessage('Error', 'Passwords do not match.', 'info', COLORS.red);
      return;
    }
    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const userDetail = userCredential.user; // assuming user details are in userCredential.user
      const userId = userDetail.uid;

      await firestore().collection('users').doc(userId).set({
        name: fullName,
        email: email,
        password: password,
        deviceId: deviceId,
        image: '',
        purchasedServersList: [],
      });

      console.log('User account created & signed in!');

      showFlashMessage(
        'Success',
        'You have successfully logged in',
        'success',
        'green',
      );
      handleUpdatePassword();
    } catch (error) {
      console.log('error---------', error);
      const errorMessages = {
        'auth/email-already-in-use': 'This email address is already in use!',
        'auth/invalid-email': 'This email address is invalid!',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      };

      const errorMessage =
        errorMessages[error.code] || 'Something Went Wrong. Please try again.';
      showFlashMessage('Error', errorMessage, 'info', COLORS.red);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleButtonPress = async () => {
    setLoading(true);
    try {
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

        console.log('You have successfully signed up with Google!');
        showFlashMessage(
          'Success',
          'You have successfully signed up with Google!',
          'success',
          'green',
        );
      } else {
        showFlashMessage(
          'Welcome Back',
          'You have successfully logged in with Google!',
          'success',
          'green',
        );
      }
    } catch (error) {
      console.log('Login error: ', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{alignItems: 'center', paddingBottom: 40}}>
        <Image source={Images.Applogo} style={styles.logo} />
      </View>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputContainer}>
        <PaperTextInput
          label="Full Name"
          mode="outlined"
          placeholder="Enter Full Name"
          value={fullName}
          textColor="white"
          placeholderTextColor="white"
          onChangeText={setFullName}
          theme={{
            colors: {
              primary: 'orange',
              placeholder: '#888',
              text: '#DBD6CE',
              fontFamily: 'Poppins-Regular',
            },
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
        />

        <PaperTextInput
          label="Email"
          mode="outlined"
          placeholder="Enter Email"
          value={email}
          // onChangeText={setEmail}
          onChangeText={text => setEmail(text.trim())}
          textColor="white"
          placeholderTextColor="white"
          keyboardType="email-address"
          autoCapitalize="none"
          theme={{
            colors: {
              primary: 'orange',
              placeholder: '#888',
              text: '#DBD6CE',
              fontFamily: 'Poppins-Regular',
            },
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
        />
        {flashMessage && <FlashMessages flashMessageData={flashMessageData} />}
        <PaperTextInput
          label="Password"
          mode="outlined"
          placeholder="Enter Password"
          textColor="white"
          placeholderTextColor="white"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          right={
            <PaperTextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          theme={{
            colors: {
              primary: 'orange',
              placeholder: '#888',
              text: '#DBD6CE',
              fontFamily: 'Poppins-Regular',
            },
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
        />

        <PaperTextInput
          label="Confirm Password"
          mode="outlined"
          placeholder="Confirm Password"
          textColor="white"
          placeholderTextColor="white"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          right={
            <PaperTextInput.Icon
              icon={showConfirmPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          theme={{
            colors: {
              primary: 'orange',
              placeholder: '#888',
              text: '#DBD6CE',
              fontFamily: 'Poppins-Regular',
            },
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
        />
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={agreeTerms}
          onValueChange={setAgreeTerms}
          tintColors={{true: 'orange', false: '#888'}}
          style={styles.checkbox}
        />

        <Text style={styles.checkboxLabel}>
          I agree with{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('TermServices')}>
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('PrivacyPolicy')}>
            Privacy Policy
          </Text>
        </Text>
      </View>
      <View style={{paddingTop: 30}}></View>
      <Button
        title="Register"
        onPress={handleSignup}
        disabled={!agreeTerms}
        loading={loading}
        style={{backgroundColor: agreeTerms ? 'orange' : '#888'}}
      />
      <View style={styles.socialLoginContainer}>
        <Text style={styles.orText}>Or sign up with</Text>
        <TouchableOpacity onPress={() => onGoogleButtonPress()}>
          <Image source={Images.Google} />
        </TouchableOpacity>
      </View>
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.linkText}> Sign In</Text>
        </TouchableOpacity>
      </View>
      <CustomSnackbar
        message="Success"
        messageDescription="User account created & signed in!"
        onDismiss={dismissSnackbar} // Make sure this function is defined
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
    color: '#FE8C00',
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    marginBottom: 15,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxLabel: {
    color: 'white',
    fontSize: 12,
  },

  socialLoginContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  orText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },

  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    fontFamily: 'Poppins-Medium',
  },
  signInText: {
    color: '#DBD6CE',
    textAlign: 'center',
  },
  linkText: {
    color: '#FF9900', // Or whatever color you prefer for the link
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    paddingTop: 3,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -4,
    fontFamily: 'Poppins-Regular',
  },
});

export default SignupScreen;
