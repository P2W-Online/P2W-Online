import React, { useState, useContext } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { doCreateUserWithEmailAndPassword } from '../firebase/auth';
import { AuthContext } from '../context/authContext/authContext.js';

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthContext);


  //Tarkistukset käyttäjän luontiin
  const validateForm = () => {
    if (!name || !email || !username || !password || !verifyPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (password !== verifyPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
  
    try {
      setIsLoading(true);
      const user = await doCreateUserWithEmailAndPassword(name, email, username, password);
  
      // päivittää AuthContextin uudella user datalla
      setUser({
        uid: user.uid,
        email: user.email,
        username: user.username,
        score: 0,
      });
  
      console.log("User account created successfully");
      Alert.alert(
        'Success',
        'Account created successfully! You are now logged in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
      );
    } catch (error) {
      console.error('Authentication error: ', error.message);
      let errorMessage = 'Failed to create account. Please try again.';
  
      // error messageja
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      }
  
      Alert.alert('Sign Up Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
      <LinearGradient
        colors={['#b33939', '#4B0082']}
        style={styles.container}
      >
        <Text style={styles.title}>P2W-Online</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Masi Pallopää"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="masipallo@outlook.com"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Create Username</Text>
          <TextInput
            style={styles.input}
            placeholder="MasiMasi12"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <Text style={styles.label}>Verify Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Verify password"
            value={verifyPassword}
            onChangeText={setVerifyPassword}
            secureTextEntry={true}
          />
        </View>

        <View style={styles.buttonContainer}>
          {/* CREATE ACCOUNT NAPPI GRADIENTILLA */}
          <TouchableOpacity
            //onPress={() => navigation.navigate('Login')}   /*Napin toimintoa vielä muokattava tarpeen mukaan*/
            onPress={handleSignUp}
            style={{ width: '100%' }}
          >
            <LinearGradient
              colors={['#8A2BE2', '#DA70D6']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Create account</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/chestOpen1.png')}
          style={styles.image}
        />
      </LinearGradient>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b33939',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textShadowColor: '#000000', 
    textShadowOffset: { width: -4, height: 2 }, 
    textShadowRadius: 1, 
  
  },

  form: {
    width: '65%',
  },
  
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#000000', 
    textShadowOffset: { width: -4, height: 2 }, 
    textShadowRadius: 1,
    marginTop: 10,
    marginBottom:5
  },

  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
  
  },

  button: {
    width: '100%',
    marginVertical: 30,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#8a2be2',
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
    marginTop: 5,
    width: 150,
    height: 150,
    resizeMode: 'contain',
    
  },
});



