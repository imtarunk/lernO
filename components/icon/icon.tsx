// Icons.tsx
const SolanaIcon = () => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 508.07 398.17"
      width="50"
      height="50"
    >
      <defs>
        <style>
          {`.cls-1{fill:url(#linear-gradient);}
              .cls-2{fill:url(#linear-gradient-2);}
              .cls-3{fill:url(#linear-gradient-3);}`}
        </style>
        <linearGradient
          id="linear-gradient"
          x1="463"
          y1="205.16"
          x2="182.39"
          y2="742.62"
          gradientTransform="translate(0 -198)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#00ffa3" />
          <stop offset="1" stopColor="#dc1fff" />
        </linearGradient>
        <linearGradient
          id="linear-gradient-2"
          x1="340.31"
          y1="141.1"
          x2="59.71"
          y2="678.57"
          xlinkHref="#linear-gradient"
        />
        <linearGradient
          id="linear-gradient-3"
          x1="401.26"
          y1="172.92"
          x2="120.66"
          y2="710.39"
          xlinkHref="#linear-gradient"
        />
      </defs>
      <path
        className="cls-1"
        d="M84.53,358.89A16.63,16.63,0,0,1,96.28,354H501.73a8.3,8.3,0,0,1,5.87,14.18l-80.09,80.09a16.61,16.61,0,0,1-11.75,4.86H10.31A8.31,8.31,0,0,1,4.43,439Z"
        transform="translate(-1.98 -55)"
      />
      <path
        className="cls-2"
        d="M84.53,59.85A17.08,17.08,0,0,1,96.28,55H501.73a8.3,8.3,0,0,1,5.87,14.18l-80.09,80.09a16.61,16.61,0,0,1-11.75,4.86H10.31A8.31,8.31,0,0,1,4.43,140Z"
        transform="translate(-1.98 -55)"
      />
      <path
        className="cls-3"
        d="M427.51,208.42a16.61,16.61,0,0,0-11.75-4.86H10.31a8.31,8.31,0,0,0-5.88,14.18l80.1,80.09a16.6,16.6,0,0,0,11.75,4.86H501.73a8.3,8.3,0,0,0,5.87-14.18Z"
        transform="translate(-1.98 -55)"
      />
    </svg>
  );
};

const EthereumIcon = () => {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 256 417"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M127.5 0L123.6 13.6V279.8L127.5 283.8L255.9 210.7L127.5 0Z"
        fill="#343434"
      />
      <path d="M127.5 0L0 210.7L127.5 283.8V154.1V0Z" fill="#8C8C8C" />
      <path
        d="M127.5 310.4L124.8 314.8V416.9L127.5 421.4L255.8 234.2L127.5 310.4Z"
        fill="#3C3C3B"
      />
      <path d="M127.5 421.4V310.4L0 234.2L127.5 421.4Z" fill="#8C8C8C" />
      <path d="M127.5 283.8L255.9 210.7L127.5 154.1V283.8Z" fill="#141414" />
      <path d="M0 210.7L127.5 283.8V154.1L0 210.7Z" fill="#393939" />
    </svg>
  );
};

const BitcoinIcon = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="24" fill="#F7931A" />
      <path
        fill="white"
        d="M31.2 20.9c.43-2.9-5.25-4.2-6.25-4.34l.13-.52-2.88-.72-.11.46s-.81-.2-.8.47c-.01.23-.02.57-.02.57l-.77 3.1s-.05.21.22.26c.11.02.24 0 .37-.01l-.76 3.06c-.06.15-.24.37-.66.28.01.02-.94.29-.94-.9 0-.47.35-.96.94-1.12l.27-1.04-.89-.22.06-.25.87-.22.23-.94-.88-.22.06-.25.88-.23.16-.67c.05-.19.21-.4.53-.48a1.28 1.28 0 011.43.63l.93 2.2c.22.52.84.34 1.05.23l.25-1.01zm-3.63 2.72c-.2.78-1.53.36-1.94.28l.35-1.44c.41.1 1.84.38 1.59 1.16zm.2-2.03c-.18.69-1.34.34-1.67.27l.33-1.34c.33.08 1.51.35 1.34 1.07z"
      />
    </svg>
  );
};

const PolygonIcon = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="24" fill="#8247E5" />
      <path d="M24 0L24 48L0 24L24 0Z" fill="#8247E5" />
    </svg>
  );
};

export { SolanaIcon, EthereumIcon, BitcoinIcon, PolygonIcon };
