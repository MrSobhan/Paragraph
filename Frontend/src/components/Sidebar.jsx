import React from 'react';
import { useState, useEffect } from 'react';
import { Play, TrendingUp, Users, BookOpen, Hash, Star, Coffee, Info, Shield, Mail } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';

const Sidebar = ({ className = "" }) => {
  const { navigate } = useRouter();
  const { fetchTopics, fetchAllUserProfile } = useApi();
  const [popularTopics, setPopularTopics] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  
  useEffect(() => {
    loadSidebarData();
  }, []);

  const loadSidebarData = async () => {
    // Load popular topics
    const topicsResult = await fetchTopics();
    if (topicsResult.success) {
      const shuffled = topicsResult.data.sort(() => 0.5 - Math.random());
      setPopularTopics(shuffled.slice(0, 8));
    }

    // Load suggested users
    const usersResult = await fetchAllUserProfile();
    if (usersResult.success) {
      const shuffled = usersResult.data.users.sort(() => 0.5 - Math.random());
      setSuggestedUsers(shuffled.slice(0, 3));
    }
  };

  const trendingTopics = [
    { title: 'پیشنهاد های اولیه بنی هنا', image: 'https://picsum.photos/100/60?random=6' },
    { title: 'نمایش های مختلف کاوی', image: 'https://picsum.photos/100/60?random=7' },
    { title: 'اولیاء النعمة', image: 'https://picsum.photos/100/60?random=8' },
    { title: 'ادنیا‌ی اطفا', image: 'https://picsum.photos/100/60?random=9' }
  ];

  return (
    <aside className={`w-96 relative bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 h-full overflow-y-auto hidden lg:block ${className}`}>
      <div className="p-6 space-y-8 sticky max-h-max top-20 left-0">
        {/* Featured Content */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">پاراگراف برای کسب‌وکار</h3>
            <Coffee className="w-6 h-6" />
          </div>
          <p className="text-sm opacity-90 mb-4">
            آموزش جامع بی نظیری برای شما
          </p>
          <button className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm">
            مشاهده بیشتر
          </button>
        </div>


        {/* Popular Tags */}
        <div>
          <div className="flex items-center mb-4 cursor-pointer" onClick={() => navigate('/topics')}>
            <Hash className="w-5 h-5 text-gray-600 dark:text-gray-400 ml-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">موضوعات پربحث</h3>
          </div>
          <div className="space-y-2">
            {popularTopics.map((topic) => (
              <button
                key={topic._id}
                onClick={() => navigate(`/topics/${topic._id}`)}
                className="block w-full text-right px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                #{topic.name}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div>
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400 ml-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">پربحث‌ترین امروز</h3>
          </div>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center space-x-3 space-x-reverse cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors">
                <img 
                  src={topic.image} 
                  alt={topic.title}
                  className="w-12 h-8 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {topic.title}
                  </p>
                </div>
                <Play className="w-4 h-4 text-blue-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Podcast Section */}
        <div>
          <div className="flex items-center mb-4">
            <Play className="w-5 h-5 text-gray-600 dark:text-gray-400 ml-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">پادکست‌ها</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">زنده</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mt-1">
                تکنولوژی و آینده
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ۱۲۳ نفر در حال گوش دادن
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Users */}
        <div>
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-400 ml-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">پیشنهاد دنبال کردن</h3>
          </div>
          <div className="space-y-3">
            {suggestedUsers.map((user, index) => (
              <div key={index} className="flex items-center space-x-3 space-x-reverse">
                <button onClick={() => navigate(`/user/${user._id}`)}>
                  <img 
                    src={user.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                  />
                </button>
                <div className="flex-1">
                  <button 
                    onClick={() => navigate(`/user/${user._id}`)}
                    className="text-right hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{user.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.bio || 'کاربر پاراگراف'}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{user.followersCount || 0} دنبال‌کننده</p>
                  </button>
                </div>
                <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors">
                  دنبال
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/about')}
              className="flex items-center space-x-2 space-x-reverse w-full text-right px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Info className="w-4 h-4 ml-3" />
              درباره ما
            </button>
            <button 
              onClick={() => navigate('/rules')}
              className="flex items-center space-x-2 space-x-reverse w-full text-right px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Shield className="w-4 h-4 ml-3" />
              قوانین و مقررات
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="flex items-center space-x-2 space-x-reverse w-full text-right px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Mail className="w-4 h-4 ml-3" />
              تماس با ما
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;