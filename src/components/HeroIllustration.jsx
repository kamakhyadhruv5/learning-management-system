import React from 'react';

export default function HeroIllustration() {
  return (
    <div className="relative w-full max-w-[650px] xl:max-w-[700px] aspect-[1.25/1] flex items-center justify-end select-none">
      <svg
        viewBox="0 0 640 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain overflow-visible"
      >
        <defs>
          <radialGradient id="backdropGlow" cx="60%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#184b45" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#0f302d" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#07181E" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="mainCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#13353c" />
            <stop offset="100%" stopColor="#0a1d22" />
          </linearGradient>

          <linearGradient id="subCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f2b31" />
            <stop offset="100%" stopColor="#061519" />
          </linearGradient>

          <linearGradient id="playerFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#193640" />
            <stop offset="100%" stopColor="#10232a" />
          </linearGradient>

          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e404b" />
            <stop offset="100%" stopColor="#12272f" />
          </linearGradient>

          <linearGradient id="book1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#289b74" />
            <stop offset="40%" stopColor="#4de2bd" />
            <stop offset="100%" stopColor="#238f6b" />
          </linearGradient>

          <linearGradient id="book2Grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1c7c5c" />
            <stop offset="40%" stopColor="#30b489" />
            <stop offset="100%" stopColor="#186e51" />
          </linearGradient>

          <linearGradient id="book3Grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#125c43" />
            <stop offset="40%" stopColor="#228e69" />
            <stop offset="100%" stopColor="#0f4e39" />
          </linearGradient>

          <linearGradient id="leafGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#175445" />
            <stop offset="100%" stopColor="#4de2bd" />
          </linearGradient>

          <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#124438" />
            <stop offset="100%" stopColor="#35c89f" />
          </linearGradient>

          <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000000" floodOpacity="0.45" />
          </filter>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        <circle cx="390" cy="240" r="230" fill="url(#backdropGlow)" />

        <g opacity="0.95">
          <circle cx="450" cy="210" r="165" fill="url(#mainCircleGrad)" />
          <circle cx="320" cy="270" r="95" fill="url(#subCircleGrad)" />
        </g>

        <g transform="translate(190, 35)" filter="url(#cardShadow)">
          <rect
            x="0"
            y="0"
            width="180"
            height="118"
            rx="14"
            fill="url(#playerFrameGrad)"
            stroke="#234c59"
            strokeWidth="2"
          />
          <circle cx="16" cy="14" r="3.2" fill="#4DE2BD" />
          <circle cx="26" cy="14" r="3.2" fill="#4DE2BD" opacity="0.8" />
          <circle cx="36" cy="14" r="3.2" fill="#4DE2BD" opacity="0.8" />

          <rect
            x="13"
            y="27"
            width="154"
            height="70"
            rx="8"
            fill="url(#screenGrad)"
          />

          <circle cx="90" cy="62" r="16" fill="#4DE2BD" filter="url(#softShadow)" />
          <polygon points="86,54 98,62 86,70" fill="#10232a" />

          <rect x="13" y="103" width="154" height="4" rx="2" fill="#1c3d47" />
          <rect x="13" y="103" width="48" height="4" rx="2" fill="#4DE2BD" />
        </g>

        <g transform="translate(415, 30) rotate(-6)" filter="url(#softShadow)">
          <path
            d="M32 38C32 46 54 52 68 52C82 52 104 46 104 38V30C104 30 82 36 68 36C54 36 32 30 32 30V38Z"
            fill="#152636"
          />
          <polygon
            points="68,10 130,30 68,50 6,30"
            fill="#233a4e"
            stroke="#2e4d6a"
            strokeWidth="1.5"
          />
          <polygon
            points="68,12 126,30 68,48 10,30"
            fill="#1c3042"
          />
          <ellipse cx="68" cy="30" rx="3.5" ry="2" fill="#4DE2BD" />
          <path
            d="M68 30 Q88 42 86 65"
            stroke="#4DE2BD"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <polygon
            points="84,64 88,64 90,82 82,82"
            fill="#4DE2BD"
          />
        </g>

        <g id="bookStack" transform="translate(245, 265)">
          <g transform="translate(0, 52)" filter="url(#softShadow)">
            <rect x="0" y="0" width="170" height="25" rx="12.5" fill="url(#book3Grad)" />
            <rect
              x="30"
              y="3.5"
              width="110"
              height="18"
              rx="9"
              fill="#FFFFFF"
            />
            <text
              x="85"
              y="17"
              textAnchor="middle"
              fill="#07181E"
              fontSize="9.5"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
              letterSpacing="1.5"
            >
              GROW
            </text>
          </g>

          <g transform="translate(5, 26)" filter="url(#softShadow)">
            <rect x="0" y="0" width="162" height="25" rx="12.5" fill="url(#book2Grad)" />
            <rect
              x="26"
              y="3.5"
              width="110"
              height="18"
              rx="9"
              fill="#FFFFFF"
            />
            <text
              x="81"
              y="17"
              textAnchor="middle"
              fill="#07181E"
              fontSize="9.5"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
              letterSpacing="1.2"
            >
              PRACTICE
            </text>
          </g>

          <g transform="translate(10, 0)" filter="url(#softShadow)">
            <rect x="0" y="0" width="154" height="25" rx="12.5" fill="url(#book1Grad)" />
            <rect
              x="22"
              y="3.5"
              width="110"
              height="18"
              rx="9"
              fill="#FFFFFF"
            />
            <text
              x="77"
              y="17"
              textAnchor="middle"
              fill="#07181E"
              fontSize="9.5"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
              letterSpacing="1.5"
            >
              LEARN
            </text>
          </g>
        </g>

        <g id="student" transform="translate(255, 125)">
          <ellipse cx="80" cy="140" rx="45" ry="7" fill="#08171c" opacity="0.6" />

          <path
            d="M60 74 C55 90 52 112 52 138 L96 138 C98 112 96 90 92 74 Z"
            fill="#1b6e56"
          />

          <path
            d="M58 74 C50 80 40 90 38 100 C36 108 48 116 62 110 L62 96 Z"
            fill="#155845"
          />

          <path
            d="M90 76 C100 86 108 97 98 110 C90 116 74 117 62 112"
            stroke="#1b6e56"
            strokeWidth="13"
            strokeLinecap="round"
            fill="none"
          />

          <ellipse cx="62" cy="112" rx="6" ry="4.5" fill="#f8b48f" />
          <ellipse cx="68" cy="114" rx="6" ry="4.5" fill="#e29b76" />

          <path
            d="M52 132 C45 132 18 142 12 168 C8 185 -4 204 -8 212 C-10 216 -2 220 6 218 C16 214 26 198 30 183 C36 163 55 150 68 144 Z"
            fill="#182736"
          />

          <path
            d="M65 132 C60 140 38 150 30 175 C24 193 12 216 8 224 C6 229 14 232 22 228 C32 222 44 203 48 185 C55 163 80 150 92 138 Z"
            fill="#1f3244"
          />

          <g transform="translate(6, 216) rotate(6)">
            <path
              d="M0 8 C2 4 14 2 24 6 C30 8 36 12 40 16 C38 18 28 20 18 20 C8 20 0 16 0 8 Z"
              fill="#182736"
            />
            <rect x="-2" y="16" width="42" height="6" rx="3" fill="#E2E8F0" />
            <path d="M4 4 C6 2 10 2 12 5" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <g transform="translate(-14, 202) rotate(4)">
            <path
              d="M0 8 C2 4 14 2 24 6 C28 8 34 12 36 16 C34 18 26 20 16 20 C8 20 0 16 0 8 Z"
              fill="#131e2b"
            />
            <rect x="-2" y="16" width="38" height="5.5" rx="2.7" fill="#CBD5E1" />
            <path d="M4 4 C6 2 10 2 12 5" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          </g>

          <g transform="translate(25, 98)">
            <path d="M12 28 L58 26 L62 30 L10 32 Z" fill="#1e293b" />
            <polygon points="26,4 58,0 52,26 20,28" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <circle cx="39" cy="14" r="2.5" fill="#4DE2BD" opacity="0.9" />
          </g>

          <rect x="68" y="58" width="10" height="17" rx="4" fill="#e29b76" />
          <circle cx="73" cy="46" r="14" fill="#f8b48f" />
          <ellipse cx="64" cy="47" rx="2.5" ry="3.5" fill="#f8b48f" />
          <circle cx="74" cy="43" r="1.8" fill="#1e293b" />
          <path d="M72 38 Q75 37 78 39" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M74 48 Q78 51 81 47" stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M78 43 L81 46 L78 47" stroke="#e29b76" strokeWidth="1" strokeLinecap="round" fill="none" />

          <path
            d="M60 44 C58 35 64 27 75 27 C84 27 88 32 88 38 C88 41 84 41 82 40 C78 39 74 33 66 38 C63 40 62 44 60 44 Z"
            fill="#111827"
          />
          <path
            d="M60 42 C59 46 62 52 64 54 C63 49 63 45 64 42 Z"
            fill="#111827"
          />
        </g>

        <g id="plant" transform="translate(440, 230)">
          <ellipse cx="38" cy="170" rx="22" ry="6" fill="#061215" opacity="0.8" />

          <path
            d="M38 120 Q10 90 2 60 Q20 70 38 110 Z"
            fill="url(#leafGrad2)"
          />
          <path
            d="M38 110 Q15 60 22 15 Q38 45 40 100 Z"
            fill="url(#leafGrad1)"
          />
          <path
            d="M38 100 Q40 30 48 -10 Q58 30 42 95 Z"
            fill="url(#leafGrad1)"
          />
          <path
            d="M40 105 Q65 40 78 20 Q70 60 42 110 Z"
            fill="url(#leafGrad2)"
          />
          <path
            d="M40 115 Q75 80 82 55 Q72 90 42 120 Z"
            fill="url(#leafGrad1)"
          />

          <path d="M38 125 L38 95" stroke="#165947" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M39 125 L46 95" stroke="#165947" strokeWidth="2.5" strokeLinecap="round" />

          <polygon
            points="24,120 52,120 46,165 30,165"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1.5"
          />
          <rect x="20" y="116" width="36" height="6" rx="2" fill="#2d3c4e" />
        </g>
      </svg>
    </div>
  );
}
