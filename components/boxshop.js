import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { Audio } from 'expo-av';
import { Badge } from 'react-native-paper';
import UpperBar from './upperBar.js';
import { AuthContext } from '../context/authContext/authContext.js';
import { ScrollView } from 'react-native';
import { buyLootBox, getUserData, claimFreeLootbox, claimFreeSuperLootbox } from '../firebase/firestore.js';

const BOX_PRICES = {
    commonBox: {
        single: 125,
        triple: 350,
        ten: 1100,
        type: 'commonBox'
    },
    rareBox: {
        single: 250,
        triple: 700,
        ten: 2200,
        type: 'rareBox'
    },
    legendaryBox: {
        single: 500,
        triple: 1400,
        ten: 4400,
        type: 'legendaryBox'
    }
};

export default function BoxShop({ navigation }) {
    const { userLoggedIn, currentUser, userData, setUserData } = useContext(AuthContext) // Haetaan käyttäjän kirjautumistiedot contextista.
    const [sound, setSound] = useState(null)
    const [showAd, setShowAd] = useState(false)

    if (!userLoggedIn) {
        navigation.navigate('Main');
    }

    // Ladataan ja toistetaan ääni, kun painetaan nappia ja vapautetaan lopuksi. 
    const playSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/coins.mp3')
        );
        setSound(sound);
        await sound.playAsync();
    };

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const buy = async (box, amount, price) => {
        //console.log(userData)
        if (price > userData.coins) {
            console.log("Ei rahaa")
        } else {
            let newCoinsValue = userData.coins - price
            await playSound();
            const osto = await buyLootBox(currentUser.uid, userData, box, amount, newCoinsValue)
            if (osto == "success") {
                const uData = await getUserData(currentUser.uid)
                setUserData({ ...uData })
            } else {
                console.log("virhe: ", osto)
            }
        }
    }
    const freeBox = async () => {
        // Asetetaan 24h cooldown ilmaiselle lootboxille
        await claimFreeLootbox(currentUser.uid, userData, (Date.now() + 86400000))
        await playSound();
        const uData = await getUserData(currentUser.uid)
        setUserData({ ...uData })
    }
    const claimSupeBonus = async () => {
        setShowAd(true)
        // Asetetaan 24h cooldown ilmaiselle SuperLootBoxille
        await claimFreeSuperLootbox(currentUser.uid, userData, (Date.now() + 86400000))
        await playSound();
        const uData = await getUserData(currentUser.uid)
        setUserData({ ...uData })

        setTimeout(() => {
            setShowAd(false)
        }, 5000)
    }
    return (
        <LinearGradient
            colors={['#b33939', '#4B0082']} // TAUSTA VÄRIN LAITTO GRADIENTILLA
            style={styles.container}
        >
            {/* UPPER BAR */}
            <View style={styles.upperBarContainer}>
                <UpperBar
                    userId={currentUser?.uid} // Käyttäjän ID välitetään yläpalkille
                    title="Dashboard"
                    onSettingsPress={() => console.log('Settings pressed')}
                />
            </View>

            {/* FREE LOOTBOXES*/}
            <View style={styles.freeLootboxContainer}>
                {/* Daily Bonus*/}
                <LinearGradient
                    colors={['#DC8828', '#FAD36A']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.dailyBonusBox}
                >
                    <Image source={require('../assets/chest.png')} style={styles.chest1Image} />
                    <Text style={styles.freeLootBoxText}>Daily Bonus</Text>

                    {/* Jos laatikko on haettu viimeisen 24h aikana, ei anneta pelaajan hakea uutta laatikkoa, vaan muutetaan napin tekstiksi Wait */}
                    {userData.freeLootboxTimer >= Date.now() && userData.freeLootboxTimer !== undefined ? (
                        <TouchableOpacity
                            style={styles.freeLootBox1ButtonContainer}
                        >
                            <LinearGradient
                                colors={['#DC8828', '#FAD36A']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.freeLootBoxButton}
                            >
                                <Text style={styles.freeLootBoxButtonText}>Wait</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => freeBox()}
                            style={styles.freeLootBox1ButtonContainer}
                        >
                            <LinearGradient
                                colors={['#DC8828', '#FAD36A']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.freeLootBoxButton}
                            >
                                <>
                                    <Text style={styles.freeLootBoxButtonText}>Go!</Text>
                                    <Badge style={styles.freeLootBox1Badge}>1</Badge>
                                </>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                </LinearGradient>

                {/* Super Bonus*/}
                {/* Tälle napille ei ole vielä toiminnallisuutta */}
                <LinearGradient
                    colors={['#5638C5', '#FC5AFF']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.dailyBonusBox}
                >
                    <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                    <Text style={styles.freeLootBoxText}>Super Bonus</Text>
                    {/* Jos laatikko on haettu viimeisen 24h aikana, ei anneta pelaajan hakea uutta laatikkoa, vaan muutetaan napin tekstiksi Wait */}
                    {parseInt(userData.freeSuperLootboxTimer) >= Date.now() && userData.freeSuperLootboxTimer !== undefined ? (
                        <TouchableOpacity
                            onPress={() => console.log('No box to claim')}
                            style={styles.freeLootBox2ButtonContainer}
                        ><LinearGradient
                            colors={['#DC8828', '#FAD36A']}
                            start={[0, 1]}
                            end={[0, 0]}
                            style={styles.freeLootBoxButton}
                        >
                                <Text style={styles.freeLootBoxButtonText}>Wait</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={claimSupeBonus}
                            style={styles.freeLootBox2ButtonContainer}
                        ><LinearGradient
                            colors={['#DC8828', '#FAD36A']}
                            start={[0, 1]}
                            end={[0, 0]}
                            style={styles.freeLootBoxButton}
                        >
                                <Text style={styles.freeLootBoxButtonText}>&#9654;</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </LinearGradient>
            </View>

            <View style={styles.separatorContainer}>
                <View style={styles.separator}></View>
                <Text style={styles.separatorText}>Chests</Text>
                <View style={styles.separator}></View>
            </View>

            {/* Loot Box Cards*/}
            <ScrollView style={styles.lootBoxCardsContainer}>
                <View style={styles.lootBoxCardContainer}>
                    {/* Common Boxes Row */}
                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>1 Common Box</Text>
                        <Image source={require('../assets/chest.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                            onPress={() => buy('commonBox', 1, BOX_PRICES.commonBox.single)}
                            style={styles.buyButton}
                        >
                            <LinearGradient
                                colors={['#2EA944', '#68E74F']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.lootBoxCardButton}
                            >
                                <Image source={require('../assets/coin.png')} style={styles.lootBoxCoinImage} />
                                <Text style={styles.lootBoxCardButtonText}>125</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>3 Common Boxes</Text>
                        <Image source={require('../assets/chest.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                            onPress={() => buy('commonBox', 3, BOX_PRICES.commonBox.triple)}
                            style={styles.buyButton}
                        >
                            <LinearGradient
                                colors={['#2EA944', '#68E74F']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.lootBoxCardButton}
                            >
                                <Image source={require('../assets/coin.png')} style={styles.lootBoxCoinImage} />
                                <Text style={styles.lootBoxCardButtonText}>350</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>10 Common Boxes</Text>
                        <Image source={require('../assets/chest.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                            onPress={() => buy('commonBox', 10, BOX_PRICES.commonBox.ten)}
                            style={styles.buyButton}
                        >
                            <LinearGradient
                                colors={['#2EA944', '#68E74F']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.lootBoxCardButton}
                            >
                                <Image source={require('../assets/coin.png')} style={styles.lootBoxCoinImage} />
                                <Text style={styles.lootBoxCardButtonText}>1100</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                <View style={styles.lootBoxCardContainer}>
                    {/* Rare Boxes Row */}
                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>1 Rare Box</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                            onPress={() => buy('rareBox', 1, BOX_PRICES.rareBox.single)}
                            style={styles.buyButton}
                        >
                            <LinearGradient
                                colors={['#2EA944', '#68E74F']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.lootBoxCardButton}
                            >
                                <Image source={require('../assets/coin.png')} style={styles.lootBoxCoinImage} />
                                <Text style={styles.lootBoxCardButtonText}>250</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>3 Rare Boxes</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                            onPress={() => buy('rareBox', 3, BOX_PRICES.rareBox.triple)}
                            style={styles.buyButton}
                        >
                            <LinearGradient
                                colors={['#2EA944', '#68E74F']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.lootBoxCardButton}
                            >
                                <Image source={require('../assets/coin.png')} style={styles.lootBoxCoinImage} />
                                <Text style={styles.lootBoxCardButtonText}>700</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>10 Rare Boxes</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                            onPress={() => buy('rareBox', 10, BOX_PRICES.rareBox.ten)}
                            style={styles.buyButton}
                        >
                            <LinearGradient
                                colors={['#2EA944', '#68E74F']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.lootBoxCardButton}
                            >
                                <Image source={require('../assets/coin.png')} style={styles.lootBoxCoinImage} />
                                <Text style={styles.lootBoxCardButtonText}>2200</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                <View style={styles.lootBoxCardContainer}>
                    {/* Legendary Boxes Row */}
                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>1 Legendary Box</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                            onPress={() => buy('legendaryBox', 1, BOX_PRICES.legendaryBox.single)}
                            style={styles.buyButton}
                        >
                            <LinearGradient
                                colors={['#2EA944', '#68E74F']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.lootBoxCardButton}
                            >
                                <Image source={require('../assets/coin.png')} style={styles.lootBoxCoinImage} />
                                <Text style={styles.lootBoxCardButtonText}>500</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>3 Legendary Boxes</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                            onPress={() => buy('legendaryBox', 3, BOX_PRICES.legendaryBox.triple)}
                            style={styles.buyButton}
                        >
                            <LinearGradient
                                colors={['#2EA944', '#68E74F']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.lootBoxCardButton}
                            >
                                <Image source={require('../assets/coin.png')} style={styles.lootBoxCoinImage} />
                                <Text style={styles.lootBoxCardButtonText}>1400</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>10 Legendary Boxes</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                            onPress={() => buy('legendaryBox', 10, BOX_PRICES.legendaryBox.ten)}
                            style={styles.buyButton}
                        >
                            <LinearGradient
                                colors={['#2EA944', '#68E74F']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.lootBoxCardButton}
                            >
                                <Image source={require('../assets/coin.png')} style={styles.lootBoxCoinImage} />
                                <Text style={styles.lootBoxCardButtonText}>4400</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </ScrollView>

            {/* Opening Animation Modal */}
            <Modal
                visible={showAd}
                transparent={true}
                animationType="fade"
                style={{ width: '80%', height: '60%', backgroundColor: 'white' }}
            >
                <View style={styles.modalContainer}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.95)']}
                        style={styles.modalContent}
                    >
                        <Text style={{color:'white', fontSize:36, fontWeight:'bold'}}>Buy Coins!</Text>
                        <View style={styles.adContainer}>
                            <View style={{
                                flex: 2,
                            }}>
                                <Image source={require('../assets/chestOpen1.png')} style={styles.adChestImage} />
                            </View>
                            <View style={styles.adItemInfoContainer}>
                                <Image source={require('../assets/coin.png')}
                                    style={styles.adItemInfoImage} />
                                <Text style={styles.adItemInfoText}>40 000</Text>
                            </View>
                            <LinearGradient
                                colors={['#2EA944', '#68E74F']}
                                start={[0, 1]}
                                end={[0, 0]}
                                style={styles.adItemPriceContainer}
                            >
                                <Text style={styles.adItemPriceText}>24,99€</Text>
                            </LinearGradient>
                        </View>
                    </LinearGradient>
                </View>
            </Modal>
        </LinearGradient>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Asetetaan aloitus ylhäällä
        alignItems: 'center',
        backgroundColor: '#b33939',
    },
    upperBarContainer: {
        width: '100%',
    },
    freeLootboxContainer: {
        width: '100%',
    },
    dailyBonusBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 15,
        height: 75,
        borderColor: '#ffbaba',
        borderWidth: 2,
        borderRadius: 15,
    },
    freeLootBoxText: {
        color: '#ffffff',
        fontSize: 24,
        //fontWeight: 'bold',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        maxWidth: '50%',
        fontFamily: 'Nabla-Regular',
    },
    chest1Image: {
        width: 50,
        height: 50,
        margin: 12,
    },
    freeLootBox1ButtonContainer: {
        width: '25%',
        height: '70%',
        marginRight: '5%',
        borderColor: '#fff7bf',
        borderWidth: 2,
        borderRadius: 15
    },
    freeLootBox2ButtonContainer: {
        width: '25%',
        height: '70%',
        marginRight: '5%',
        borderColor: '#ffbffb',
        borderWidth: 2,
        borderRadius: 17
    },
    freeLootBoxButton: {
        flex: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderRadius: 15
    },
    freeLootBoxButtonText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 28,
        fontWeight: 'bold',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        
    },
    freeLootBox1Badge: {
        position: 'absolute',
        top: -5,
        right: -5
    },
    separatorContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    separator: {
        height: 1,
        flex: 3,
        backgroundColor: '#dcb5b9'
    },
    separatorText: {
        color: 'white',
        //fontWeight: 'bold',
        marginLeft: 5,
        marginRight: 5,
        fontSize: 18,
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        fontFamily: 'Nabla-Regular',
    },
    lootBoxCardsContainer: {
        //flex: 1,
        overflow: 'auto'
    },
    lootBoxCardContainer: {
        //flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: 'auto',
    },
    lootBoxCard: {
        justifyContent: 'space-evenly',
        minHeight: 100,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        borderColor: '#ffbaba',
        borderWidth: 2,
        borderRadius: 15,
        width: '30%',
    },
    lootBoxCardText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        marginTop: 5,
    },
    buyButton: {
        width: '80%'
    },
    lootBoxCardButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 10,
        borderColor: '#69ff73',
        borderWidth: 2,
        borderRadius: 15,
    },
    lootBoxCoinImage: {
        width: 20,
        height: 20,
        marginLeft: 5,
        borderRadius: 50,
        borderColor: 'rgba(0,0,0,0.3)',
        borderWidth: 2,
    },
    lootBoxCardButtonText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        marginLeft: 5
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContent: {
        width: '80%',
        height: '70%',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFD700',
    },
    adContainer: {
        //color: '#FFD700',
        flex: 1,
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
    adChestImage: {
        height: '100%',
        aspectRatio: 1 / 1,
        marginTop: 40
    },
    adItemInfoContainer: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        textAlign: 'center',
    },
    adItemInfoImage: {
        height: 40,
        width: 40,
        alignSelf: 'flex-end',
        marginBottom: 25,
        marginRight: -60,
        marginLeft: -50,
    },
    adItemInfoText: {
        color: '#ffffff',
        fontSize: 40,
        fontWeight: 'bold',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        lineHeight: 48,
        paddingBottom: 20,
        textAlign: 'center',
        alignSelf: 'flex-end'
    },
    adItemPriceText: {
        color: '#ffffff',
        fontSize: 40,
        fontWeight: 'bold',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    adItemPriceContainer: {
        flex: 1,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
    }
});