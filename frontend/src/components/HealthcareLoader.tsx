import React from "react";

import "../HeartbeatLoader.css"
const HeartbeatLoader: React.FC = () => {
  return (
  <div className="ecg-loader-overlay">
      <div className="heart-rate">
        <svg
          viewBox="0 0 150 73"
          height="73px"
          width="150px"
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
        >
          <polyline
            points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
            stroke="#009B9E"
            strokeWidth={3}
            fill="none"
            strokeMiterlimit={10}
          />
        </svg>
        <div className="fade-in"></div>
        <div className="fade-out"></div>
      </div>
    </div>
  );
};

export default HeartbeatLoader;
