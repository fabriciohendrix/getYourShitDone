import { useId } from "react";

type BrandLogoProps = {
  className?: string;
  title?: string;
};

const BrandLogo = ({
  className,
  title = "getYourShitDone",
}: BrandLogoProps) => {
  const id = useId();
  const filter0 = `brand-logo-filter0-${id}`;
  const filter1 = `brand-logo-filter1-${id}`;
  const clip0 = `brand-logo-clip0-${id}`;
  const paint0 = `brand-logo-paint0-${id}`;
  const paint1 = `brand-logo-paint1-${id}`;
  const paint2 = `brand-logo-paint2-${id}`;

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <g filter={`url(#${filter0})`}>
        <g clipPath={`url(#${clip0})`}>
          <rect width="48" height="48" rx="12" fill="#5B21B6" />
          <rect width="48" height="48" fill={`url(#${paint0})`} />
          <g filter={`url(#${filter1})`}>
            <path
              opacity="0.6"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.0833 9.75C12.5855 9.75 9.75 12.5855 9.75 16.0833V31.9167C9.75 35.4145 12.5855 38.25 16.0833 38.25H31.9167C35.4145 38.25 38.25 35.4145 38.25 31.9167V16.0833C38.25 12.5855 35.4145 9.75 31.9167 9.75H16.0833ZM16.0833 13.7083C14.7717 13.7083 13.7083 14.7717 13.7083 16.0833V31.9167C13.7083 33.2283 14.7717 34.2917 16.0833 34.2917H21.625C22.9367 34.2917 24 33.2283 24 31.9167V16.0833C24 14.7717 22.9367 13.7083 21.625 13.7083H16.0833Z"
              fill={`url(#${paint1})`}
            />
          </g>
        </g>
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="11"
          stroke={`url(#${paint2})`}
          strokeWidth="2"
        />
      </g>
      <defs>
        <filter
          id={filter0}
          x="0"
          y="-3"
          width="48"
          height="54"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-3" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow"
            result="effect2_innerShadow"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1"
            operator="erode"
            in="SourceAlpha"
            result="effect3_innerShadow"
          />
          <feOffset />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_innerShadow"
            result="effect3_innerShadowFinal"
          />
        </filter>
        <filter
          id={filter1}
          x="6.75"
          y="4.25"
          width="34.5"
          height="44"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1.5"
            operator="erode"
            in="SourceAlpha"
            result="effect1_dropShadow"
          />
          <feOffset dy="2.25" />
          <feGaussianBlur stdDeviation="2.25" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
        <linearGradient
          id={paint0}
          x1="24"
          y1="0"
          x2="26"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient
          id={paint1}
          x1="24"
          y1="9.75"
          x2="24"
          y2="38.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.8" />
          <stop offset="1" stopColor="white" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient
          id={paint2}
          x1="24"
          y1="0"
          x2="24"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clip0}>
          <rect width="48" height="48" rx="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default BrandLogo;
