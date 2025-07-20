import React from 'react';
import { useState } from 'react';
import { Search, Bell, Settings, Moon, Sun, User, Home, Bookmark, Edit, Newspaper, LayoutDashboard, DoorOpen, FileText, Hash } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from '../hooks/useRouter';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import AuthModal from './AuthModal';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { navigate } = useRouter();
  const { isLogin, user, LogOutUser } = useAuth();
  const { fetchNotifications, markNotificationAsRead , fetchPosts} = useApi();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ posts: [], users: [], topics: [] });
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const loadNotifications = async () => {
    const result = await fetchNotifications();
    if (result.success) {
      // Only show unread notifications in dropdown
      setNotifications(result.data.notifications.filter(n => !n.isRead));
    }
  };

  const handleNotificationHover = () => {
    if (isLogin) {
      setShowNotifications(true);
      loadNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    const result = await markNotificationAsRead(notificationId);
    if (result.success) {
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ posts: [], users: [], topics: [] });
      setShowSearchDropdown(false);
      return;
    }

    setSearchLoading(true);
    try {
      // Search posts
      const postsResult = await fetchPosts(1, 5, query);
      const posts = postsResult.success ? postsResult.data.slice(0, 3) : [];

      // Search users (mock for now - you can implement this API)
      const users = []; // await searchUsers(query);

      // Search topics (mock for now - you can implement this API)  
      const topics = []; // await searchTopics(query);

      setSearchResults({ posts, users, topics });
      setShowSearchDropdown(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowSearchDropdown(false);
    }
  };

  const handleLogout = () => {
    LogOutUser();
  };
  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white moraba flex items-center justify-center gap-x-2"><Newspaper className='w-5 h-5' /> پاراگراف</h1>
            </div>

            <div className="relative hidden md:block">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="دنبال چی میگردی ..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                    searchTerm.length && setShowSearchDropdown(true)
                  }}
                  // onFocus={() => searchTerm.length && setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                  className="w-[300px] text-sm shadow pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>

              {/* Search Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                  ) : (
                    <>
                      {searchResults.posts.length > 0 && (
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <FileText className="w-4 h-4 ml-2" />
                            پست‌ها
                          </h4>
                          {searchResults.posts.map((post) => (
                            <button
                              key={post._id}
                              onClick={() => {
                                navigate(`/post/${post._id}`);
                                setShowSearchDropdown(false);
                                setSearchTerm('')
                              }}
                              className="w-full text-right p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                            >
                              <div className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                                {post.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {post.summary}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {searchResults.users.length > 0 && (
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <User className="w-4 h-4 ml-2" />
                            کاربران
                          </h4>
                          {searchResults.users.map((user) => (
                            <button
                              key={user._id}
                              onClick={() => {
                                navigate(`/user/${user._id}`);
                                setShowSearchDropdown(false);
                              }}
                              className="w-full text-right p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center"
                            >
                              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ml-3" />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white text-sm">
                                  {user.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  @{user.username}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {searchResults.topics.length > 0 && (
                        <div className="p-3">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                            <Hash className="w-4 h-4 ml-2" />
                            موضوعات
                          </h4>
                          {searchResults.topics.map((topic) => (
                            <button
                              key={topic._id}
                              onClick={() => {
                                navigate(`/topics/${topic._id}`);
                                setShowSearchDropdown(false);
                              }}
                              className="w-full text-right p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                            >
                              <div className="font-medium text-gray-900 dark:text-white text-sm">
                                #{topic.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {searchResults.posts.length === 0 && searchResults.users.length === 0 && searchResults.topics.length === 0 && searchTerm && (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          نتیجه‌ای یافت نشد
                        </div>
                      )}

                      {searchTerm && (
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => {
                              navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                              setShowSearchDropdown(false);
                            }}
                            className="w-full text-center text-sm text-blue-500 hover:text-blue-600"
                          >
                            مشاهده همه نتایج برای "{searchTerm}"
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ?
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> :
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                }
              </button>

              {isLogin ? (
                <>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => navigate('/create-post')}
                    title="نوشتن پست جدید"
                  >
                    <Edit className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>

                  <div className="relative">
                    <button
                    onClick={() => navigate('/notifications')}
                    onMouseEnter={handleNotificationHover}
                    // onMouseLeave={() => setShowNotifications(false)}
                    className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="اعلان‌ها"
                  >
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div 
                      className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
                      onMouseEnter={() => setShowNotifications(true)}
                      onMouseLeave={() => setShowNotifications(false)}
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">اعلان‌های جدید</h3>
                      </div>
                      
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          اعلان جدیدی ندارید
                        </div>
                      ) : (
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div key={notification._id} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 dark:text-white mb-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(notification.createdAt).toLocaleDateString('fa-IR')}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleMarkAsRead(notification._id)}
                                  className="text-xs text-blue-500 hover:text-blue-600 ml-2"
                                >
                                  دیدم
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            navigate('/notifications');
                          }}
                          className="w-full text-center text-sm text-blue-500 hover:text-blue-600"
                        >
                          مشاهده همه اعلان‌ها
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                  <div className="relative group">
                    <button
                      // onClick={() => navigate(`/user/${user?._id || 'profile'}`)}
                      className="flex items-center space-x-2 space-x-reverse hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 transition-colors"
                    >
                      <img
                        src={user?.avatar || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="hidden md:block text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'کاربر'}</div>
                      </div>
                    </button>

                    <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-2">
                        <button
                          onClick={() => navigate(`/user/${user?._id || 'profile'}`)}
                          className="flex items-center gap-x-1 w-full text-right px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          پروفایل
                        </button>
                        <button
                          onClick={() => navigate('/settings')}
                          className="flex items-center gap-x-1 w-full text-right px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          تنظیمات
                        </button>
                        <button
                          onClick={() => navigate('/saved-posts')}
                          className="flex items-center gap-x-1 w-full text-right px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                          ذخیره ها
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-x-1 w-full text-right px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            پنل مدیریت
                          </button>
                        )}
                        <hr className="my-1 border-gray-200 dark:border-gray-600" />

                        <button
                          onClick={() => navigate('/create-post')}
                          className="flex items-center gap-x-1 w-full text-right px-3 py-2 text-sm text-blue-700 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          نوشتن پست جدید
                        </button>
                        <hr className="my-1 border-gray-200 dark:border-gray-600" />
                        <button
                          onClick={() => handleLogout()}
                          className="flex items-center gap-x-1 w-full text-right px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                          <DoorOpen className="w-4 h-4 text-red-600 dark:text-red-400" />
                          خروج
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3 space-x-reverse">
                  {/* <button
                    onClick={() => handleAuthClick('login')}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    ورود 
                  </button> */}
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    ورود / ثبت‌نام
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;