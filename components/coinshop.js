import React, { useState, useEffect,  useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, Button, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, orderBy, limit, query } from 'firebase/firestore';
import { firebase_db } from '../firebase/firebase';
import UpperBar from './upperBar.js';
import { Badge } from 'react-native-paper';
import { AuthContext } from '../context/authContext/authContext.js';
//import CountDown from 'react-native-countdown-component';

export default function Coinshop({ navigation }) {
  const { userLoggedIn, currentUser } = useContext(AuthContext) // Haetaan käyttäjän kirjautumistiedot contextista.
    if (!userLoggedIn) {
        navigation.navigate('Main');
    }

     //Kolikoiden lisääminen pelajaan tilille kun DailyCoins-nappia on painettu                    
   // const handleMoreCoins = {  
      

                                      
    //}
    


    //Ostaminen/kolikoiden lisääminen pelajaan tilille kun hinta-nappia on painettu                    
   // const handleBuying = {  
      

                                      
    //}
    
    const handleBuying = () => {
      // Tämä ei tee mitään vielä
    }
    
    return (   
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}> /*Tämä asettelu ScrollViewille poistaa valkoisen palkin näytöltä*/
        <LinearGradient
          colors={['#b33939', '#4B0082']}
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
                 {/* <CountDown
                 until={60 * 10 + 30}
                 size={10}                 
                 onFinish={() => alert('Finished')}
                 digitTxtStyle={{color: '#ffffff'}}
                 timeToShow={['H', 'M', 'S']}
                 timeLabels={{ m: null, s: null}}
                 showSeparator
               /> */}


               
               <Image source={require('../assets/clock.png')} style={styles.clockImage}/>
               <Text style={styles.timeText}>8h 49min </Text>                
          </LinearGradient>   
          
          
      
              {/* COINSHOPBOARD */}     
              <View style={styles.coinBoardContainer}>
              <View style={styles.form}>
            
            {/* 1000 COINS*/}
            <LinearGradient
                  colors={['#FF7E7E','#B64B43','#FFC0C0']}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.buyingCoinsContainer}
                  >                            
                  <Image
                  source={require('../assets/coin1.png')}
                  style={styles.moneyImage}
                  />
                    <Image
                  source={require('../assets/coin.png')}
                  style={styles.oneCoinImage}
                    />
                  <Text style={styles.amountText}>1000</Text>
                  <TouchableOpacity
                    onPress={handleBuying} /*Tähän muokattava napin toimintoa*/
                    style={{ width: '40%', left:48}}
                    >
                    <LinearGradient
                    colors={['#8feb7d', '#2b711e']}
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
                    colors={['#FF7E7E','#B64B43', '#FFC0C0']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.buyingCoinsContainer}
                  >                           
                  <Image
                  source={require('../assets/coin2.png')}
                  style={styles.moneyImage}
                  />
                  <Image
                  source={require('../assets/coin.png')}
                  style={styles.oneCoinImage}
                    />
                  <Text style={styles.amountText}>3000</Text>
                  <TouchableOpacity
                  onPress={() => navigation.navigate('Coinshop')} /*Tähän muokattava napin toimintoa*/
                  style={{ width: '40%', left:48}}
                  >
                  <LinearGradient
                    colors={['#8feb7d', '#2b711e']}
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
                  colors={['#FF7E7E','#B64B43', '#FFC0C0']}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.buyingCoinsContainer}
                  >                  
              
                  <Image
                  source={require('../assets/coin3.png')}
                  style={styles.moneyImage}
                  />
                  <Image
                  source={require('../assets/coin.png')}
                  style={styles.oneCoinImage}
                  />
                  <Text style={styles.amountText}>7000</Text>
                  <TouchableOpacity
                  onPress={() => navigation.navigate('Coinshop')} /*Tähän muokattava napin toimintoa*/
                  style={{ width: '40%', left:48}}
                  >
                  <LinearGradient
                    colors={['#8feb7d', '#2b711e']}
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
                    colors={['#FF7E7E','#B64B43', '#FFC0C0']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.buyingCoinsContainer}
                  >                            
                  <Image
                    source={require('../assets/coin4.png')}
                    style={styles.moneyImage}
                    />
                    <Image
                    source={require('../assets/coin.png')}
                    style={styles.oneCoinImage}
                    />
                    <Text style={styles.amountText}>15000</Text>
                    <TouchableOpacity
                    onPress={() => navigation.navigate('Coinshop')} /*Tähän muokattava napin toimintoa*/
                    style={{ width: '40%', left:48}}
                    >
                    <LinearGradient
                    colors={['#8feb7d', '#2b711e']}
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
                  colors={['#FF7E7E','#B64B43', '#FFC0C0']}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.buyingCoinsContainer}
                  >                  
              
                  <Image
                  source={require('../assets/coin5.png')}
                  style={styles.moneyImage}
                  />
                  <Image
                  source={require('../assets/coin.png')}
                  style={styles.oneCoinImage}
                  />
                  <Text style={styles.amountText}>40000</Text>
                  <TouchableOpacity
                  onPress={() => navigation.navigate('Coinshop')} /*Tähän muokattava napin toimintoa*/
                  style={{ width: '40%', left:48}}
                  >
                  <LinearGradient
                  colors={['#8feb7d', '#2b711e']}
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
    backgroundColor: ('#DC8828', '#E5A03D', '#FAD36A' ), 
    padding: 10,
    borderRadius: 30,
    marginBottom: 20,
    height: 65,
    width: '65%',
    top: 40,

  },
  coinShopTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textShadowColor: '#000000', 
    textShadowOffset: { width: 4, height: 2 }, 
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
    margin: 12,
    bottom: 55,
    right: 55,
  }, 

  dailyCoinsContainer: {
    width: '91%',
    bottom: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
    height: 75,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 20,
},

dailyCoinsText: {
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

dailyCoinsButtonText:{
  color: '#ffffff',
  fontSize: 34,
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
    backgroundColor: ('#54022A'), 
    width: '92%',
    height: 450,
    bottom: 40,
    borderRadius: 20,
  },

  form: {
    width: '65%',
  },
     
    buyingCoinsContainer: { 
     padding: 10,
     borderRadius: 10,
     marginBottom: 20,
     height: 65,
     width: '142%',
     top: 20,
     left:13,
     borderColor: '#ffbaba',
     borderWidth: 2,
     borderRadius: 20,
  },

  moneyImage: {
    width: 60,
    height: 60,
    position: 'absolute',    
    left: 10,
  },
  
  oneCoinImage: {
    width: 20,
    height: 20,
    top: 10,
    left: 88,   
},

  amountText: {
     color: '#ffffff',
     fontSize: 16,
     left: 115,
     bottom: 10,
     textShadowColor: '#000000',
     textShadowOffset: { width: -1, height: 1 },
     textShadowRadius: 1,
  },

  buttonContainer: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#8a2be2',
    left: 145,
    borderRadius: 10,
    bottom: 64,
    height: 66,
    borderColor: '#ffbaba',
    borderWidth: 2,
    borderRadius: 20,
  },
  
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000000', 
    textShadowOffset: { width: -2, height: 2 }, 
    textShadowRadius: 1,
    top: 5, 
  },
});
