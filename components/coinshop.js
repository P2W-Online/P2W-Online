import React, { useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import UpperBar from './upperBar.js';
import { AuthContext } from '../context/authContext/authContext.js';
import { getUserData, updateUserCoins, claimFreeCoins } from '../firebase/firestore.js';
import CountDownTimer from './countdown.js';

export default function Coinshop({ navigation }) {
  const [freeCoinsClaimed, setFreeCoinsClaimed] = useState(true)
  // Timer References
  const refTimer = useRef();

  // For keeping a track on the Timer
  const [timerEnd, setTimerEnd] = useState(false);

  const timerCallbackFunc = (timerFlag) => {
    // Setting timer flag to finished
    setTimerEnd(timerFlag);
    setFreeCoinsClaimed(false)
  };

  const { userLoggedIn, currentUser, userData, setUserData } = useContext(AuthContext) // Haetaan käyttäjän kirjautumistiedot contextista.
  if (!userLoggedIn) {
    navigation.navigate('Main');
  }

  //Kolikoiden lisääminen pelajaan tilille kun DailyCoins-nappia on painettu                    
  const handleFreeCoins = async () => {
    const coins = userData.coins + 125;
    await claimFreeCoins(currentUser.uid, coins, (Date.now() + 86400000))

    const uData = await getUserData(currentUser.uid)
    setUserData({ ...uData })

    setFreeCoinsClaimed(true)
  }

  //Ostaminen/kolikoiden lisääminen pelajaan tilille kun hinta-nappia on painettu                    
  const handleBuyingCoins = async (coins) => {
    const newCoinAmount = userData.coins + coins
    await updateUserCoins(currentUser.uid, newCoinAmount)

    const uData = await getUserData(currentUser.uid)
    setUserData({ ...uData })
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={['#b33939', '#4B0082']}
        style={styles.container}
      >

        {/* UPPER BAR */}
        <View style={styles.upperBarContainer}>
          <UpperBar
            userId={currentUser?.uid}
            title="Dashboard"
            onSettingsPress={() => console.log('Settings pressed')}
          />
        </View>

        {/* COIN SHOP TITLE */}
        <LinearGradient
          colors={['#DC8828', '#FAD36A',]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.coinShopContainer}
        >
          <Text style={styles.coinShopTitle}>Coinshop </Text>
        </LinearGradient>
        <LinearGradient
          colors={['#DC8828', '#FAD36A',]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.yellowContainer}
        >
        </LinearGradient>

        {/* TIME */}
        <LinearGradient
          colors={['#AA4120', '#691010',]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.timeBoardContainer}
        >
          <CountDownTimer
          ref={refTimer}
          timestamp={userData.freeCoinsTimer !== undefined && userData.freeCoinsTimer - Date.now() > 0 ? (userData.freeCoinsTimer - Date.now() ) / 1000 : 0}
          timerCallback={timerCallbackFunc}
          containerStyle={{
            height: 56,
            width: 120,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 35,
            marginTop: -15,
            marginLeft: 20,
          }}
          textStyle={{
            fontSize: 24,
            color: '#FFFFFF',
            fontWeight: '500',
            letterSpacing: 0.25,
          }}
        />

          <Image source={require('../assets/clock.png')} style={styles.clockImage} />
        </LinearGradient>

        {/* DAILYCOINSCONTAINER*/}
        <LinearGradient
          colors={['#DC8828', '#FAD36A']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.dailyCoinsContainer}
        >
          <Image source={require('../assets/coin.png')} style={styles.coinImage} />
          <Text style={styles.dailyCoinsText}>Daily Coins</Text>
          {freeCoinsClaimed ? (
            <TouchableOpacity
              style={styles.dailyCoinsButtonContainer}
            >
              <LinearGradient
                colors={['#DC8828', '#FAD36A']}
                start={[0, 1]}
                end={[0, 0]}
                style={styles.dailyCoinsButton}
              >
                <Text style={styles.dailyCoinsButtonText}>Wait</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleFreeCoins}
              style={styles.dailyCoinsButtonContainer}
            >
              <LinearGradient
                colors={['#DC8828', '#FAD36A']}
                start={[0, 1]}
                end={[0, 0]}
                style={styles.dailyCoinsButton}
              >
                <Text style={styles.dailyCoinsButtonText}>Claim</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

        </LinearGradient>

        {/* COINSHOPBOARD */}
        <View style={styles.coinBoardContainer}>
          <View style={styles.form}>

            {/* 1000 COINS*/}
            <LinearGradient
              colors={['#B64B43', '#FF7E7E', '#FFC0C0',]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.buyingCoinsContainer}
            >
              <Image
                source={require('../assets/coin1.png')}
                style={styles.moneyImage}
              />
              <Text style={styles.amountText}>1000</Text>
              <TouchableOpacity
                onPress={() => handleBuyingCoins(1000)}
                style={{ flex:1, height:'100%' }}
              >
                <LinearGradient
                  colors={['#2b711e', '#8feb7d']}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.buttonContainer}
                >
                  <Text style={styles.buttonText}>0,99€</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>

            {/* 3000 COINS */}
            <LinearGradient
              colors={['#B64B43', '#FF7E7E', '#FFC0C0',]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.buyingCoinsContainer}
            >
              <Image
                source={require('../assets/coin2.png')}
                style={styles.moneyImage}
              />
              <Text style={styles.amountText}>3000</Text>
              <TouchableOpacity
                onPress={() => handleBuyingCoins(3000)}
                style={{ flex:1, height:'100%' }}
              >
                <LinearGradient
                  colors={['#2b711e', '#8feb7d']}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.buttonContainer}
                >
                  <Text style={styles.buttonText}>1,99€</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>

            {/* 7000 COINS */}
            <LinearGradient
              colors={['#B64B43', '#FF7E7E', '#FFC0C0',]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.buyingCoinsContainer}
            >

              <Image
                source={require('../assets/coin3.png')}
                style={styles.moneyImage}
              />
              <Text style={styles.amountText}>7 000</Text>
              <TouchableOpacity
                onPress={() => handleBuyingCoins(7000)}
                style={{ flex:1, height:'100%' }}
              >
                <LinearGradient
                  colors={['#2b711e', '#8feb7d']}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.buttonContainer}
                >
                  <Text style={styles.buttonText}>4,99€</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>

            {/* 15000 COINS*/}
            <LinearGradient
              colors={['#B64B43', '#FF7E7E', '#FFC0C0',]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.buyingCoinsContainer}
            >
              <Image
                source={require('../assets/coin4.png')}
                style={styles.moneyImage}
              />
              <Text style={styles.amountText}>15 000</Text>
              <TouchableOpacity
                onPress={() => handleBuyingCoins(15000)}
                style={{ flex:1, height:'100%' }}
              >
                <LinearGradient
                  colors={['#2b711e', '#8feb7d']}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.buttonContainer}
                >
                  <Text style={styles.buttonText}>9,99€</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>

            {/* 40000 COINS*/}
            <LinearGradient
              colors={['#B64B43', '#FF7E7E', '#FFC0C0',]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.buyingCoinsContainer}
            > 

              <Image
                source={require('../assets/coin5.png')}
                style={styles.moneyImage}
              />
              <Text style={styles.amountText}>
                40 000
              </Text>
              <TouchableOpacity
                onPress={() => handleBuyingCoins(40000)}
                style={{ flex:1, height:'100%' }}
              >
                <LinearGradient
                  colors={['#2b711e', '#8feb7d']}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.buttonContainer}
                >
                  <Text style={styles.buttonText}>24,99€</Text>
                </LinearGradient>
              </TouchableOpacity>
              </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b33939',
  },

  upperBarContainer: {
    width: '100%',
  },

  coinShopContainer: {
    backgroundColor: ('#DC8828', '#E5A03D', '#FAD36A'),
    padding: 10,
    borderRadius: 30,
    marginBottom: 20,
    height: 65,
    width: '65%',
    top: 40,

  },
  coinShopTitle: {
    fontFamily: 'Nabla-Regular',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textShadowColor: '#000000',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 1,
    left: 50,
    bottom: 15,
  },

  yellowContainer: {
    padding: 10,
    marginBottom: 20,
    height: 35,
    width: '100%',
    bottom: 10,
  },

  timeBoardContainer: {
    padding: 10,
    height: 50,
    width: '40%',
    bottom: 50,
    borderColor: '#FAD36A',
    borderWidth: 2,
    borderRadius: 20,
  },

  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textShadowColor: '#000000',
    textShadowOffset: { width: 4, height: 2 },
    textShadowRadius: 1,
    left: 46,
  },

  clockImage: {
    width: 60,
    height: 60,
    position:'absolute',
    left: -20,
    top: -10,
  },

  dailyCoinsContainer: {
    width: '91%',
    bottom: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 15,
    marginTop:10,
    height: 75,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 20,
  },

  dailyCoinsText: {
    fontFamily: 'Nabla-Regular',
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    maxWidth: '50%',
  },

  coinImage: {
    width: 50,
    height: 50,
    margin: 12,
  },

  dailyCoinsButtonContainer: {
    width: '25%',
    height: '70%',
    marginRight: '5%',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 15
  },

  dailyCoinsButton: {
    flex: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderRadius: 15
  },

  dailyCoinsButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 48,
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    bottom: 5,
  },

  dailyCoinsBadge: {
    position: 'absolute',
    top: -5,
    right: -5
  },

  coinBoardContainer: {
    flex:1,
    backgroundColor: ('#54022A'),
    width: '92%',
    paddingTop:10,
    paddingBottom:10,
    borderRadius: 20,
    marginBottom:20,
  },

  form: {
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignContent:'center',
  },

  buyingCoinsContainer: {
    flex:1,
    flexDirection:'row',
    backgroundColor:'white',
    justifyContent: 'space-around',
    padding: 10,
    borderRadius: 10,
    marginTop:5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderColor: '#ffbaba',
    borderWidth: 2,
    borderRadius: 20,
  },

  moneyImage: {
     height: 50, 
     width: 50, 
     alignSelf:'center'
  },

  oneCoinImage: {
    height: 40, 
    width: 40, 
    
  },

  amountText: {
    flex:1, 
    flexDirection:'row',
    height:'100%',
    textAlignVertical:'center',
    textAlign:'center',
    color: '#ffffff',
    fontSize: 16,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  buttonContainer: {
    flex:1, 
    borderRadius: 4, 
    height:'100%',
    padding: 15,
    borderRadius: 10,
    borderColor: '#ffbaba',
    borderWidth: 2,
    borderRadius: 20,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign:'center',
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    //top: 5,
  },
});