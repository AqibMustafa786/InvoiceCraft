import { useUserAuth } from '@/context/auth-provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { getCollectionPath } from '@/lib/data-helper';
import { collection, getFirestore } from 'firebase/firestore';
import { useMemo } from 'react';
import { getFirebase } from '@/firebase';

export function useDynamicCollection<T = any>(collectionName: string) {
    const { user, userProfile, isLoading: authLoading } = useUserAuth();
    const { firestore } = getFirebase();

    const path = useMemo(() => {
        if (authLoading || !user || !userProfile) return null;
        return getCollectionPath({ ...userProfile, uid: user.uid }, collectionName);
    }, [user, userProfile, authLoading, collectionName]);

    const query = useMemo(() => {
        if (!path || !firestore) return null;
        return collection(firestore, path);
    }, [path, firestore]);

    const result = useCollection<T>(query);

    return {
        ...result,
        isLoading: result.isLoading || authLoading // Combine auth loading with data loading
    };
}
