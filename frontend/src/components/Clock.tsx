import { useState, useEffect, useRef } from 'react';
import { notify } from './Notify';

const Clock = () => {
  const [value, setValue] = useState(new Date());
  const notifiedRef = useRef<{ morning: boolean; evening: boolean }>({
    morning: false,
    evening: false,
  });

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hours = value.getHours();
    const minutes = value.getMinutes();

    // Morning notification
    if (hours > 6 || (hours === 7 && minutes > 30)) {
      notifiedRef.current.morning = true;
    }
    if (hours === 6 && minutes === 30 && !notifiedRef.current.morning) {
      notify('Opening hours soon!');
      notifiedRef.current.morning = true;
    }

    // Evening notification
    if (hours > 19 || (hours === 19 && minutes > 45)) {
      notifiedRef.current.evening = true;
    }
    if (hours === 19 && minutes === 45 && !notifiedRef.current.evening) {
      notify('Closing hours soon!');
      notifiedRef.current.evening = true;
    }
  }, [value]);

  const formatted = value.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div className="text-sm">
      {formatted}
    </div>
  );
};

export default Clock;
