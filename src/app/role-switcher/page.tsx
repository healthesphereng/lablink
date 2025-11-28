'use client';

import { useState, useEffect } from 'react';
import { useFirebase, useUser } from '@/firebase/provider';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Lab } from '@/types';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Loader2 } from 'lucide-react';

export default function RoleSwitcherPage() {
    const { firestore, user } = useFirebase();
    const { profile } = useUserProfile();
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        async function fetchLabs() {
            if (!firestore) return;
            const snapshot = await getDocs(collection(firestore, 'labs'));
            setLabs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lab)));
            setLoading(false);
        }
        fetchLabs();
    }, [firestore]);

    const assignRole = async (labId: string | null) => {
        if (!firestore || !user) return;
        setUpdating(true);
        try {
            const userRef = doc(firestore, 'users', user.uid);

            // Merge with existing data to preserve other fields
            await setDoc(userRef, {
                role: labId ? 'lab_admin' : 'user',
                labId: labId || null
            }, { merge: true });

            alert(labId ? "You are now an admin for this lab!" : "You are now a regular user.");
            window.location.reload(); // Reload to refresh profile hook
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update role.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Role Switcher (Dev Tool)</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Current Status</h2>
                <p><strong>User ID:</strong> {user?.uid}</p>
                <p><strong>Role:</strong> {profile?.role || 'user'}</p>
                <p><strong>Lab ID:</strong> {profile?.labId || 'None'}</p>
            </div>

            <div className="grid gap-6">
                <div className="bg-gray-100 p-6 rounded-lg">
                    <h3 className="font-bold mb-2">Reset to Regular User</h3>
                    <Button onClick={() => assignRole(null)} disabled={updating}>
                        {updating ? <Loader2 className="animate-spin" /> : "Become User"}
                    </Button>
                </div>

                <h2 className="text-xl font-semibold mt-4">Become Admin for a Lab</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {labs.map(lab => (
                        <div key={lab.id} className="border p-4 rounded-lg flex justify-between items-center bg-white">
                            <div>
                                <h3 className="font-bold">{lab.name}</h3>
                                <p className="text-sm text-gray-500">{lab.address}</p>
                            </div>
                            <Button
                                onClick={() => assignRole(lab.id)}
                                disabled={updating || profile?.labId === lab.id}
                                variant={profile?.labId === lab.id ? "secondary" : "default"}
                            >
                                {profile?.labId === lab.id ? "Current" : "Select"}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
