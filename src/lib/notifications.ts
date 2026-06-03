import { collection, doc, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";

export interface MessNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "danger";
  timestamp: number;
}

/**
 * Dispatches a real-time in-app notification synced to Firebase Firestore
 */
export async function sendNotification(
  messId: string,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "danger" = "info"
) {
  const logId = "NOTIF_" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const path = `messes/${messId}/notifications/${logId}`;
  
  try {
    const notificationRef = doc(db, "messes", messId, "notifications", logId);
    await setDoc(notificationRef, {
      id: logId,
      title,
      message,
      type,
      timestamp: Date.now(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
