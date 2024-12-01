import React, { useContext } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { Badge } from 'react-native-paper';
import UpperBar from './upperBar.js';
import { AuthContext } from '../context/authContext/authContext.js';
import { ScrollView } from 'react-native';
import { buyLootBox, getUserData, claimFreeLootbox } from '../firebase/firestore.js';

export default function BoxShop({ navigation }) {
    const { userLoggedIn, currentUser, userData, setUserData } = useContext(AuthContext) // Haetaan käyttäjän kirjautumistiedot contextista.
    if (!userLoggedIn) {
        navigation.navigate('Main');
    }
    const buy = async (box, amount, price) => {
        //console.log(userData)
        if(price > userData.coins){
            console.log("Ei rahaa")
        } else {
            let newCoinsValue = userData.coins - price
            //const buy = buyLootBox(currentUser.uid, userData, box, amount, newCoinsValue)
            const osto = await buyLootBox(currentUser.uid, userData, box, amount, newCoinsValue)
            console.log(osto)
            if ( osto == "success") {
                const uData = await getUserData(currentUser.uid)
                setUserData({...uData})
            } else {
                console.log("virhe: ", osto)
            }
        }
    }
    const freeBox = async () => {
        // Asetetaan 24h cooldown ilmaiselle lootboxille
        await claimFreeLootbox(currentUser.uid, userData, (Date.now()+86400000))
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
                    {parseInt(userData.freeLootboxTimer) <= Date.now() ? (
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
                     ) : (
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
                    <TouchableOpacity
                        onPress={() => console.log("lootbox2")}
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
                </LinearGradient>
            </View>

            <View style={styles.separatorContainer}>
                <View style={styles.separator}></View>
                <Text style={styles.separatorText}>Chests</Text>
                <View style={styles.separator}></View>
            </View>

            {/* Loot Box Cards*/}
            <ScrollView style={styles.lootBoxCardsContainer}>
                {/* Row 1 */}
                <View style={styles.lootBoxCardContainer}>
                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>1 Chest</Text>
                        <Image source={require('../assets/chest.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Basic',1,125)} //Box_type, amount, price 
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
                        <Text style={styles.lootBoxCardText}>3 Chests</Text>
                        <Image source={require('../assets/chest.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Basic',3,350)} //Box_type, amount, price 
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
                        <Text style={styles.lootBoxCardText}>10 Chests</Text>
                        <Image source={require('../assets/chest.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Basic',10,1100)} //Box_type, amount, price 
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

                {/* Row 2 */}
                <View style={styles.lootBoxCardContainer}>
                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>1 Chest</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Super',1,250)} //Box_type, amount, price 
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
                        <Text style={styles.lootBoxCardText}>3 Chests</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Super',3,700)} //Box_type, amount, price 
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
                        <Text style={styles.lootBoxCardText}>10 Chests</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Super',10,2200)} //Box_type, amount, price 
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

                {/* Row 3 */}
                <View style={styles.lootBoxCardContainer}>
                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>1 Chest</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Super',10,250)} //Box_type, amount, price 
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
                        <Text style={styles.lootBoxCardText}>3 Chests</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Super',10,700)} //Box_type, amount, price 
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
                        <Text style={styles.lootBoxCardText}>10 Chests</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Super',10,2200)} //Box_type, amount, price 
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

                {/* Row 4 */}
                <View style={styles.lootBoxCardContainer}>
                    <LinearGradient
                        colors={['#D34B33', '#BD0C38']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.lootBoxCard}
                    >
                        <Text style={styles.lootBoxCardText}>1 Chest</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Super',1,250)} //Box_type, amount, price 
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
                        <Text style={styles.lootBoxCardText}>3 Chests</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Super',3,700)} //Box_type, amount, price 
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
                        <Text style={styles.lootBoxCardText}>10 Chests</Text>
                        <Image source={require('../assets/chest2.png')} style={styles.chest1Image} />
                        <TouchableOpacity
                        onPress={() => buy('Super',10,2200)} //Box_type, amount, price 
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
            </ScrollView>
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
        fontWeight: 'bold',
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        maxWidth: '50%',
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
        fontWeight: 'bold',
        marginLeft: 5,
        marginRight: 5,
        fontSize: 18,
        textShadowColor: '#000000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    lootBoxCardsContainer: {
        flex: 1,
        overflow: 'auto'

    },
    lootBoxCardContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'

    },
    lootBoxCard: {
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

});