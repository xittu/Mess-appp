import { toast } from 'sonner';

export interface MessNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "danger";
  timestamp: number;
}

export async function sendNotification(
  messId: string,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "danger" = "info"
) {
  if (type === "success") {
    toast.success(title, { description: message });
  } else if (type === "danger") {
    toast.error(title, { description: message });
  } else if (type === "warning") {
    toast.warning(title, { description: message });
  } else {
    toast.info(title, { description: message });
  }
}

