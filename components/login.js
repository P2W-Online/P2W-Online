import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Keyboard, ScrollView, TouchableWithoutFeedback, Alert, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { doSignInWithEmailAndPassword } from '../firebase/auth';
import { AuthContext } from '../context/authContext/authContext.js';

export default function Login({ navigation }) {
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
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
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: '#4B0082', flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient colors={['#b33939', '#4B0082']} style={styles.container}>
          <Text style={styles.title}>P2W-Online</Text>
  
          <View style={styles.buttonContainer}>
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
  
            <TouchableOpacity
              style={{ width: '100%' }}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#8A2BE2', '#DA70D6']}
                start={[0, 0]}
                end={[1, 1]}
                style={[styles.button, isLoading && { opacity: 0.7 }]}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Logging in...' : 'Log in'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Kuvan näyttäminen ilman näppäimistön kuuntelua */}
          <Image
            source={require('../assets/chestOpen1.png')}
            style={styles.image}
          />
        </LinearGradient>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#4B0082',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
    textShadowColor: '#000000',
    textShadowOffset: { width: -4, height: 2 },
    textShadowRadius: 1,
    marginTop: 100,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 10,
    maxHeight: 300,
    flex: 1,
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
    marginTop: 150,
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});