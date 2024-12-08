import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { firebase_db } from '../firebase/firebase';
import { AuthContext } from '../context/authContext/authContext';
import { getUserData } from '../firebase/firestore.js';
import { MotiView } from 'moti';
import UpperBar from './upperBar';
import { useFonts } from 'expo-font';

const BOX_TYPES = {
  commonBox: {
      minPoints: 50,
      maxPoints: 150,
      name: 'Common Box',
      image: require('../assets/chest.png'),
      colors: ['#A67C00', '#FFD700'] // Gold theme
  },
  rareBox: {
      minPoints: 100,
      maxPoints: 300,
      name: 'Rare Box',
      image: require('../assets/chest2.png'),
      colors: ['#4B0082', '#8A2BE2'] // Purple theme
  },
  legendaryBox: {
      minPoints: 250,
      maxPoints: 10001,
      name: 'Legendary Box',
      image: require('../assets/chest2.png'),
      colors: ['#8B0000', '#FF0000'] // Red theme
  }
};

const numbersToNice = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const _stagger = 150;

function Tick({ children, ...rest }) {
    return <Text {...rest}>{children}</Text>;
}

function TickerList({ number, fontSize, index, reset }) {
    return (
        <View style={{ height: fontSize, overflow: "hidden" }}>
            <MotiView
                animate={{
                    translateY: -fontSize * 1.105 * (reset ? number : number + 40),
                }}
                transition={{
                    delay: (5 - index) * _stagger,
                    damping: 80,
                    stiffness: 20,
                }}
            >
                {numbersToNice.map((num, i) => (
                    <Tick
                        key={`number-${num}-${i}`}
                        style={{
                            fontSize: fontSize,
                            lineHeight: fontSize * 1.105,
                            fontWeight: "900",
                            fontVariant: ["tabular-nums"],
                            color: reset ? '#FFD700' : '#FFFFFF',
                        }}
                    >
                        {num}
                    </Tick>
                ))}
            </MotiView>
        </View>
    );
}

function Ticker({ value = "00000", fontSize = 50 }) {
  const paddedValue = value.toString().padStart(4, '0');
  const splitValue = paddedValue.split('');
    return (
        <View style={styles.numbersContainer}>
            {splitValue.map((number, index) => (
                <TickerList
                    key={index}
                    fontSize={fontSize}
                    number={parseInt(number)}
                    index={index}
                    reset={value === "00000"}
                />
            ))}
        </View>
    );
}

export default function Inventory({ navigation }) {
    const { userLoggedIn, currentUser, userData, setUserData } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [showReward, setShowReward] = useState(false);
    const [currentReward, setCurrentReward] = useState(0);
    const [isOpening, setIsOpening] = useState(false);
    const [openingStage, setOpeningStage] = useState(''); // 'opening' or 'revealed'

    useEffect(() => {
        if (!userLoggedIn || !currentUser?.uid) {
            navigation.navigate('Main');
            return;
        }

        const unsubscribe = onSnapshot(
            doc(firebase_db, 'users', currentUser.uid),
            (doc) => {
                if (doc.exists()) {
                    setUserData({ ...doc.data()});
                }
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userLoggedIn, currentUser]);

    const handleOpenBox = async (boxType) => {
        if (!userData?.inventory || !userData.inventory[boxType]) {
            Alert.alert('Error', 'No boxes available to open');
            return;
        }

        try {
            // Start the animation
            setOpeningStage('opening');

            const { minPoints, maxPoints } = BOX_TYPES[boxType];
            const pointsWon = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;

            const newInventory = {
                ...userData.inventory,
                [boxType]: userData.inventory[boxType] - 1,
            };
            console.log(newInventory)

            const newScore = userData.score + pointsWon;

            // Wait for the animation to complete
            await new Promise((resolve) => setTimeout(resolve, -2000));

            // Update the state with the final reward
            setOpeningStage('revealed');
            setCurrentReward(pointsWon);

            // Update the user's data in Firestore
            const userRef = doc(firebase_db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                inventory: newInventory,
                score: newScore,
            });
            const uData = await getUserData(currentUser.uid)
            setUserData({ ...uData })

            // Close the modal after showing the reward
            setTimeout(() => {
                setOpeningStage('');
            }, 5000);
        } catch (error) {
            console.error('Box opening failed:', error);
            setOpeningStage('');
            Alert.alert('Error', 'Failed to open box. Please try again.');
        }
    };

    return (
        <LinearGradient colors={['#b33939', '#4B0082']} style={styles.container}>
            <View style={styles.upperBarContainer}>
                <UpperBar
                    userId={currentUser?.uid}
                    title="Inventory"
                    onSettingsPress={() => console.log('Settings pressed')}
                />
            </View>

            <Text style={styles.title}>Inventory</Text>
            <View style={styles.separatorContainer}>
                <View style={styles.separator}></View>
                <Text style={styles.separatorText}>Your Boxes</Text>
                <View style={styles.separator}></View>
            </View>

            <ScrollView style={styles.boxesContainer}>
                {Object.entries(BOX_TYPES).map(([boxType, config]) => (
                    <LinearGradient
                        key={boxType}
                        colors={config.colors}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.boxCard}
                    >
                        <View style={styles.boxInfo}>
                            <Image source={config.image} style={styles.boxImage} />
                            <View style={styles.boxDetails}>
                                <Text style={styles.boxTitle}>{config.name}</Text>
                                <Text style={styles.boxCount}>
                                    Owned: {userData?.inventory?.[boxType] || 0}
                                </Text>
                                <Text style={styles.pointsRange}>
                                    Points: {config.minPoints} - {config.maxPoints}
                                </Text>
                            </View>
                        </View>
                        
                        <TouchableOpacity
                            onPress={() => handleOpenBox(boxType)}
                            disabled={!userData?.inventory?.[boxType]}
                            style={[
                                styles.openButton,
                                !userData?.inventory?.[boxType] && styles.disabledButton
                            ]}
                        >
                            <LinearGradient
                                colors={['#2EA944', '#68E74F']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.openButtonGradient}
                            >
                                <Text style={styles.openButtonText}>
                                    {userData?.inventory?.[boxType] ? 'OPEN BOX' : 'NO BOXES'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>
                ))}
            </ScrollView>

            {/* Opening Animation Modal */}
            <Modal
                visible={openingStage !== ''}
                transparent={true}
                animationType="none"
            >
                <View style={styles.modalContainer}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.95)']}
                        style={styles.modalContent}
                    >
                        <View style={styles.openingContainer}>
                            {openingStage === 'opening' ? (
                                <>
                                    <Text style={styles.openingTitle}>Rolling...</Text>
                                    <Ticker value="00000" fontSize={50} />
                                </>
                            ) : (
                                <>
                                    <Text style={styles.rewardTitle}>You Won!</Text>
                                    <Ticker value={currentReward.toString()} fontSize={50} />
                                    <Text style={[styles.rewardTitle, { marginTop: 20 }]}>Points</Text>
                                </>
                            )}
                        </View>
                    </LinearGradient>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#ffffff',
        textShadowColor: '#000000',
        textShadowOffset: { width: -2, height: 2 },
        textShadowRadius: 1,
        borderColor: '#fafafa',
        width: '100%', 
        textAlign: 'center', 
        marginTop: 10
      },

    boxCard: {
        margin: 20,
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#ffbaba',
    },
    boxInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boxImage: {
        width: 80,
        height: 80,
        marginRight: 15,
    },
    boxDetails: {
        flex: 1,
    },
    boxTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        fontFamily: 'Nabla-Regular',
    },
    boxCount: {
        color: 'white',
        fontSize: 18,
        marginTop: 5,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        fontFamily: 'Nabla-Regular',
    },
    pointsRange: {
        color: '#FFD700',
        fontSize: 16,
        marginTop: 5,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        fontFamily: 'Nabla-Regular',
    },
    openButton: {
        marginTop: 15,
        width: '100%',
    },
    openButtonGradient: {
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#69ff73',
    },
    openButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        fontFamily: 'Nabla-Regular',
    },
    disabledButton: {
        opacity: 0.5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContent: {
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFD700',
    },
    rewardTitle: {
        color: '#FFD700',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
        fontFamily: 'Nabla-Regular',
    },
    tickerContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    openingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 30,
  },
  openingText: {
    fontFamily: 'Nabla-Regular',
      color: '#FFD700',
      fontSize: 36,
      fontWeight: 'bold',
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
  },
  rewardContainer: {
      alignItems: 'center',
      justifyContent: 'center',
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
      padding: 30,
      borderRadius: 20,
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#FFD700',
  },
  rewardTitle: {
      color: '#FFD700',
      fontSize: 32,
      fontFamily: 'Nabla-Regular',
      fontWeight: 'bold',
      marginBottom: 20,
      textShadowColor: '#000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 3,
  },
  openingTitle: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
},
numbersContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  padding: 20,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#FFD700',
  justifyContent: 'center',
  alignItems: 'center',
},
separatorContainer: {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10
},
separator: {
  height: 1,
  flex: 3,
  backgroundColor: '#dcb5b9'
},
separatorText: {
    fontFamily: 'Nabla-Regular',
  color: 'white',
  fontWeight: 'bold',
  marginLeft: 5,
  marginRight: 5,
  fontSize: 18,
  textShadowColor: '#000000',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 1,
},
});
