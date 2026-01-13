
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

// Cấu hình Firebase - Bạn hãy thay bằng thông số từ Firebase Console của mình
// Hướng dẫn: Firebase Console -> Project Settings -> General -> Your Apps
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "flora-ai-app.firebaseapp.com",
  projectId: "flora-ai-app",
  storageBucket: "flora-ai-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const productsCol = collection(db, "products");
