import React, { useState, useEffect } from 'react';

interface CountdownProps {
  endDate: Date;
  onComplete?: () => void;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
}

export default function Countdown({ endDate, onComplete, className = "flex items-center gap-3", itemClassName = "flex flex-col items-center justify-center bg-zinc-900 text-white rounded-lg w-12 h-12 shadow-inner", labelClassName = "text-[10px] uppercase font-bold text-zinc-500 mt-1" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +endDate - +new Date();
      
      if (difference <= 0) {
        setIsEnded(true);
        if (onComplete) onComplete();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    // Initial calc
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onComplete]);

  if (isEnded) return null;

  return (
    <div className={className}>
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center">
          <div className={itemClassName}>
            <span className="text-lg font-black tracking-tighter">{timeLeft.days}</span>
          </div>
          <span className={labelClassName}>Days</span>
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className={itemClassName}>
          <span className="text-lg font-black tracking-tighter">{timeLeft.hours.toString().padStart(2, '0')}</span>
        </div>
        <span className={labelClassName}>Hrs</span>
      </div>
      <div className="flex flex-col items-center">
        <div className={itemClassName}>
          <span className="text-lg font-black tracking-tighter">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        </div>
        <span className={labelClassName}>Min</span>
      </div>
      <div className="flex flex-col items-center">
        <div className={itemClassName}>
          <span className="text-lg font-black tracking-tighter">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        </div>
        <span className={labelClassName}>Sec</span>
      </div>
    </div>
  );
}
