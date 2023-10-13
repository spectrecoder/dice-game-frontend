import React from "react";

const PreloaderComponent = () => {
  return (
    <div className="loader-wrapper" id="loader-wrapper">
      <svg viewBox=" 0 0 512 512" id="loader">
        <linearGradient id="loaderLinearColors" x1="0" y1="0" x2="1" y2="1">
          <stop offset="5%" stopColor="#28bcfd"></stop>
          <stop offset="100%" stopColor="#1d78ff"></stop>
        </linearGradient>
        <g>
          <circle
            cx="256"
            cy="256"
            r="150"
            fill="none"
            stroke="url(#loaderLinearColors)"
          />
        </g>
        <g>
          <circle
            cx="256"
            cy="256"
            r="125"
            fill="none"
            stroke="url(#loaderLinearColors)"
          />
        </g>
        <g>
          <circle
            cx="256"
            cy="256"
            r="100"
            fill="none"
            stroke="url(#loaderLinearColors)"
          />
        </g>
        <g>
          <circle
            cx="256"
            cy="256"
            r="75"
            fill="none"
            stroke="url(#loaderLinearColors)"
          />
        </g>
        <circle
          cx="256"
          cy="256"
          r="60"
          fill="url(#loaderImage)"
          stroke="none"
          strokeWidth="0"
        />

        {/* Change the preloader logo here */}
        <defs>
          <pattern
            id="loaderImage"
            height="100%"
            width="100%"
            patternContentUnits="objectBoundingBox"
          >
            <image
              href="theme-assets/images/dice.png"
              preserveAspectRatio="none"
              width="1"
              height="1"
            ></image>
          </pattern>
        </defs>
      </svg>

      <div className="loader-section section-left"></div>
      <div className="loader-section section-right"></div>
    </div>
  );
};

export default PreloaderComponent;
