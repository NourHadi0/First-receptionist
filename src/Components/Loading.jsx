import React from 'react';
import '../Loading.css';

const Loading = () => {
  return (
    <div className='ring-container'>
      <div className="ring"></div>
      <div className="ring"></div>
      <div className="ring"></div>
    </div>
  );
};

export default Loading;
