import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocs, collection, addDoc, updateDoc, query, where } from 'firebase/firestore';

const firebaseConfig = {
    "projectId": "studio-109280062-71202",
    "appId": "1:499260146109:web:f92397f06d07e5e57b92d4",
    "apiKey": "AIzaSyD-5hJro1ZVWU6Q9OKSteGsm5seeYXhOcM",
    "authDomain": "studio-109280062-71202.firebaseapp.com",
    "measurementId": "",
    "messagingSenderId": "499260146109"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
    const email = 'testlab@gmail.com';
    const password = 'passwordtestlab';

    let user = null;
    let uid = null;

    try {
        console.log("Creating user...");
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        user = cred.user;
        uid = user.uid;
        console.log("User created:", uid);
    } catch (e) {
        if (e.code === 'auth/email-already-in-use') {
            console.log("User already exists in Auth. Trying to sign in...");
            try {
                const cred = await signInWithEmailAndPassword(auth, email, password);
                user = cred.user;
                uid = user.uid;
                console.log("Signed in successfully:", uid);
            } catch (signinErr) {
                console.log("Could not sign in (wrong password?). Checking Firestore for existing user profile...");
                // Try to find user in Firestore by email
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where("email", "==", email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    uid = userDoc.id;
                    console.log("Found user in Firestore:", uid);
                } else {
                    console.error("User exists in Auth but NOT in Firestore, and password is wrong. Cannot proceed.");
                    process.exit(1);
                }
            }
        } else {
            throw e;
        }
    }

    if (!uid) {
        console.error("Could not obtain UID.");
        process.exit(1);
    }

    // Find or Create Lab
    console.log("Finding/Creating Lab...");
    const labsSnap = await getDocs(collection(db, 'labs'));
    let lab = labsSnap.docs.find(d => d.data().name === 'Test Lab');

    let labId;
    if (lab) {
        labId = lab.id;
        console.log("Found Test Lab:", labId);
    } else {
        const labRef = await addDoc(collection(db, 'labs'), {
            name: "Test Lab",
            description: "A lab for testing purposes",
            address: "123 Test St",
            city: "Test City",
            rating: 5.0,
            image: "/labs/default.jpg",
            tests: []
        });
        labId = labRef.id;
        console.log("Created Test Lab:", labId);
    }

    // Assign Lab to User
    console.log(`Assigning Lab ${labId} to User ${uid}...`);
    // We can update because rules are relaxed
    await setDoc(doc(db, 'users', uid), {
        id: uid,
        email: email,
        role: 'lab_admin',
        labId: labId
    }, { merge: true });

    console.log("Success! User updated.");
    process.exit(0);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
