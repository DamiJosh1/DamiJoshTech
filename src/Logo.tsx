import React from 'react';

export default function Logo({ className = "h-8", variant = "full" }: { className?: string, variant?: "full" | "icon" }) {
  if (variant === "icon") {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M75 25H40C31.7 25 25 31.7 25 40V60C25 68.3 31.7 75 40 75H75" stroke="#0D47A1" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25 75H60C68.3 75 75 68.3 75 60V40C75 31.7 68.3 25 60 25H25" stroke="#1F2937" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  // The full logo SVG approximation
  return (
    <svg className={className} viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 25C40 25 25 35 25 50C25 65 40 70 55 75C65 78 70 82 70 90C70 105 50 110 30 110" stroke="#1F2937" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M110 110L140 25L170 110" stroke="#1F2937" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M125 75H155" stroke="#0D47A1" strokeWidth="12" strokeLinecap="round"/>
      <path d="M210 25V90C210 105 190 110 180 110" stroke="#1F2937" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="260" cy="67" r="40" stroke="#1F2937" strokeWidth="12"/>
      <path d="M310 25V110" stroke="#1F2937" strokeWidth="12" strokeLinecap="round"/>
      <path d="M310 25C340 25 360 40 360 67.5C360 95 340 110 310 110" stroke="#1F2937" strokeWidth="12" strokeLinecap="round"/>
      <path d="M400 110L430 25L460 110" stroke="#1F2937" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M415 75H445" stroke="#0D47A1" strokeWidth="12" strokeLinecap="round"/>
      <text x="245" y="145" fill="#0D47A1" fontSize="24" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" letterSpacing="0.4em" textAnchor="middle">ELECTRONICS</text>
    </svg>
  );
}
