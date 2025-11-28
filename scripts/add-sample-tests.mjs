import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    "projectId": "studio-109280062-71202",
    "appId": "1:499260146109:web:f92397f06d07e5e57b92d4",
    "apiKey": "AIzaSyD-5hJro1ZVWU6Q9OKSteGsm5seeYXhOcM",
    "authDomain": "studio-109280062-71202.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": "499260146109"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
    console.log("Searching for Test Lab...");
    const q = query(collection(db, 'labs'), where('name', '==', 'Test Lab'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        console.log("Test Lab not found!");
        process.exit(1);
    }

    const testLabDoc = snapshot.docs[0];
    console.log("Found Test Lab:", testLabDoc.id);

    // Fetch available tests from labTests collection
    console.log("\nFetching available tests from catalog...");
    const labTestsSnapshot = await getDocs(collection(db, 'labTests'));
    const allTests = labTestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    console.log(`Found ${allTests.length} tests in catalog`);

    // Select 2 sample tests - Full Blood Count and HIV Screening
    const sampleTests = [
        {
            name: "Full Blood Count (FBC)",
            testId: allTests.find(t => t.name?.toLowerCase().includes('blood count'))?.id || 'fbc-test-id',
            price: 5000,
            description: "Complete blood count analysis including RBC, WBC, platelets, and hemoglobin levels"
        },
        {
            name: "HIV Screening Test",
            testId: allTests.find(t => t.name?.toLowerCase().includes('hiv'))?.id || 'hiv-test-id',
            price: 8000,
            description: "Confidential HIV antibody screening test with rapid results"
        }
    ];

    console.log("\nAdding sample tests to Test Lab:");
    sampleTests.forEach(test => {
        console.log(`- ${test.name}: ₦${test.price.toLocaleString()}`);
    });

    // Get test IDs for availableTestIds array
    const availableTestIds = sampleTests.map(t => t.testId);

    // Update Test Lab with sample tests
    await updateDoc(doc(db, 'labs', testLabDoc.id), {
        tests: sampleTests,
        availableTestIds: availableTestIds
    });

    console.log("\n✅ Test Lab updated successfully with sample tests!");
    console.log("\nTest Lab now has:");
    console.log("- Full Blood Count (FBC) - ₦5,000");
    console.log("- HIV Screening Test - ₦8,000");

    process.exit(0);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
