const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, updateDoc, doc } = require('firebase/firestore');

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

async function grantLabAdmin() {
    const email = process.argv[2];
    const labNamePart = process.argv[3];

    if (!email || !labNamePart) {
        console.error('Usage: node scripts/grant-lab-admin.js <email> <lab_name_part>');
        process.exit(1);
    }

    console.log(`🔍 Looking for user: ${email}...`);

    try {
        // 1. Find User
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const userSnap = await getDocs(q);

        if (userSnap.empty) {
            console.error('❌ User not found!');
            process.exit(1);
        }

        const userDoc = userSnap.docs[0];
        console.log(`✅ Found user: ${userDoc.data().firstName} ${userDoc.data().lastName} (${userDoc.id})`);

        // 2. Find Lab
        console.log(`🔍 Looking for lab matching: "${labNamePart}"...`);
        const labsRef = collection(db, 'labs');
        const labsSnap = await getDocs(labsRef);

        const lab = labsSnap.docs.find(doc =>
            doc.data().name.toLowerCase().includes(labNamePart.toLowerCase())
        );

        if (!lab) {
            console.error('❌ Lab not found!');
            process.exit(1);
        }

        console.log(`✅ Found lab: ${lab.data().name} (${lab.id})`);

        // 3. Update User
        await updateDoc(doc(db, 'users', userDoc.id), {
            role: 'lab_admin',
            labId: lab.id
        });

        console.log(`\n🎉 Successfully promoted ${email} to Lab Admin for ${lab.data().name}!`);
        console.log('👉 You can now log in and access the Lab Terminal.');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit();
    }
}

grantLabAdmin();
