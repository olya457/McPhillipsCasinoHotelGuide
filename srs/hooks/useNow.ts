import {useEffect, useState} from 'react';
import {AppState} from 'react-native';

export const useNow = (intervalMs = 1000) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        setNow(Date.now());
      }
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [intervalMs]);

  return now;
};
