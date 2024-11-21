import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { doSignInWithEmailAndPassword } from '../firebase/auth';
import { AuthContext } from '../context/authContext/authContext.js';

export default function Login({ navigation }) {
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // KUUNTELIJAT NÄPPÄIMISTÖN KUUNTELEMISEEN (ilman tätä, arkun kuva hyppää tekstikenttien päälle.)
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    // Tarkistetaan, että kaikki kentät on täytetty.
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await doSignInWithEmailAndPassword(email, password);
      console.log("Signed in with user ", email);
      navigation.navigate('Main');
    } catch (error) {
      console.error('Authentication error: ', error.message);
      // virheilmotuksia
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      }

      Alert.alert(
        'Login Error',
        errorMessage,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#b33939', '#4B0082']}
        style={styles.container}
      >
        <Text style={styles.title}>P2W-Online</Text>

        <View style={styles.buttonContainer}>
          {/* SÄHKÖPOSTIN TEKSTIKENTTÄ */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="email"
            placeholderTextColor="#d3d3d3"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          {/* SALASANAN TEKSTIKENTTÄ*/}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#d3d3d3"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {/* LOGIN NAPPI GRADIENTILLA */}
          <TouchableOpacity 
            style={{ width: '100%' }}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#8A2BE2', '#DA70D6']}
              start={[0, 0]}
              end={[1, 1]}
              style={[
                styles.button,
                isLoading && { opacity: 0.7 }
              ]}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Logging in...' : 'Log in'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* KUVA NÄYTETÄÄN VAIN JOS NÄPPÄIMISTÖ EI OLE PÄÄLLÄ */}
        {!isKeyboardVisible && (
          <Image
            source={require('../assets/chestOpen1.png')}
            style={styles.image}
          />
        )}
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
    textShadowColor: '#000000',
    textShadowOffset: { width: -4, height: 2 },
    textShadowRadius: 1,
    marginTop: -200,
  },

  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 10,
  },

  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    color: '#000000',
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#000000', 
    textShadowOffset: { width: -4, height: 2 }, 
    textShadowRadius: 1,
    alignSelf: 'flex-start',
  },

  button: {
    width: '100%',
    marginVertical: 20,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 1,
  },

  image: {
    position: 'absolute',
    bottom: 20, 
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});