import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BtnTop = ({side = 'right'}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  console.log(side);
  

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 ${side}-x z-50 p-2.5 bg-gray-50 dark:bg-gray-900 border border-solid border-gray-900 dark:border-white dark:text-white rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="بازگشت به بالای صفحه"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BtnTop;