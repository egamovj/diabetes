import { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    Timestamp,
    type QuerySnapshot,
    type DocumentData
} from 'firebase/firestore';

export interface HealthEntry {
    id?: string;
    userId: string;
    timestamp: Date;
    type: 'glucose' | 'symptom' | 'meal';
    [key: string]: any;
}

export function useHealthData(type: HealthEntry['type']) {
    const [data, setData] = useState<HealthEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) {
            setData([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'health_data'),
            where('userId', '==', user.uid),
            where('type', '==', type),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
            const entries = snapshot.docs.map(doc => {
                const docData = doc.data();
                return {
                    id: doc.id,
                    ...docData,
                    timestamp: (docData.timestamp as Timestamp).toDate()
                };
            }) as HealthEntry[];
            setData(entries);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, type, db]);

    const addEntry = async (entryData: any) => {
        if (!user) return;

        await addDoc(collection(db, 'health_data'), {
            ...entryData,
            userId: user.uid,
            type,
            timestamp: Timestamp.now()
        });
    };

    return { data, loading, addEntry };
}
