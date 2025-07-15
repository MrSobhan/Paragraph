import React from 'react';
import { useState } from 'react';
import { Search, Bell, Settings, Moon, Sun, User, Home, Bookmark, Edit, Newspaper, LayoutDashboard, DoorOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from '../hooks/useRouter';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { navigate } = useRouter();
  const { isLogin, user, LogOutUser } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white moraba flex items-center justify-center gap-x-2"><Newspaper className='w-5 h-5' /> ویرگول</h1>
            </div>

            <div className="relative hidden md:block">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="دنبال چی میگردی ..."
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px] text-sm shadow pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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

                  <button
                    onClick={() => navigate('/notifications')}
                    className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="اعلان‌ها"
                  >
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                  </button>

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