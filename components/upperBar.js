import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { onSnapshot, doc } from 'firebase/firestore';
import { firebase_db } from '../firebase/firebase';
import { doSignOut } from '../firebase/auth';
import { useNavigation } from '@react-navigation/native'; 

export default function UpperBar({ userId, onSettingsPress, title }) {
  const [points, setPoints] = useState(0);
  const [coins, setCoins] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigation = useNavigation(); 

  //Haetaan käyttäjän pisteet firestoresta.
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firebase_db, 'users', userId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setPoints(userData?.score || 0); 
        } else {
          console.error('User document does not exist!');
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );

    return unsubscribe; 
  }, [userId]);

   //Haetaan käyttäjän kolikot firestoresta.
   useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firebase_db, 'users', userId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setCoins(userData?.coins || 0); 
        } else {
          console.error('User document does not exist!');
        }
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );

    return unsubscribe; 
  }, [userId]);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev); 
  };

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
  };

  return (
    <View style={styles.headerContainer}>
    {/* Pelaajan pisteet */}
    <LinearGradient
      colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)']} 
      style={styles.scoreContainer} 
    >
      <Image source={require('../assets/pfp.png')} style={styles.icon} />
      <View style={styles.scoreTextContainer}>
        <Text style={styles.scoreText}>{points.toLocaleString()}</Text>
      </View>
    </LinearGradient>

    {/* Pelaajan kolikot */}
    <LinearGradient
      colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)']} 
      style={styles.coinsContainer} 
    >
      <Image source={require('../assets/coin.png')} style={styles.oneCoinImage} />      
      <Text style={styles.amountText}>{coins.toLocaleString()}</Text>     
    </LinearGradient>



    {/* Dropdown menu */}

    <View style={styles.menuContainer}>
  <LinearGradient
    colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)']}
    style={styles.menuButtonGradient}
  >
    <TouchableOpacity style={styles.menuButton} onPress={toggleDropdown}>
      <Text style={styles.menuIcon}>☰</Text>
    </TouchableOpacity>
  </LinearGradient>

  {dropdownVisible && (
    <View style={styles.dropdown}>

      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => navigation.navigate('Scoreboard')}
      >
        <Text style={styles.dropdownText}>Scoreboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => navigation.navigate('Coinshop')}
      >
        <Text style={styles.dropdownText}>Coinshop</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => navigation.navigate('Inventory')}
      >
        <Text style={styles.dropdownText}>Inventory</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => navigation.navigate('Boxshop')}
      >
        <Text style={styles.dropdownText}>Box Shop</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.dropdownText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dropdownItem} onPress={logout}>
        <Text style={styles.dropdownText}>Log Out</Text>
      </TouchableOpacity>
      
    </View>
  )}
</View>
  </View>
);
}

const styles = StyleSheet.create({

  headerGradient: {
    flex: 1, 
    padding: 10,
    borderBottomWidth: 2,
    borderColor: '#8B0000', 
  },
  headerContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#fafafa',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    width: 150,
    height: 40,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  scoreTextContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 16,
    textShadowColor: '#000', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 2,          
  },
  menuContainer: {
    position: 'relative',
  },
  menuButtonGradient: {
    borderRadius: 20, 
    padding: 2, 
  },
  menuButton: {
    padding: 10,
    borderRadius: 20,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 15,
  },
  dropdown: {
    position: 'absolute',
    top: 55,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    zIndex: 100,
    width: 150, 
    flexWrap: 'nowrap',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
    textShadowColor: '#000', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 2,  
  },

  oneCoinImage: {
    width: 20,
    height: 20,      
},

amountText: {
  color: '#ffffff',
  fontSize: 16,
  left: 5,  
  textShadowColor: '#000000',
  textShadowOffset: { width: -1, height: 1 },
  textShadowRadius: 1,
},

coinsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 20,
  width: 150,
  height: 40,
},

});