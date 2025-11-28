const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDFwFQdIaKKKaUJLHYfVVBJYxRjNlSNqJo",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-109280062-71202.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-109280062-71202",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-109280062-71202.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "109280062",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:109280062:web:71202"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Base prices for common tests (in Naira)
const basePrices = {
    'fbc': 4000,
    'malaria-test': 3000,
    'widal': 3500,
    'urinalysis': 2000,
    'fbs': 2500,
    'lipid-profile': 8000,
    'lft': 9000,
    'kft': 9000,
    'hiv-screening': 3000,
    'hbsag': 3000,
    'covid-pcr': 45000,
    'pregnancy-urine': 1500,
    'blood-group': 2000,
    'genotype': 3000,
    'stool-mcs': 4000,
    'urine-mcs': 4000,
    'thyroid-panel': 15000,
    'psa': 8000,
    'hba1c': 6000,
    'pt-inr': 5000
};

const defaultPrice = 5000;

async function assignTestsToLabs() {
    console.log('Starting to assign tests to labs...');

    try {
        // 1. Fetch all tests
        const testsSnapshot = await getDocs(collection(db, 'labTests'));
        const allTests = testsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Found ${allTests.length} tests available.`);

        // 2. Fetch all labs
        const labsSnapshot = await getDocs(collection(db, 'labs'));
        const labs = labsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`Found ${labs.length} labs.`);

        // 3. Assign tests to each lab
        for (const lab of labs) {
            // Randomly decide how many tests this lab offers (between 20 and all)
            const numTests = Math.floor(Math.random() * (allTests.length - 20 + 1)) + 20;

            // Shuffle tests and pick first N
            const shuffledTests = [...allTests].sort(() => 0.5 - Math.random());
            const selectedTests = shuffledTests.slice(0, numTests);

            // Create availableTestIds array
            const availableTestIds = selectedTests.map(t => t.id);

            // Create tests array with prices
            const labTests = selectedTests.map(test => {
                const basePrice = basePrices[test.id] || defaultPrice;
                // Randomize price by +/- 20%
                const variance = (Math.random() * 0.4) - 0.2;
                const price = Math.round((basePrice * (1 + variance)) / 100) * 100; // Round to nearest 100

                return {
                    testId: test.id,
                    name: test.name,
                    price: price,
                    description: test.description
                };
            });

            // Update lab document
            const labRef = doc(db, 'labs', lab.id);
            await updateDoc(labRef, {
                availableTestIds: availableTestIds,
                tests: labTests
            });

            console.log(`✓ Updated ${lab.name} with ${numTests} tests`);
        }

        console.log('\n✅ Successfully assigned tests to all labs!');

    } catch (error) {
        console.error('❌ Error assigning tests:', error);
    } finally {
        process.exit();
    }
}

assignTestsToLabs();
