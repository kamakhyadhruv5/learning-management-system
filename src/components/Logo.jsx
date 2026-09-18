import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center gap-3 cursor-pointer group select-none">
      <div className="relative w-9 h-8 flex items-center justify-center">
        <svg
          viewBox="0 0 36 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-9 h-8 transform transition-transform group-hover:scale-105 duration-200"
        >
          <path
            d="M17 5.5C12 3.5 5 4 2 6V26C5 24 12 23.5 17 25.5V5.5Z"
            fill="#4DE2BD"
          />
          <path
            d="M6 7C9.5 5.8 14 6.2 17 7.5V26C14 24.6 9.5 24.2 6 25.5V7Z"
            fill="#36C29F"
            opacity="0.75"
          />
          <path
            d="M19 5.5C24 3.5 31 4 34 6V26C31 24 24 23.5 19 25.5V5.5Z"
            fill="#4DE2BD"
          />
          <path
            d="M19 7.5C22 6.2 26.5 5.8 30 7V25.5C26.5 24.2 22 24.6 19 26V7.5Z"
            fill="#6EF4D2"
            opacity="0.65"
          />
          <path
            d="M18 4.5V27"
            stroke="#07181E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-2xl font-extrabold tracking-wide text-white font-sans">
        LMS
      </span>
    </div>
  );
}
