import type { SongFirebaseDocInterface } from './SongFirebaseDocInterface';

export interface MusicPlayer {
  isPlaying: boolean;
  song: SongFirebaseDocInterface | null;
}
