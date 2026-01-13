import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TempleHeader: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 11,
    hours: 23,
    minutes: 1,
    seconds: 39,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              } else {
                // Timer reached zero
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, "0");
  };

  return (
    <div className="temple-grad rounded-2xl p-8 relative overflow-hidden">
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute bg-white opacity-10 rounded-full"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="flex-1">
          <h1 className="text-white text-3xl lg:text-4xl font-normal mb-4 tracking-[8px]">
            TEMPLE OF MOON
          </h1>
          <p className="text-[#9DA4AE] text-sm mb-2">
            When U Hold Eligible Cults, U Unlock Rewards As They Ascend.{" "}
            <button className="text-blue-400 hover:text-blue-300 underline transition-colors">
              Learn More.
            </button>
          </p>

          <div className="mt-6">
            <p className="golden-text text-sm font-medium mb-3">
              Temple Of Moon Rewards
            </p>
            <div className="golden-text text-5xl font-bold mb-6">
              $1,000,000
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold min-w-[3ch] text-center">
                  {formatTime(timeLeft.days)}
                </span>
                <span className="text-sm text-purple-200 ml-1">d</span>
              </div>
              <span className="text-xl">:</span>

              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold min-w-[3ch] text-center">
                  {formatTime(timeLeft.hours)}
                </span>
                <span className="text-sm text-[#9DA4AE] ml-1">h</span>
              </div>
              <span className="text-xl">:</span>

              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold min-w-[3ch] text-center">
                  {formatTime(timeLeft.minutes)}
                </span>
                <span className="text-sm text-[#9DA4AE] ml-1">m</span>
              </div>
              <span className="text-xl">:</span>

              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold min-w-[3ch] text-center">
                  {formatTime(timeLeft.seconds)}
                </span>
                <span className="text-sm text-[#9DA4AE] ml-1">s</span>
              </div>

              <span className="text-sm text-[#9DA4AE] ml-2">
                Remaining This Period
              </span>
            </div>
          </div>
        </div>

        {/* Double Buff Doge Images */}
        <div className="flex-shrink-0 flex items-center gap-4">
          <img
            src="/images/l.png"
            alt="Buff Doge 1"
            className="w-28 h-28 lg:w-32 lg:h-32 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/doge-placeholder.png";
            }}
          />
          <img
            src="/images/l.png"
            alt="Buff Doge 2"
            className="w-24 h-24 lg:w-28 lg:h-28 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/doge-placeholder.png";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TempleHeader;
