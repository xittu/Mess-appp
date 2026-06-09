export interface MessNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "danger";
  timestamp: number;
}

/**
 * Dispatches a real-time in-app notification.
 */
export async function sendNotification(
  messId: string,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "danger" = "info"
) {
  // Offline notifications, handled strictly via React States now.
  // We no longer rely on external Firebase Sync for transient notices.
}
