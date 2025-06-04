import { toast } from "react-toastify";

export function notify(message: string): void {
  toast(message);
}
