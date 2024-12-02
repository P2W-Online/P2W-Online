import { collection, query, orderBy, limit, getDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firebase_db } from './firebase';

// Funktio hakee parhaat käyttäjien pisteet Firestoresta
export const getTopScores = async (limitCount = 10) => {
  try {
    // Määritetään kysely, joka järjestää käyttäjät pisteiden mukaan laskevassa järjestyksessä ja rajaa tulokset
    const q = query(
      collection(firebase_db, 'users'),
      orderBy('score', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q); // Haetaan kyselyn tulokset
    const scores = [];

    // Käydään läpi kaikki tulokset ja tallennetaan käyttäjätiedot
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      scores.push({
        id: doc.id,
        email: userData.email,
        username: userData.username || "Username not found",
        score: userData.score
      });
    });

    return scores;
  } catch (error) {
    console.error('Error getting scores:', error);
    throw error;
  }
};

// Funktio päivittää käyttäjän pisteet Firestoressa
export const updateUserScore = async (userId, newScore) => {
  try {
    const userRef = doc(firebase_db, 'users', userId);
    await updateDoc(userRef, {
      score: newScore
    });
  } catch (error) {
    console.error('Error updating score:', error);
    throw error;
  }
};

export const getUserData = async (userId) => {
  console.log("Haetaan käyttäjän data...", userId)
  const docRef = doc(firebase_db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data()
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}


export const buyLootBox = async (userId, userData, lootbox, amount, newCoinsValue) => {

  let newBoxes = {}
  if(userData.inventory !== undefined){
    if(userData.inventory[lootbox] !== undefined){ 
      userData.inventory[lootbox] = userData.inventory[lootbox] + amount
    } else {
      newBoxes[lootbox] = amount
    }
  } else {
    newBoxes[lootbox] = amount
  } 

  let boxes = {...userData.inventory, ...newBoxes}
  
  try {
    const userRef = doc(firebase_db, 'users', userId);
    await updateDoc(userRef, {
      coins: newCoinsValue,
      inventory: boxes,
    });
  } catch (error) {
    console.error('Error buying lootbox:', error);
    throw error;
  }  

  return("success")
}

export const claimFreeLootbox = async (userId, userData, date) => {
  try {
    const userRef = doc(firebase_db, 'users', userId);
    await updateDoc(userRef, {
      freeLootboxTimer: date
    });
    await buyLootBox(userId, userData, 'Basic', 1, userData.coins)
  } catch (error) {
    console.error('Error claiming free lootbox:', error);
    throw error;
  }

  return("success")
}