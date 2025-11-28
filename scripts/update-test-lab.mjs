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
    const testLabData = testLabDoc.data();

    console.log("Found Test Lab:");
    console.log("ID:", testLabDoc.id);
    console.log("Current data:", testLabData);

    // Update with proper location data
    console.log("\nUpdating Test Lab with location data...");
    await updateDoc(doc(db, 'labs', testLabDoc.id), {
        state: "FCT - Abuja",
        city: "Garki",
        latitude: 9.0579,
        longitude: 7.4951,
        phone: "+234 800 TEST LAB",
        email: "testlab@gmail.com"
    });

    console.log("Test Lab updated successfully!");
    process.exit(0);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
