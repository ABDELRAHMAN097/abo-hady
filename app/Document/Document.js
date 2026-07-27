// Import the required Firebase functions
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Function to create or update a user document in Firestore
const createUserDocument = async (user) => {
  if (!user) return; // Check if the user object is valid

  const userRef = doc(db, "users", user.uid); // Reference to the Firestore document

  try {
    const docSnap = await getDoc(userRef); // Check if the document exists

    if (!docSnap.exists()) {
      // Create the user document if it doesn't exist
      await setDoc(userRef, {
        email: user.email,
        role: "user", // Default role
      });
      console.log("User document created!");
    } else {
      console.log("User document already exists.");
    }
  } catch (error) {
    console.error("Error creating user document:", error.message);
  }
};

// Firebase Authentication listener for changes in user state
auth.onAuthStateChanged((user) => {
  if (user) {
    createUserDocument(user); // Call the function when a user logs in
  } else {
    console.log("No user is logged in.");
  }
});

export default createUserDocument;
