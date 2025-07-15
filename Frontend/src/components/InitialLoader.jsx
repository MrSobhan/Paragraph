import React from 'react';
import { Newspaper } from 'lucide-react';

const InitialLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-white rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Newspaper className='w-7 h-7 text-white' />
                {/* <img src="../images/logo.webp" alt="fegsdsdf" /> */}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white moraba mb-2">ویرگول</h1>
            <p className="text-white/80 text-lg">پلتفرم وبلاگ نویسی فارسی</p>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2 space-x-reverse mb-6">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Loading Text */}
        <p className="text-white/90 text-sm animate-pulse">در حال بارگذاری...</p>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/20 rounded-full mx-auto mt-6 overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse" style={{
            animation: 'loading 2s ease-in-out infinite',
            width: '100%'
          }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default InitialLoader;