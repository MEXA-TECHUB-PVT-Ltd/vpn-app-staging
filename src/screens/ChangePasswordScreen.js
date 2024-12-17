import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Button from '../components/Button';
import {TextInput as PaperTextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import CustomSnackbar from '../components/CustomSnackbar';
import CustomHeader from '../components/CustomHeader';
import Images from '../constants/Image';
import FlashMessages from '../components/FlashMessages';
import COLORS from '../constants/COLORS';

const ChangePasswordScreen = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showoldPassword, setShowoldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isFocused = useIsFocused();
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarVisible, setsnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errormsg, setErrorMsg] = useState('');
  const [flashMessage, setFlashMessage] = useState(false);
  const [flashMessageData, setFlashMessageData] = useState({
    message: '',
    description: '',
    type: '',
    icon: '',
  });
  const dismissSnackbar = () => {
    setsnackbarVisible(false);
  };

  const handleUpdatePassword = async () => {
    setsnackbarVisible(true);
    setTimeout(() => {
      setsnackbarVisible(false);
    }, 3000);
  };

  const handleSave = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = auth().currentUser;
      if (!user) {
        setFlashMessageData({
          message: 'Error',
          description: 'No user is currently signed in.',
          type: 'info',
          icon: 'info',
          backgroundColor: COLORS.red,
          textColor: COLORS.white,
        });
        setFlashMessage(true);
        setTimeout(() => {
          setFlashMessage(false);
        }, 2000);
        return;
        // throw new Error('No user is currently signed in.');
      }

      const userRef = firestore().collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        setFlashMessageData({
          message: 'Error',
          description: 'No User exist.',
          type: 'info',
          icon: 'info',
          backgroundColor: COLORS.red,
          textColor: COLORS.white,
        });
        setFlashMessage(true);
        setTimeout(() => {
          setFlashMessage(false);
        }, 2000);
        return;
        // throw new Error('User document does not exist.');
      }

      const userData = userDoc.data();

      if (userData.password !== oldPassword) {
        setFlashMessageData({
          message: 'Error',
          description: 'Incorrect Old Password.',
          type: 'info',
          icon: 'info',
          backgroundColor: COLORS.red,
          textColor: COLORS.white,
        });
        setFlashMessage(true);
        setTimeout(() => {
          setFlashMessage(false);
        }, 2000);
        return;
      }

      const credential = auth.EmailAuthProvider.credential(
        user.email,
        oldPassword,
      );
      await user.reauthenticateWithCredential(credential);

      await user.updatePassword(password);

      await firestore().collection('users').doc(user.uid).update({
        password: password,
      });
      setFlashMessageData({
        message: 'Success',
        description: 'Password updated successfully!',
        type: 'success',
        icon: 'success',
        backgroundColor: COLORS.success,
        textColor: COLORS.white,
      });
      setFlashMessage(true);

      setTimeout(() => {
        setFlashMessage(false);
      }, 2000);
      handleUpdatePassword();
      setPassword('');
      setConfirmPassword('');
      setOldPassword('');
      setErrorMessage('');
      setErrorMsg('');
    } catch (error) {
      console.log('Login error: ', error);
      let errorMessage = 'Too many attempts. Please try again later.'; // Default message
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'The old password is incorrect!';
          break;
        case 'auth/weak-password':
          errorMessage = 'The new password is too weak.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
      }
      setFlashMessageData({
        message: 'Error',
        description: errorMessage,
        type: 'info',
        icon: 'info',
        backgroundColor: COLORS.red,
        textColor: COLORS.white,
      });
      setFlashMessage(true);
      setTimeout(() => {
        setFlashMessage(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        leftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{backgroundColor: '#6D6C69', borderRadius: 30, padding: 5}}>
            <Image source={Images.back} />
          </TouchableOpacity>
        }
        middleComponent={
          <Text
            style={{color: 'orange', fontSize: 18, fontFamily: 'Poppins-Bold'}}>
            Change Password
          </Text>
        }
      />
      <Text style={styles.subtitle}>
        Regularly changing passwords boosts security
      </Text>

      <PaperTextInput
        label="Old Password"
        mode="outlined"
        placeholder="Enter Old Password"
        value={oldPassword}
        onChangeText={setOldPassword}
        textColor="white"
        placeholderTextColor="white"
        secureTextEntry={!showoldPassword}
        right={
          <PaperTextInput.Icon
            icon={showoldPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowoldPassword(!showoldPassword)}
          />
        }
        theme={{
          colors: {primary: 'orange', placeholder: '#888', text: 'white'},
        }}
        style={styles.input}
        outlineColor="#888"
        activeOutlineColor="orange"
      />
      <View style={{height: 20}}>
        <Text style={styles.errorstyle}>{errormsg}</Text>
      </View>
      <PaperTextInput
        label="Password"
        mode="outlined"
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        textColor="white"
        placeholderTextColor="white"
        secureTextEntry={!showPassword}
        right={
          <PaperTextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        theme={{
          colors: {primary: 'orange', placeholder: '#888', text: 'white'},
        }}
        style={styles.input}
        outlineColor="#888"
        activeOutlineColor="orange"
      />
      {flashMessage && <FlashMessages flashMessageData={flashMessageData} />}
      <PaperTextInput
        label="Confirm Password"
        mode="outlined"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        textColor="white"
        placeholderTextColor="white"
        secureTextEntry={!showConfirmPassword}
        right={
          <PaperTextInput.Icon
            icon={showConfirmPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
        theme={{
          colors: {primary: 'orange', placeholder: '#888', text: 'white'},
        }}
        style={styles.input}
        outlineColor="#888"
        activeOutlineColor="orange"
      />

      <View style={{marginBottom: 5}}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          margin: 20,
        }}>
        <Button
          title="Save"
          onPress={handleSave}
          loading={loading}
          disabled={
            !password || !confirmPassword || password !== confirmPassword
          }
          style={{
            backgroundColor:
              password && confirmPassword && password === confirmPassword
                ? 'orange'
                : '#888',
          }}
        />
      </View>
      <CustomSnackbar
        message="Success"
        messageDescription="Password updated successfully"
        onDismiss={dismissSnackbar}
        visible={snackbarVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1c161b',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -4,
  },
  errorstyle: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ChangePasswordScreen;
