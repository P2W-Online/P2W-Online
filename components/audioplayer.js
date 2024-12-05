import { Audio } from 'expo-av';

let sound = null;

const AudioPlayer = {
  async playMusic() {
    if (!sound) {
      sound = new Audio.Sound();
      await sound.loadAsync(require('../assets/menuMusic.mp3'));
      await sound.setIsLoopingAsync(true);
    }
    await sound.playAsync();
  },

  async stopMusic() {
    if (sound) {
      await sound.stopAsync();
    }
  },

  async setVolume(volume) {
    if (sound) {
      await sound.setVolumeAsync(volume); 
    }
  },
};

export default AudioPlayer;