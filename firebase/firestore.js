import { collection, query, orderBy, limit, getDocs, doc, updateDoc} from 'firebase/firestore';
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
  