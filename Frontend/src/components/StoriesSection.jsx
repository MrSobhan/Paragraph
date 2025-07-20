import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';

const StoriesSection = () => {
  const { navigate } = useRouter();
  const { fetchTopics } = useApi();
  const { isLogin } = useAuth();
  const [topics, setTopics] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    const result = await fetchTopics();
    if (result.success) {
      // Get random 8 topics for stories
      const shuffled = result.data.sort(() => 0.5 - Math.random());
      setTopics(shuffled.slice(0, 8));
    }
  };

  const scrollLeft = () => {
    const container = document.getElementById('stories-container');
    container.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = document.getElementById('stories-container');
    container.scrollBy({ left: 200, behavior: 'smooth' });
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
      'from-cyan-500 to-blue-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">موضوعات داغ</h3>
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={scrollLeft}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          id="stories-container"
          className="flex space-x-4 space-x-reverse overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Add Story Button */}
          {isLogin && (
            <button
              onClick={() => navigate('/create-post')}
              className="flex-shrink-0 flex flex-col items-center space-y-2 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-500 group-hover:border-blue-500 transition-colors">
                <Plus className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center max-w-[70px] truncate">
                پست جدید
              </span>
            </button>
          )}

          {/* Topic Stories */}
          {topics.map((topic, index) => (
            <button
              key={topic._id}
              onClick={() => navigate(`/topics/${topic._id}`)}
              className="flex-shrink-0 flex flex-col items-center space-y-2 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${getTopicGradient(index)} rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800 group-hover:scale-105 transition-transform`}>
                <span className="text-white font-bold text-lg">
                  {topic.name.charAt(0)}
                </span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 text-center max-w-[70px] truncate">
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
      `}</style>
    </div>
  );
};

export default StoriesSection;