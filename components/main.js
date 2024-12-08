import React, { useContext }from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/authContext/authContext.js';
import { doSignOut } from '../firebase/auth';
import UpperBar from './upperBar.js';
import { useFonts } from 'expo-font';


export default function Header({ navigation }) {
  const { userLoggedIn, currentUser, userData } = useContext(AuthContext) // Haetaan käyttäjän kirjautumistiedot contextista.

  const [fontsLoaded] = useFonts({
    'Nabla-Regular': require('../assets/Nabla-Regular.ttf'),
  });

  // Add loading check
  if (!fontsLoaded) {
    return null;
  }

  const logout = async () => {
    try {
      await doSignOut();
      navigation.navigate('Main');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert(
        'Logout Error',
        'Failed to log out. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }

  // email displaylle tyyliä
  const emailContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  };

  const emailTextStyle = {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  };

  return (
    
    <LinearGradient
      colors={['#b33939', '#4B0082']} // TAUSTA VÄRIN LAITTO GRADIENTILLA
      style={styles.container}
    >

          {/* Näytetään UpperBar kun käyttäjä on kirjaantunut sisään.*/}
      {userLoggedIn && (
        <View style={styles.upperBarContainer}>
          <UpperBar 
            userId={currentUser?.uid} // Käyttäjän ID välitetään yläpalkille
            title="Dashboard" 
            onSettingsPress={() => console.log('Settings pressed')}
          />
        </View>
      )}
      
    <Text style={styles.title}>P2W-Online</Text>
    
      <View style={styles.buttonContainer}>
        {!userLoggedIn ? (
          <>
            {/* LOG IN NAPPI GRADIENTILLA */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{ width: '100%' }}
            >
              <LinearGradient
                colors={['#8A2BE2', '#DA70D6']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Log in</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* SIGNIN NAPPI GRADIENTILLA */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Sign')}
              style={{ width: '100%' }}
            >
              <LinearGradient
                colors={['#8A2BE2', '#DA70D6']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* User email display with styling */}
            <View style={emailContainerStyle}>
              <Text style={emailTextStyle}>
                Welcome! {userData?.username}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('Scoreboard')}
              style={{ width: '100%' }}
            >
              <LinearGradient
                colors={['#8A2BE2', '#DA70D6']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>View Scoreboard</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Coinshop')}
              style={{ width: '100%' }}
            >
              <LinearGradient
                colors={['#8A2BE2', '#DA70D6']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>CoinShop</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Boxshop')}
              style={{ width: '100%' }}
            >
              <LinearGradient
                colors={['#8A2BE2', '#DA70D6']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Loot Box</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Inventory')}
              style={{ width: '100%' }}
            >
              <LinearGradient
                colors={['#8A2BE2', '#DA70D6']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Inventory</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={logout}
              style={{ width: '100%' }}
            >
              <LinearGradient
                colors={['#8A2BE2', '#DA70D6']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Log Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Image
        source={require('../assets/chestOpen1.png')}
        style={styles.image}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    backgroundColor: '#b33939',
  },

 upperBarContainer: {
    position: 'absolute',  
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, 
  },

  title: {
    fontFamily: 'Nabla-Regular',
    fontSize: 50,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 0,
    textShadowColor: '#000000',
    textShadowOffset: { width: 4, height: 2 },
    textShadowRadius: 1,
    marginTop: 90, 
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
    fontFamily: 'Nabla-Regular',
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
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