import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, orderBy, limit, query } from 'firebase/firestore';
import { firebase_db } from '../firebase/firebase';
import UpperBar from './upperBar.js';
import { AuthContext } from '../context/authContext/authContext.js';

const Scoreboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userLoggedIn, currentUser } = useContext(AuthContext); //Haetaan käyttäjän kirjautuminen authcontextista.

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firebase_db, 'users'), orderBy('score', 'desc'), limit(10)),
      (snapshot) => {
        const scores = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(scores);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error loading scores:', error);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const formatScore = (score) => {
    if (score >= 10_000_000) {
      return `${(score / 1_000_000).toFixed(1)}M`; 
    }
    return score.toLocaleString();
  };

  const podiumPlayers = users.slice(0, 3);

  const podiumColors = [
    ['#DAA520', '#FFD700'], // Gold
    ['#4682B4', '#87CEEB'], // Silver
    ['#8B4513', '#CD7F32'], // Bronze
  ];

  const renderPodiumPlayer = (playerIndex, position) => {
    const player = podiumPlayers[playerIndex];
    if (!player) return null;

    const formattedScore = formatScore(player.score); 
    const fontSize = player.score > 1000000 ? 24 : 18; // Käänsin nämä toisin päin. Lyhennetty pistemäärä näytetään isommalla fontilla (koska siinä on vähemmän merkkejä) | Aaro

    return (
      <View style={styles.playerContainer}>
        <LinearGradient
          colors={podiumColors[position - 1]}
          style={[
            styles.playerCard,
            position === 1 && styles.firstPlaceCard,
            styles.bubbleEffect,
          ]}
        >
          <Image source={require('../assets/pfp.png')} style={styles.playerIcon} />
          <Text style={styles.playerName}>{player.username}</Text>
          <Text style={[styles.playerScore, { fontSize }]}>
            {formatScore(player.score)} {/* Muotoiltu pistemäärä */}
          </Text>
          <Image source={require('../assets/medal.png')} style={styles.medalIcon} />
        </LinearGradient>
      </View>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#b33939', '#4B0082']} style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={[styles.title, { marginTop: 20 }]}>Loading Scores...</Text>
      </LinearGradient>
    );
  }

  if (users.length === 0) {
    return (
      <LinearGradient colors={['#b33939', '#4B0082']} style={[styles.container, styles.centerContent]}>
        <Text style={styles.title}>No scores available</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#b33939', '#4B0082']} style={styles.container}>
    {/* NÄYTETÄÄN UPPERBAR KUN KÄYTTÄJÄ ON KIRJAUTUNUT SISÄÄN */}
    {userLoggedIn && (
      <View style={styles.upperBarContainer}>
        <UpperBar
          userId={currentUser?.uid} // Käyttäjän ID välitetään yläpalkille
          title="Scoreboard"
          onSettingsPress={() => console.log('Settings pressed')}
        />
      </View>
    )}

      {/* Title */}
      <View style={[styles.titleContainer, styles.titleBackground]}>
        <Text style={styles.title}>Scoreboard</Text>
      </View>

      {/* Podium */}
      <View style={styles.podiumContainer}>
        <LinearGradient colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.3)']} style={styles.sectionBg}>
          <View style={styles.podium}>
            {podiumPlayers.length >= 3 && (
              <>
                {renderPodiumPlayer(1, 2)}
                {renderPodiumPlayer(0, 1)}
                {renderPodiumPlayer(2, 3)}
              </>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Scoreboard */}
      <View style={[styles.section, styles.scoreboardSection]}>
        <LinearGradient colors={['#FFB347', '#FFB347']} style={[styles.sectionBg, styles.scoreboard]}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Player</Text>
            <Text style={styles.headerText}>Score</Text>
          </View>

          <ScrollView>
            {users.slice(3).map((user, index) => {
              return (
                <View key={index} style={styles.scoreRow}>
                  <LinearGradient
                    colors={['#32CD32', '#28A428']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.scoreCard, styles.bubbleEffect]}
                  >
                   <View style={styles.scoreContent}>
                    <Image source={require('../assets/pfp.png')} style={styles.playerIconSmall} />
                    <Text style={styles.scoreText}>{user.username}</Text>
                    <View style={styles.coin} />
                    <Text style={styles.scoreText}>{user.score.toLocaleString()}</Text>
                  </View>
                  </LinearGradient>
                </View>
              );
            })}
          </ScrollView>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  upperBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
    flex: 1,

  },
  sectionBg: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flex: 1,
  },
  scoreboardSection: {
    flex: 1,
    marginBottom: 20,
    padding: 5,
  },
  titleContainer: {
    height: 80, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10, 
    width: '100%',
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
  podiumContainer: {
    marginHorizontal: 20,  
    marginBottom: 10,  
    borderRadius: 15,  
    overflow: 'hidden', 
    height: 200,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 160,
  },
  playerContainer: {
    marginHorizontal: 10,
  },
  playerCard: {
    width: 90,
    height: 120,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstPlaceCard: {
    width: 110,
    height: 140,
  },
  playerIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginBottom: 8,
  },
  playerIconSmall: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
    backgroundColor: '#1E90FF',
  },
  playerName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  playerScore: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  medalIcon: {
    width: 34,
    height: 34,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    flex: 1,
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textAlign: 'left',
  },
  scoreRow: {
    marginVertical: 6,
    marginHorizontal: 5,
  },
  scoreCard: {
    borderRadius: 15,
    padding: 12,
    borderWidth: 2,
    borderColor: '#229922',
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,

  },
  scoreText: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  coin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFA500',
    marginHorizontal: 10,
  },
  bubbleEffect: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default Scoreboard;