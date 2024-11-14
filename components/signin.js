import React from 'react';
import { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {LinearGradient } from 'expo-linear-gradient';
import { doCreateUserWithEmailAndPassword } from '../firebase/auth';
import { AuthContext } from '../context/authContext';

export default function SignUp({ navigation }) {

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassWord] = useState();
  const [verifyPassword, setVerifyPassword] = useState();

  const handleSignUp = () => {
    console.log("called signup function")
    try{
      doCreateUserWithEmailAndPassword(email, password)
      console.log("User account created succesfully")
      /* Käyttäjälle pitäisi kertoa jollain tavalla, että tili on luotu onnistuneesti, ja että sillä voi nyt kirjautua sisään */
      navigation.navigate('Main')
    } catch (error) {
      console.error('Authentication error: ', error.message)
    }
    
  }

  return (
    <ScrollView>
    <LinearGradient
      colors={['#b33939', '#4B0082']} // TAUSTA VÄRIN LAITTO GRADIENTILLA
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
          onChangeText={setPassWord}
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
          style={{ width: '100%'}}
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



