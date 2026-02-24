import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useFirebase, useUser } from '@/firebase/FirebaseProvider';
import { TestResult } from '@/types';

export function useResults(limit?: number) {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    function subscribeToResults() {
      if (!user || !firestore) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const resultsRef = collection(firestore, 'results');
      const q = query(
        resultsRef,
        where('userId', '==', user.uid)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedResults = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        } as TestResult));

        // Sort client-side
        fetchedResults.sort((a, b) => {
          // Handle Timestamp objects or strings
          const dateA = a.date?.toDate ? a.date.toDate().getTime() : new Date(a.date as any).getTime();
          const dateB = b.date?.toDate ? b.date.toDate().getTime() : new Date(b.date as any).getTime();
          return dateB - dateA;
        });

        if (limit) {
          setResults(fetchedResults.slice(0, limit));
        } else {
          setResults(fetchedResults);
        }

        setLoading(false);
      }, (err) => {
        console.error("Error fetching results real-time:", err);
        setError("Failed to load results.");
        setLoading(false);
      });
    }

    subscribeToResults();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, firestore, limit]);

  return { results, loading, error };
}
