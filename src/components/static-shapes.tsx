export function StaticShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Red square - bottom left */}
      <div className="absolute -bottom-32 -left-32 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] transform rotate-45 -translate-x-20 translate-y-20">
        <div className="w-full h-full bg-transparent relative">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="maskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="30%" stopColor="white" stopOpacity="0.2" />
                <stop offset="60%" stopColor="white" stopOpacity="0.6" />
                <stop offset="100%" stopColor="white" stopOpacity="1" />
              </linearGradient>
              <mask id="fadeMask">
                <rect width="100" height="100" fill="url(#maskGradient)" />
              </mask>
              <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="1" fill="#EF4444" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#dots)" mask="url(#fadeMask)" />
          </svg>
        </div>
      </div>

      {/* Yellow wavy line - top center/right */}
      <div className="absolute top-0 right-0 w-1/2 h-1/3">
        <svg
          className="w-full h-full"
          viewBox="0 0 300 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 80 Q100 40 150 80 T250 80"
            stroke="#F59E0B"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>

      {/* Blue circle - bottom right */}
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] transform rotate-45 translate-x-1/2 translate-y-1/2">
        <div className="w-full h-full bg-blue-500 rounded-full opacity-30"></div>
      </div>
    </div>
  );
}
