import type { SongFirebaseDocInterface } from './SongFirebaseDocInterface';

export interface SongsStoreInterface {
  songs: SongFirebaseDocInterface[];
  userSongs: SongFirebaseDocInterface[];
  song: SongFirebaseDocInterface | null;
  loading: boolean;
  scrolling: boolean;
  unsavedChanges: boolean;
  error: unknown;
}
