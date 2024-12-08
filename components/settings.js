import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firebase_db } from '../firebase/firebase';
import AudioPlayer from '../components/audioplayer.js';
import UpperBar from './upperBar.js';
import { AuthContext } from '../context/authContext/authContext.js';
import { useFonts } from 'expo-font';


// Predefined profile pictures
const profilePictures = [
  { id: 'avatar1', source: require('../assets/avatars/avatar1.png') },
  { id: 'avatar2', source: require('../assets/avatars/avatar2.png') },
  { id: 'avatar3', source: require('../assets/avatars/avatar3.png') },
  { id: 'avatar4', source: require('../assets/avatars/avatar4.png') },
  { id: 'avatar5', source: require('../assets/avatars/avatar5.png') },
  { id: 'avatar6', source: require('../assets/avatars/avatar6.png') },
];

export default function Settings() {
  const [volume, setVolume] = useState(0.3);
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1');
  const { userLoggedIn, currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's current avatar when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const userRef = doc(firebase_db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.avatar) {
              setSelectedAvatar(userData.avatar);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Failed to load profile data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleVolumeChange = async (value) => {
    setVolume(value);
    await AudioPlayer.setVolume(value);
  };

  const handleAvatarSelect = async (avatarId) => {
    if (!currentUser?.uid) {
      Alert.alert('Error', 'You must be logged in to change your profile picture');
      return;
    }

    try {
      // Update local state
      setSelectedAvatar(avatarId);

      // Update Firebase
      const userRef = doc(firebase_db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        avatar: avatarId
      });

      //Alert.alert('Success', 'Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('Error', 'Failed to update profile picture');
      // Revert local state if Firebase update fails
      setSelectedAvatar(selectedAvatar);
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#b33939', '#4B0082']}
        style={[styles.container, styles.loadingContainer]}
      >
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

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

      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Settings</Text>

        {/* Profile Picture Selection */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Select Profile Picture</Text>
          <View style={styles.avatarGrid}>
            {profilePictures.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                onPress={() => handleAvatarSelect(avatar.id)}
                style={[
                  styles.avatarContainer,
                  selectedAvatar === avatar.id && styles.selectedAvatarContainer
                ]}
              >
                <Image
                  source={avatar.source}
                  style={styles.avatarImage}
                />
                {selectedAvatar === avatar.id && (
                  <View style={styles.selectedOverlay}>
                    <Text style={styles.selectedText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Volume Control */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
        </ScrollView>
      </ScrollView>
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
    textShadowOffset: { width: 2, height: -2 },
    textShadowRadius: 1,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#fafafa',
    width: '100%', 
    textAlign: 'center', 
    paddingBottom: 10,
    fontFamily: 'Nabla-Regular',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    width: '100%'
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
  scrollView: {
    width: '100%',
  },

  profileSection: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: -1 },
    textShadowRadius: 1,
  },

  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },

  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
    margin: 5,
  },

  selectedAvatarContainer: {
    borderColor: '#1fb28a',
    borderWidth: 3,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(31, 178, 138, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});