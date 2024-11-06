import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function Main({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>P2W-Online</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Sign')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require('../assets/chestOpen1.png')}
        style={styles.image}
      />
    </View>
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
    marginBottom: 40,
    textShadowColor: '#000000', 
    textShadowOffset: { width: -4, height: 2 }, 
    textShadowRadius: 1, 
  },

  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 10,
  },

  button: {
    width: '100%',
    marginVertical: 10,
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
    marginTop: 30,
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});