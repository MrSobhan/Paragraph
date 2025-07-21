import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';

const StoriesSection = () => {
  const { navigate } = useRouter();
  const { fetchTopics } = useApi();
  const { isLogin } = useAuth();
  const [topics, setTopics] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    const result = await fetchTopics();
    if (result.success) {
      const shuffled = result.data.sort(() => 0.5 - Math.random());
      setTopics(shuffled.slice(0, 8));
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.5;
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.5;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getTopicGradient = (index) => {
    const gradients = [
      'from-pink-500 to-rose-500',
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-indigo-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500',
      'from-cyan-500 to-blue-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-4">
        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">موضوعات داغ</p>
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={scrollRight}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            aria-label="اسکرول به راست"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={scrollLeft}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            aria-label="اسکرول به چپ"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={containerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth  space-x-reverse py-2 scrollbar-hide"
        >
          {/* Add Story Button */}
          {isLogin && (
            <button
              onClick={() => navigate('/create-post')}
              className="flex-shrink-0 flex flex-col items-center space-y-2 group snap-start w-20"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-500 group-hover:border-blue-500 transition-colors">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center max-w-[70px] sm:max-w-[80px] truncate">
                پست جدید
              </span>
            </button>
          )}

          {/* Topic Stories */}
          {topics.map((topic, index) => (
            <button
              key={topic._id}
              onClick={() => navigate(`/topics/${topic._id}`)}
              className="flex-shrink-0 flex flex-col items-center space-y-2 group snap-start w-20"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${getTopicGradient(
                  index
                )} rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800 group-hover:scale-105 transition-transform`}
              >
                <span className="text-white font-bold text-base sm:text-lg">
                  {topic.name.charAt(0)}
                </span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center max-w-[70px] sm:max-w-[80px] truncate">
                {topic.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default StoriesSection;