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

    readCollectionData(path, filters) {
        let ref = FirestoreService.instance;

        for (const segment of path) {
            if (segment.type === 'col') ref = ref.collection(segment.name);
            else if (segment.type === 'doc') ref = ref.doc(segment.name);
            else throw new Error('Invalid path structure');
        }

        for (const filter of filters) {
            ref = ref.where(filter.field, filter.operator, filter.value);
        }

        return ref.get();
    }

    addDocument(path, data) {
        let ref = FirestoreService.instance;

        for (const segment of path) {
            if (segment.type === 'col') ref = ref.collection(segment.name);
            else if (segment.type === 'doc') ref = ref.doc(segment.name);
            else throw new Error('Invalid path structure');
        }

        return ref.add(data);
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

