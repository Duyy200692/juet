
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

// Cấu hình Firebase - Bạn hãy thay bằng thông số từ Firebase Console của mình
// Hướng dẫn: Firebase Console -> Project Settings -> General -> Your Apps
const firebaseConfig = {
  apiKey: "AIzaSyB1zWd7gDTdoBWhoQ1n0TOTOM9j_gECWZQ",
  authDomain: "juet-9b1a7.firebaseapp.com",
  projectId: "juet-9b1a7",
  storageBucket: "juet-9b1a7.firebasestorage.app",
  messagingSenderId: "698856191104",
  appId: "1:698856191104:web:60cce4e3d407f87be96265"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const productsCol = collection(db, "products");
