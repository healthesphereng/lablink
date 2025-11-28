'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase/provider';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function SetupPage() {
    const { firestore } = useFirebase();
    const [users, setUsers] = useState<any[]>([]);
    const [labs, setLabs] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedLab, setSelectedLab] = useState('');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!firestore) return;

        const fetchData = async () => {
            try {
                const usersSnap = await getDocs(collection(firestore, 'users'));
                const labsSnap = await getDocs(collection(firestore, 'labs'));

                setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                setLabs(labsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [firestore]);

    const handleAssign = async () => {
        if (!selectedUser || !selectedLab || !firestore) return;
        setProcessing(true);
        try {
            await updateDoc(doc(firestore, 'users', selectedUser), {
                role: 'lab_admin',
                labId: selectedLab
            });
            setMessage('Success! User assigned to lab.');
        } catch (err: any) {
            console.error(err);
            setMessage('Error: ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    const createTestLab = async () => {
        if (!firestore) return;
        setProcessing(true);
        try {
            const ref = await addDoc(collection(firestore, 'labs'), {
                name: "Test Lab",
                description: "A lab for testing purposes",
                address: "123 Test St",
                city: "Test City",
                rating: 5.0,
                image: "/labs/default.jpg",
                tests: []
            });
            setMessage(`Created Test Lab with ID: ${ref.id}`);
            // Refresh labs
            const labsSnap = await getDocs(collection(firestore, 'labs'));
            setLabs(labsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (err: any) {
            setMessage('Error creating lab: ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Assign Lab Admin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Select User</label>
                        <Select onValueChange={setSelectedUser} value={selectedUser}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select User" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map(u => (
                                    <SelectItem key={u.id} value={u.id}>
                                        {u.firstName} {u.lastName} ({u.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Select Lab</label>
                        <Select onValueChange={setSelectedLab} value={selectedLab}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Lab" />
                            </SelectTrigger>
                            <SelectContent>
                                {labs.map(l => (
                                    <SelectItem key={l.id} value={l.id}>
                                        {l.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleAssign} disabled={processing || !selectedUser || !selectedLab}>
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Assign Role
                    </Button>

                    {message && <p className="text-sm font-bold text-green-600">{message}</p>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" onClick={createTestLab} disabled={processing}>
                        Create "Test Lab"
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
