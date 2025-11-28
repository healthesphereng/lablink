'use client';

import { useState } from 'react';
import { seedLabs } from '@/utils/seed-labs';

export default function SeedPage() {
    const [status, setStatus] = useState<string>('Idle');
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        setLoading(true);
        setStatus('Seeding...');
        try {
            const result = await seedLabs();
            setStatus(result.message);
        } catch (error: any) {
            setStatus(`Error: ${error.message || 'Unknown error'}`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Database Seeder</h1>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="mb-4 text-gray-600">Click below to populate Firestore with sample Labs.</p>
                <button
                    onClick={handleSeed}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Seeding...' : 'Seed Labs'}
                </button>
                <p className="mt-4 font-mono text-sm text-red-600">{status}</p>
            </div>
        </div>
    );
}
