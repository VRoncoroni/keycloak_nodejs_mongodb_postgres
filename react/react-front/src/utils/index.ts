import { toast } from 'react-toastify';

const notify = (code: number, message: string) => {
    if(code === 200) {
        toast.success(message);
    } else {
        toast.error(message);
    }
  };

export {
    notify,
}