import { defineStore, acceptHMRUpdate } from 'pinia';
import type { SongsStoreInterface } from '../interfaces/SongsStoreInterface';
import firebase from '../includes/firebase';
import type { SongFirebaseDocInterface } from '../interfaces/SongFirebaseDocInterface';
import type { SongEditionInterface } from '../interfaces/SongEditionInterface';
import type { SongInterface } from '../interfaces/SongInterface';
import { useAuthStore } from './authStore';
import { FUtils } from '../Types';

export const useSongsStore = defineStore({
  id: 'songs',
  state: (): SongsStoreInterface => ({
    songs: [],
    userSongs: [],
    song: null,
    loading: false,
    scrolling: false,
    unsavedChanges: false,
    error: null,
  }),
  getters: {
    /**
     * it filters the list of songs per user
     * @param state
     */
    getSongsPerUser: (state) => {
      return (uid: string | undefined): SongFirebaseDocInterface[] =>
        state.songs.filter(
          (song: SongFirebaseDocInterface) => song.uid === uid
        );
    },
  },
  actions: {
    /**
     * Fetch the full list of songs uploaded by a specific user
     */
    async fetchUserSongs(): Promise<void> {
      const userStore = useAuthStore();
      const userData = userStore.userData;
      const uid = userData?.uid as string;

      try {
        this.loading = true;
        this.userSongs = await firebase.getSongsFilteredByUser(uid);
        this.loading = false;
      } catch (e) {
        if (e instanceof FUtils.FirebaseError) {
          this.error = `[${e.code}] ${e.message}`;
        }
      }
    },

    async fetchSongs(): Promise<void> {
      let lastDoc = null;
      if (this.songs.length) {
        lastDoc = await firebase.getSong(
          this.songs[this.songs.length - 1].docId
        );
        this.scrolling = true;
      } else {
        // Show loader just the first time, but no during scrolling
        this.loading = true;
      }

      try {
        const data = await firebase.getSongs(10, lastDoc);
        if (data.length) this.songs = [...this.songs, ...data];

        this.loading = false;
        this.scrolling = false;
      } catch (e) {
        if (e instanceof FUtils.FirebaseError) {
          this.error = `[${e.code}] ${e.message}`;
        }
      }
    },

    //It updates some data of a specific song
    async updateSong(data: SongEditionInterface, docID: string): Promise<void> {
      //Update Firebase
      await firebase.updateSong(data, docID);

      //Update public songs list
      const idx = this.songs.findIndex(
        (song: SongFirebaseDocInterface) => song.docId === docID
      );
      if (idx !== -1) {
        this.songs[idx].modified_name = data.modified_name;
        this.songs[idx].genre = data.genre;
      }

      //Updater user songs list
      const idx2 = this.userSongs.findIndex(
        (song: SongFirebaseDocInterface) => song.docId === docID
      );
      if (idx2 !== -1) {
        this.userSongs[idx2].modified_name = data.modified_name;
        this.userSongs[idx2].genre = data.genre;
      }
    },

    //Remove a specific song
    async removeSong(song: SongFirebaseDocInterface): Promise<void> {
      //Remove from firebase
      await firebase.removeSong(song);

      //Remove from public songs list
      this.songs = this.songs.filter(
        (item: SongFirebaseDocInterface) => item.docId !== song.docId
      );

      //Remove from user songs list
      this.userSongs = this.userSongs.filter(
        (item: SongFirebaseDocInterface) => item.docId !== song.docId
      );
    },

    // it updates the uploading status
    updateUploadingStatus(newStatus: boolean): void {
      this.unsavedChanges = newStatus;
    },

    // It gets a single song
    async getSong(docID: string): Promise<SongFirebaseDocInterface | null> {
      this.loading = true;

      try {
        const doc = await firebase.getSong(docID);

        if (doc.exists()) {
          this.song = {
            docId: doc.id,
            ...(doc.data() as SongInterface),
          };
        }

        this.loading = false;
        return this.song;
      } catch (e) {
        if (e instanceof FUtils.FirebaseError) {
          this.error = `[${e.code}] ${e.message}`;
        }
      }

      return null;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSongsStore, import.meta.hot));
}
