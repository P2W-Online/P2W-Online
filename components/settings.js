import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import AudioPlayer from '../components/audioplayer.js';
import UpperBar from './upperBar.js'; 
import { AuthContext } from '../context/authContext/authContext.js'; 

export default function Settings() {
  const [volume, setVolume] = useState(0.3);
  const { userLoggedIn, currentUser } = useContext(AuthContext); 

  const handleVolumeChange = async (value) => {
    setVolume(value);
    await AudioPlayer.setVolume(value); // Asetetaan äänenvoimakkuus
  };

  return (
    <LinearGradient
      colors={['#b33939', '#4B0082']}
      style={styles.container}
    >
      {userLoggedIn && (
        <View style={styles.upperBarContainer}>
          <UpperBar
            userId={currentUser?.uid} 
            title="Settings"
          />
        </View>
      )}

      {/* musiikin säätö */}
      <Text style={styles.title}>Settings</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Adjust Music Volume</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={handleVolumeChange}
          minimumTrackTintColor="#1fb28a"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1fb28a"
        />
        <Text style={styles.volumeText}>Volume: {Math.round(volume * 100)}%</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
    
  },
  upperBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#000000',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 1,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#fafafa',
    width: '100%', 
    textAlign: 'center', 
    paddingBottom: 10,
  },
  sliderContainer: {
    width: '80%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingTop: 10,
  },
  label: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  slider: {
    width: '100%',
    height: 20,
  
  },
  volumeText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 10,
    textShadowColor: '#000000',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
});