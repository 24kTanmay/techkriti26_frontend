import React from 'react';

const ComingSoon = ({ title }) => {
  return (
    <div className="coming-soon-container">
      <h1 className="coming-soon-title">
        {title}
      </h1>
      <p className="coming-soon-text">
        Coming Soon...
      </p>
    </div>
  );
};

export default ComingSoon;
