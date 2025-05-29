const Loader = () => {
  return (
    <div className="relative flex my-1">
      <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
        <defs xmlns="http://www.w3.org/2000/svg">
          <linearGradient
            id="b"
            x1="0"
            y1="62"
            x2="0"
            y2="2"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#973BED" />
            <stop offset="1" stop-color="#007CFF" />
          </linearGradient>
          <linearGradient
            id="c"
            x1="0"
            y1="64"
            x2="0"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FFC800" />
            <stop offset="1" stop-color="#F0F" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
              dur="8s"
              repeatCount="indefinite"
              keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
              keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
            />
          </linearGradient>
          <linearGradient
            id="d"
            x1="0"
            y1="62"
            x2="0"
            y2="2"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#00E0ED" />
            <stop offset="1" stop-color="#00DA72" />
          </linearGradient>
        </defs>
      </svg>

      {/* C */}
      <svg viewBox="0 0 64 64" width="64" height="64" className="inline-block">
        <path
          className="animate-dash"
          pathLength="360"
          stroke="url(#b)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M48,16A24,24,0,1,0,48,48"
          fill="none"
        />
      </svg>

      {/* L */}
      <svg viewBox="0 0 64 64" width="64" height="64" className="inline-block">
        <path
          className="animate-dash"
          pathLength="360"
          stroke="url(#c)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 12 V52 H48"
          fill="none"
        />
      </svg>

      {/* A */}
      <svg viewBox="0 0 64 64" width="64" height="64" className="inline-block">
        <path
          className="animate-dash"
          pathLength="360"
          stroke="url(#d)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M32 12 L12 52 H20 L26 40 H38 L44 52 H52 L32 12 Z"
          fill="none"
        />
      </svg>

      {/* Y */}
      <svg viewBox="0 0 64 64" width="64" height="64" className="inline-block">
        <path
          className="animate-dash"
          pathLength="360"
          stroke="url(#b)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 12 L32 32 L48 12 M32 32 V52"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default Loader;
