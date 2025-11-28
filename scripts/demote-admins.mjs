import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc, deleteField } from 'firebase/firestore';

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
    const emails = ['josiokeke@gmail.com', 'osiokekeu@gmail.com'];

    for (const email of emails) {
        console.log(`Processing ${email}...`);
        const q = query(collection(db, 'users'), where('email', '==', email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log(`User ${email} not found.`);
            continue;
        }

        const userDoc = snapshot.docs[0];
        console.log(`Found user ${email} (ID: ${userDoc.id}). Demoting...`);

        await updateDoc(doc(db, 'users', userDoc.id), {
            role: 'user',
            labId: deleteField()
        });
        console.log(`User ${email} demoted to 'user'.`);
    }

    console.log("Done.");
    process.exit(0);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
