import React, { useState, useEffect } from 'react';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(scrollPercentage);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-16 left-0 w-full h-1 bg-transparent z-50">
      <div
        className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;