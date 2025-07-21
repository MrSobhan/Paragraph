import React, { useState, useEffect } from 'react';
import { Hash, BookOpen, TrendingUp } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';
import Loader from '../components/Loader';

const TopicsPage = () => {
  const { navigate } = useRouter();
  const { fetchTopics } = useApi();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    setLoading(true);
    const result = await fetchTopics();
    console.log(result.data);
    
    if (result.success) {
      setTopics(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <Loader text="در حال بارگذاری موضوعات..." />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-8xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <div className="p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">موضوعات</h1>
          <p className="text-xl md:text-2xl opacity-90">
            کاوش در دنیای گسترده دانش و اطلاعات
          </p>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="p-6">
          {topics.length == 0 ? (
            <div className="text-center py-12">
              <Hash className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                موضوعی یافت نشد
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                هنوز موضوعی تعریف نشده است
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              { topics.map((topic) => (
                <button
                  key={topic._id}
                  onClick={() => navigate(`/topics/${topic._id}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all group text-right"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Hash className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {topic.postsCount || 0} پست
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {topic.name}
                  </h3>
                  
                  {topic.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                      {topic.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 space-x-reverse text-gray-500 dark:text-gray-400">
                      <BookOpen className="w-4 h-4" />
                      <span>مطالعه پست‌ها</span>
                    </div>
                    
                    {topic.trending && (
                      <div className="flex items-center space-x-1 space-x-reverse text-orange-500">
                        <TrendingUp className="w-4 h-4" />
                        <span>داغ</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;