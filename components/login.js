import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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
          />

          {/* LOGIN NAPPI GRADIENTILLA */}
          <TouchableOpacity style={{ width: '100%' }}>
            <LinearGradient
              colors={['#8A2BE2', '#DA70D6']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Log in</Text>
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