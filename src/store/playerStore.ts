import { defineStore, acceptHMRUpdate } from 'pinia';
import type { MusicPlayer } from '../interfaces/MusicPlayer';

export const useMusicPlayerStore = defineStore({
  id: 'music-player',
  state: (): MusicPlayer => ({
    isPlaying: false,
    song: null,
  }),
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMusicPlayerStore, import.meta.hot));
}
