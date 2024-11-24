import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, orderBy, limit, query } from 'firebase/firestore';
import { firebase_db } from '../firebase/firebase';


export default function Login({ navigation }) {

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}> /*Tämä asettelu ScrollViewille poistaa valkoisen palkin näytöltä*/
        <LinearGradient
          colors={['#b33939', '#4B0082']}
          style={styles.container}
        > 
        
        <LinearGradient
                colors={['#AA4120', '#691010',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.player}
              >  
               <Text style={styles.time}>1234567890</Text>                
          </LinearGradient> 
                
          <LinearGradient
                colors={['#AA4120', '#691010',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.myCoins}
              >  
               <Text style={styles.time}>1234567890</Text>                
          </LinearGradient> 

          <LinearGradient
                colors={['#DC8828', '#FAD36A',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.coinShop}
              >                  
              <Text style={styles.title}>Coinshop </Text>
          </LinearGradient>  

   

          <LinearGradient
                colors={['#DC8828', '#FAD36A',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.yellow}
              >                  
          </LinearGradient>
          
          <LinearGradient
                colors={['#AA4120', '#691010',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.timeBoard}
              >  
               <Text style={styles.time}>8h 49min </Text>                
          </LinearGradient>   

          <LinearGradient
                colors={['#DC8828', '#FAD36A',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.dailyCoins}
              >                  
              <Text style={styles.daily}>Daily Coins</Text>
              <TouchableOpacity
              onPress={() => navigation.navigate('Coinshop')}
              style={{ width: '20%', left: 150,

              }}
              >
              <LinearGradient
                colors={['#DC8828', '#FAD36A',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.dailyCoinsButton}
                >             
                <Text style={styles.buttonText}></Text>            
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>   


   <View style={styles.coinBoard}>

    <View style={styles.form}>
        <LinearGradient
                colors={['#FFC0C0', '#FF7E7E', '#FF0000',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.buyingCoins}
              >                  
          
              <Image
              source={require('../assets/kolikko1.png')}
              style={styles.moneyIcon}
              />
              <Text style={styles.amount}>1000</Text>
              <TouchableOpacity
              onPress={() => navigation.navigate('Coinshop')}
              style={{ width: '40%', left:48}}
            >
              <LinearGradient
                colors={['#2EA944', '#68E74F',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
                >             
                <Text style={styles.buttonText}>0,99€</Text>            
              </LinearGradient>
            </TouchableOpacity>
        </LinearGradient> 

        <LinearGradient
                colors={['#FFC0C0', '#FF7E7E', '#FF0000',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.buyingCoins}
              >                  
          
              <Image
              source={require('../assets/kolikko2.png')}
              style={styles.moneyIcon}
              />
              <Text style={styles.amount}>3000</Text>
              <TouchableOpacity
              onPress={() => navigation.navigate('Coinshop')}
              style={{ width: '40%', left:48}}
               >
              <LinearGradient
                colors={['#2EA944', '#68E74F',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
                >             
                <Text style={styles.buttonText}>1,99€</Text>            
              </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
               colors={['#FFC0C0', '#FF7E7E', '#FF0000',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.buyingCoins}
              >                  
          
              <Image
              source={require('../assets/kolikko3.png')}
              style={styles.moneyIcon}
              />
              <Text style={styles.amount}>7000</Text>
              <TouchableOpacity
              onPress={() => navigation.navigate('Coinshop')}
              style={{ width: '40%', left:48}}
               >
               <LinearGradient
                colors={['#2EA944', '#68E74F',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
                >             
                <Text style={styles.buttonText}>4,99€</Text>            
              </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
                colors={['#FFC0C0', '#FF7E7E', '#FF0000',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.buyingCoins}
              >                  
          
              <Image
              source={require('../assets/kolikko4.png')}
              style={styles.moneyIcon}
              />
              <Text style={styles.amount}>15000</Text>
              <TouchableOpacity
              onPress={() => navigation.navigate('Coinshop')}
              style={{ width: '40%', left:48}}
                >
                <LinearGradient
                colors={['#2EA944', '#68E74F',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
                >             
                <Text style={styles.buttonText}>9,99€</Text>            
              </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
                colors={['#FFC0C0', '#FF7E7E', '#FF0000',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.buyingCoins}
              >                  
          
              <Image
              source={require('../assets/kolikko5.png')}
              style={styles.moneyIcon}
              />
              <Text style={styles.amount}>40000</Text>
              <TouchableOpacity
              onPress={() => navigation.navigate('Coinshop')}
              style={{ width: '40%', left:48}}
              >
                <LinearGradient
                colors={['#2EA944', '#68E74F',]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.button}
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

  player: {     
    padding: 10, 
    height: 45,
    width: '40%',
    top: 50,
    borderRadius: 20,
    right: 100,
  }, 
  
  myCoins: {     
    padding: 10, 
    height: 45,
    width: '40%',
    top: 5,
    borderRadius: 20,
    left: 60,
  }, 

  coinShop: {
    backgroundColor: ('#DC8828', '#E5A03D', '#FAD36A' ), 
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    height: 65,
    width: '60%',
    top: 70,

  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textShadowColor: '#000000', 
    textShadowOffset: { width: -4, height: 2 }, 
    textShadowRadius: 1, 
    left: 36,  
  },

  timeBoard: {     
    padding: 10, 
    height: 45,
    width: '40%',
    top: 10,
    borderRadius: 20,
  },
  
 time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textShadowColor: '#000000', 
    textShadowOffset: { width: -4, height: 2 }, 
    textShadowRadius: 1, 
    left: 46,  
  },
  
  yellow: {  
    padding: 10,
    marginBottom: 20,
    height: 35,
    width: '100%',
    top: 40,
  },

  dailyCoins: {
    backgroundColor: ('#DC8828', '#E5A03D', '#FAD36A'), 
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    height: 65,
    width: '92%',
    top: 25,
  }, 
  
  daily: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textShadowColor: '#000000', 
    textShadowOffset: { width: -4, height: 2 }, 
    textShadowRadius: 1, 
    left: 36, 
  },

  dailyCoinsButton: {
    width: '180%',
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#DC8828',
    left: 60,
    borderRadius: 10,
    bottom: 55,
    height: 45,
  
  }, 

  coinBoard: {
    backgroundColor: ('#54022A'), 
    width: '92%',
    height: 400,
    top: 25,
    borderRadius: 20,
  },

  form: {
    width: '65%',
  },
     
    buyingCoins: {
     backgroundColor: ('#FFC0C0', '#FF7E7E' ), 
     padding: 10,
     borderRadius: 10,
     marginBottom: 20,
     height: 55,
     width: '125%',
     top: 30,
     left:13,
  },
    amount: {
     color: '#ffffff',
     fontSize: 16,
     left: 110,
     top: 10,
     textShadowColor: '#000000',
     textShadowOffset: { width: -1, height: 1 },
     textShadowRadius: 1,
  },


  button: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#8a2be2',
    left: 162,
    borderRadius: 10,
    bottom: 42,
    height: 56,
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

  moneyIcon: {
    width: 34,
    height: 34,
    position: 'absolute',
    top: 15,
    left: 10,
  },

});