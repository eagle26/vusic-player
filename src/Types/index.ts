import * as FAuth from 'firebase/auth';
import * as FStore from 'firebase/storage';
import * as FDatabase from 'firebase/firestore';
import * as FUtils from 'firebase/app';

type Status = 'success' | 'danger' | 'info' | 'warning';

export { type Status, FAuth, FStore, FDatabase, FUtils };
