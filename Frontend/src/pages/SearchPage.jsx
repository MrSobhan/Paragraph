import React, { useState, useEffect } from 'react';
import { Search, FileText, User, Hash } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';
import ArticleCard from '../components/ArticleCard';
import Loader from '../components/Loader';

const SearchPage = () => {
  const { navigate } = useRouter();
  const { fetchPosts, fetchTopics ,fetchAllUserProfile } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    posts: [],
    users: [],
    topics: []
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, []);

  const performSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      // Search posts
      const postsResult = await fetchPosts(1, 20, query);
      const posts = postsResult.success ? postsResult.data : [];

      // Search topics
      const topicsResult = await fetchTopics();
      const allTopics = topicsResult.success ? topicsResult.data : [];
      const topics = allTopics.filter(topic => 
        topic.name.toLowerCase().includes(query.toLowerCase()) ||
        topic.description?.toLowerCase().includes(query.toLowerCase())
      );

      // Search Users
      const usersResult = await fetchAllUserProfile();
      const allUsers = usersResult.success ? usersResult.data.users : [];
      
      const users = allUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults({ posts, users, topics });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`);
      performSearch(searchQuery);
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 1 ? 'همین الان' : `${diffInMinutes} دقیقه پیش`;
      }
      return `${diffInHours} ساعت پیش`;
    } else if (diffInDays === 1) {
      return 'دیروز';
    } else if (diffInDays < 7) {
      return `${diffInDays} روز پیش`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} هفته پیش`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ماه پیش`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} سال پیش`;
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">جستجو</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در پست‌ها، کاربران و موضوعات..."
                className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md transition-colors"
              >
                جستجو
              </button>
            </div>
          </form>

          {/* Tabs */}
          <div className="flex space-x-8 space-x-reverse">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <FileText className="w-4 h-4" />
                <span>پست‌ها</span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                  {results.posts.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <User className="w-4 h-4" />
                <span>کاربران</span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                  {results.users.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('topics')}
              className={`py-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'topics'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <Hash className="w-4 h-4" />
                <span>موضوعات</span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                  {results.topics.length}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="p-6">
          {loading ? (
            <Loader text="در حال جستجو..." />
          ) : (
            <>
              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <div>
                  {results.posts.length > 0 ? (
                    <div className="space-y-6">
                      {results.posts.map((post) => (
                        <ArticleCard
                          key={post._id}
                          id={post._id}
                          title={post.title}
                          content={post.summary}
                          author={post.author}
                          image={post.coverImage}
                          stats={{
                            likes: post.likesCount || 0,
                            comments: post.commentsCount || 0,
                            views: post.views || 0
                          }}
                          publishedAt={post.createdAt}
                          tags={post.tags}
                          readTime={post.estimatedReadTime}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        پستی یافت نشد
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery ? `برای "${searchQuery}" پستی یافت نشد` : 'جستجوی خود را وارد کنید'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  {results.users.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {results.users.map((user) => (
                        <button
                          key={user._id}
                          onClick={() => navigate(`/user/${user._id}`)}
                          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow text-right"
                        >
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <img
                              src={user.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                              alt={user.name}
                              className="w-16 h-16 rounded-full"
                            />
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {user.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
                              {user.bio && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                  {user.bio}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        کاربری یافت نشد
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery ? `برای "${searchQuery}" کاربری یافت نشد` : 'جستجوی خود را وارد کنید'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Topics Tab */}
              {activeTab === 'topics' && (
                <div>
                  {results.topics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.topics.map((topic) => (
                        <button
                          key={topic._id}
                          onClick={() => navigate(`/topics/${topic._id}`)}
                          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow text-right"
                        >
                          <div className="flex items-center space-x-3 space-x-reverse mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <Hash className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {topic.name}
                              </h3>
                            </div>
                          </div>
                          
                          {topic.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                              {topic.description}
                            </p>
                          )}
                          
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              ایجاد شده در {getTimeAgo(topic.createdAt)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Hash className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                        موضوعی یافت نشد
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery ? `برای "${searchQuery}" موضوعی یافت نشد` : 'جستجوی خود را وارد کنید'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;