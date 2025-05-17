import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import config from 'config';

const dbConfig = config.get('db');

export class FirestoreService {
    static instance = null;

    constructor() {
        if (FirestoreService.instance) {
            return FirestoreService.instance;
        }

        initializeApp({
            credential: cert(dbConfig),
        });

        FirestoreService.instance = getFirestore();
    }

    readCollectionData(collection) {
        return FirestoreService.instance.collection(collection).get();
    }

    static getInstance() {
        if (!FirestoreService.instance) {
            new FirestoreService();
        }

        return FirestoreService.instance;
    }
}


const db = new FirestoreService();
export default db;

