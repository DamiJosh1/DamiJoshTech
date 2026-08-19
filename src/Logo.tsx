import React from 'react';

export default function Logo({ className = "", size = "default", isDarkMode = true }: { className?: string, size?: "sm" | "default" | "lg", isDarkMode?: boolean }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    default: "w-10 h-10",
    lg: "w-16 h-16"
  };

  // Normal, solid color (Tailwind blue-400 for dark mode, blue-600 for light mode)
  const color = isDarkMode ? "#60A5FA" : "#2563EB"; 
  const bgColor = isDarkMode ? "#18181B" : "#F8FAFC";

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full">
        {/* Monitor / TV / Appliance */}
        <path d="M2 7C2 5.89543 2.89543 5 4 5H16C17.1046 5 18 5.89543 18 7V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V7Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
        <path d="M10 17V20M7 20H13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Smartphone */}
        <rect x="14" y="9" width="8" height="13" rx="2" fill={color} />
        <circle cx="18" cy="19" r="1" fill={bgColor} />
      </svg>
    </div>
  );
}
