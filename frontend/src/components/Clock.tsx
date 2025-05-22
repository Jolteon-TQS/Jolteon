import { useState, useEffect } from 'react';

const Clock = () => {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = value.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // set to true for 12-hour
  });

  return (
    <div className="text-sm">
      {formatted}
    </div>
  );
};

export default Clock;
