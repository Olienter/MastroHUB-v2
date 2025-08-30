import React, { useState, useEffect } from "react";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = "",
  showPercentage = false,
  animated = true,
  color = "blue",
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(displayProgress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${
            colorClasses[color]
          } rounded-full transition-all duration-1000 ease-out ${
            animated ? "transition-all duration-1000 ease-out" : ""
          }`}
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
};
