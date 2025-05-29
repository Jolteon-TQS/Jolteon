import { ToastContainer, toast } from 'react-toastify';
  
export function notify(message: String): void {
    toast(message);
}