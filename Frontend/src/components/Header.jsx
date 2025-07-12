import React from 'react';
import { Search, Bell, Settings, Moon, Sun, User, Home, Bookmark, Edit } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from '../hooks/useRouter';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { navigate } = useRouter();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              ویرگول
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در ویرگول..."
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-10 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Right Navigation */}
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
            
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Home className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Edit className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>

            <button 
              onClick={() => navigate('/settings')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            <button 
              onClick={() => navigate('/user/fateme-atta')}
              className="flex items-center space-x-2 space-x-reverse hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 transition-colors"
            >
              <img 
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">یوسف محمدی</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;