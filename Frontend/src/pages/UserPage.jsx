import React, { useState } from 'react';
import { MapPin, Calendar, Link as LinkIcon, Users, BookOpen, Heart, MessageCircle, Eye, Settings, UserPlus, UserCheck } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { mockUsers, mockArticles } from '../data/mockData';
import ArticleCard from '../components/ArticleCard';

const UserPage = () => {
  const { params, navigate } = useRouter();
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  
  const user = mockUsers.find(u => u.username === params.username);
  
  if (!user) {
    return (
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">کاربر یافت نشد</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  const userPosts = mockArticles.filter(article => article.author.id === user.id);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {/* Cover Image */}
          <div className="h-32 md:h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-6 relative">
            <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6 md:space-x-reverse">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
              />
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-start space-x-2 space-x-reverse mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  {user.verified && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">@{user.username}</p>
                {user.bio && (
                  <p className="text-gray-700 dark:text-gray-300 max-w-md">{user.bio}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 space-x-reverse mt-4 md:mt-0">
              <button 
                onClick={handleFollow}
                className={`flex items-center space-x-2 space-x-reverse px-6 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{isFollowing ? 'دنبال می‌کنید' : 'دنبال کردن'}</span>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Stats */}
          <div className="flex items-center justify-center md:justify-start space-x-8 space-x-reverse mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{user.posts}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">مقاله</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{user.followers}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">دنبال‌کننده</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{user.following}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">دنبال شده</div>
            </div>
          </div>

          {/* User Details */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            {user.location && (
              <div className="flex items-center space-x-1 space-x-reverse">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1 space-x-reverse">
              <Calendar className="w-4 h-4" />
              <span>عضو از {user.joinDate}</span>
            </div>
            {user.website && (
              <div className="flex items-center space-x-1 space-x-reverse">
                <LinkIcon className="w-4 h-4" />
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">
                  وبسایت شخصی
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6">
          <div className="flex space-x-8 space-x-reverse">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <BookOpen className="w-4 h-4" />
                <span>مقالات</span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                  {userPosts.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'about'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <Users className="w-4 h-4" />
                <span>درباره</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {activeTab === 'posts' && (
          <div className="p-6">
            {userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map((article) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    content={article.excerpt}
                    author={article.author}
                    image={article.image}
                    stats={article.stats}
                    publishedAt={article.publishedAt}
                    tags={article.tags}
                    featured={article.featured}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  هنوز مقاله‌ای منتشر نشده
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {user.name} هنوز مقاله‌ای منتشر نکرده است.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="p-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">درباره {user.name}</h3>
              
              {user.bio ? (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {user.bio}
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  این کاربر هنوز بیوگرافی ننوشته است.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">اطلاعات کلی</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">تاریخ عضویت:</span>
                      <span className="text-gray-900 dark:text-white">{user.joinDate}</span>
                    </div>
                    {user.location && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">موقعیت:</span>
                        <span className="text-gray-900 dark:text-white">{user.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">وضعیت تایید:</span>
                      <span className={user.verified ? 'text-green-600' : 'text-gray-500'}>
                        {user.verified ? 'تایید شده' : 'تایید نشده'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">آمار فعالیت</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">تعداد مقالات:</span>
                      <span className="text-gray-900 dark:text-white">{user.posts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">دنبال‌کنندگان:</span>
                      <span className="text-gray-900 dark:text-white">{user.followers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">دنبال شده‌ها:</span>
                      <span className="text-gray-900 dark:text-white">{user.following}</span>
                    </div>
                  </div>
                </div>
              </div>

              {user.website && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">لینک‌ها</h4>
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 space-x-reverse text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>وبسایت شخصی</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;