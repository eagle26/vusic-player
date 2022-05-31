// Firebase Methods
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  addDoc,
  deleteDoc,
  startAfter,
  orderBy,
  limit,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage';

// Interfaces
import type { UserDataInterface } from '../interfaces/UserDataInterface';
import type { UserLoginInterface } from '../interfaces/UserLoginInterface';
import type { UserRegistrationInterface } from '../interfaces/UserRegistrationInterface';
import type { SongInterface } from '../interfaces/SongInterface';
import type { SongEditionInterface } from '../interfaces/SongEditionInterface';
import type { SongFirebaseDocInterface } from '../interfaces/SongFirebaseDocInterface';
import type { IComment, ICommentFirebase } from '../interfaces/IComment';

//Firebase TS types
import type { FAuth, FStore, FDatabase, FUtils } from '../Types';

// Initialize Firebase and its modules
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

//Data persistence
await enableIndexedDbPersistence(db).catch((e: FUtils.FirebaseError) => {
  throw e;
  // console.error(`Firebase Cache Error: ${e.code}`)
});

/**
 * Firebase wrapper to implement the authentication actions
 */
class firebaseWrapper {
  private _appInit: boolean = false;

  /**
   * It registers a user with an email and password
   * @param email
   * @param password
   */
  static async #_register(
    email: string,
    password: string
  ): Promise<FAuth.UserCredential> {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  /**
   * It stores the user data into a collection and assign a document ID that matches with the user UID.
   * @param data
   * @param document
   */
  static async #_addUserData(
    data: UserDataInterface,
    document: string
  ): Promise<void> {
    await setDoc(doc(db, 'users', document), data);
  }

  /**
   * It monitors if authentication status has changed or not
   * @param callback
   */
  onAuthChange(callback: () => void): void {
    onAuthStateChanged(auth, () => {
      if (!this._appInit) {
        // console.log('Monitoring: The Firebase has started correctly');
        this._appInit = true;
        callback();
      }
    });
  }

  /**
   * Signup a new user to firebase
   * @param user
   */
  async singUp(user: UserRegistrationInterface): Promise<void> {
    //Register the user
    const UserCredential = await firebaseWrapper.#_register(
      user.email,
      user.password
    );

    //Get the document ID to associate the user with the data
    const docID = UserCredential.user.uid;

    //Store the user data
    await firebaseWrapper.#_addUserData(
      {
        name: user.name,
        email: user.email,
        age: user.age,
        country: user.country,
      },
      docID
    );

    //Update the user's display name
    await updateProfile(UserCredential.user, {
      displayName: user.name,
    });
  }

  /**
   * It authenticates a user
   * @param data
   */
  async signIn(data: UserLoginInterface): Promise<FAuth.UserCredential> {
    return await signInWithEmailAndPassword(auth, data.email, data.password);
  }

  /**
   * It ends up a user's session
   */
  async signOut(): Promise<void> {
    await signOut(auth);
  }

  /**
   * it gets the information of the current logged-in user
   */
  getCurrentUser(): FAuth.User | null {
    return auth.currentUser;
  }

  /**
   * It uploads a file to the firebase storage
   * @param file
   * @param path
   */
  upload(file: File, path: string): FStore.UploadTask {
    const storageRef = ref(storage); //ztm-music-app-vue.appspot.com
    const songsRef = ref(storageRef, `${path}/${file.name}`); // ztm-music-app-vue.appspot.com/songs/song.mp3

    return uploadBytesResumable(songsRef, file);
  }

  /**
   * It saves the info of a specific song
   * @param data
   */
  async putSongInfo(data: SongInterface): Promise<void> {
    const songsCollection = collection(db, 'songs');
    await addDoc(songsCollection, data);
  }

  async getSongsFilteredByUser(
    uid: string
  ): Promise<SongFirebaseDocInterface[]> {
    const songs: SongFirebaseDocInterface[] = [];

    const songsCollection = collection(db, 'songs');
    const q = query(songsCollection, where('uid', '==', uid));
    const qSnapshot = await getDocs(q);

    qSnapshot.forEach((doc) => {
      songs.push({
        docId: doc.id,
        ...(doc.data() as SongInterface),
      });
    });

    return songs;
  }

  /**
   * It gets the full list of songs
   */
  async getSongs(
    maxPerPage: number,
    lastItem: FDatabase.DocumentSnapshot | null
  ): Promise<SongFirebaseDocInterface[]> {
    const songsCollection = collection(db, 'songs');
    let q = query(songsCollection, orderBy('modified_name'), limit(maxPerPage));

    if (lastItem) {
      q = query(
        songsCollection,
        orderBy('modified_name'),
        startAfter(lastItem),
        limit(maxPerPage)
      );
    }

    const qSnapshot = await getDocs(q);
    const songs: SongFirebaseDocInterface[] = [];

    qSnapshot.forEach((doc) => {
      songs.push({
        docId: doc.id,
        ...(doc.data() as SongInterface),
      });
    });

    return songs;
  }

  /**
   * It gets a single song
   * @param docID
   */
  async getSong(
    docID: string
  ): Promise<FDatabase.DocumentSnapshot<FDatabase.DocumentData>> {
    const docRef = doc(db, 'songs', docID);
    return await getDoc(docRef);
  }

  /**
   * It updates a song data
   * @param data
   * @param docID
   */
  async updateSong(data: SongEditionInterface, docID: string): Promise<void> {
    const docReference = doc(db, 'songs', docID);
    await setDoc(docReference, data, { merge: true });
  }

  /**
   * It removes an existing song
   * @param song
   */
  async removeSong(song: SongFirebaseDocInterface): Promise<void> {
    const storageRef = ref(storage);
    const songsRef = ref(storageRef, `songs/${song.original_name}`);

    //Delete song file
    await deleteObject(songsRef);

    //Delete song info
    const docReference = doc(db, 'songs', song.docId);
    await deleteDoc(docReference);
  }

  /**
   * Store commend for a specific comment.
   * @param data
   */
  async addSongComment(data: IComment) {
    const commentsCollection = collection(db, 'comments');
    return await addDoc(commentsCollection, data);
  }

  /**
   * Get the list of comments that belongs to a specific song
   * @param songID
   */
  async getSongComments(songID: string): Promise<ICommentFirebase[]> {
    const comments: ICommentFirebase[] = [];

    const q = query(collection(db, 'comments'), where('songID', '==', songID));
    const qSnapshot = await getDocs(q);

    qSnapshot.forEach((doc) => {
      comments.push({
        docID: doc.id,
        ...(doc.data() as IComment),
      });
    });

    return comments;
  }

  async getFileURL(ref: FStore.StorageReference): Promise<string> {
    return await getDownloadURL(ref);
  }
}

export default new firebaseWrapper();
