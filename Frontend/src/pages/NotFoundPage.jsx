import React from 'react';
import { Home, Search, ArrowRight, FileX } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';

const NotFoundPage = () => {
  const { navigate } = useRouter();

  const popularPages = [
    { title: 'صفحه اصلی', path: '/', icon: Home },
    { title: 'درباره ما', path: '/about', icon: FileX },
    { title: 'قوانین و مقررات', path: '/rules', icon: FileX },
    { title: 'تماس با ما', path: '/contact', icon: FileX }
  ];

  const recentPosts = [
    {
      title: 'قفل کارتی درب منزل',
      path: '/post/1',
      author: 'فاطمه عطا'
    },
    {
      title: 'پیمان شگفت مدیریت',
      path: '/post/2',
      author: 'صادق زالی'
    }
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* 404 Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="p-8 md:p-12 text-center">
          <div className="text-8xl md:text-9xl font-bold opacity-50 mb-4">404</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">صفحه یافت نشد</h1>
          <p className="text-xl opacity-90">
            متأسفانه صفحه‌ای که دنبال آن می‌گردید وجود ندارد
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileX className="w-12 h-12 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            چه اتفاقی افتاده؟
          </h2>
          
          <div className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 space-y-2">
            <p>• ممکن است آدرس را اشتباه تایپ کرده باشید</p>
            <p>• صفحه ممکن است حذف یا جابجا شده باشد</p>
            <p>• لینک ممکن است منقضی شده باشد</p>
            <p>• دسترسی شما به این صفحه محدود شده باشد</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 space-x-reverse bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>بازگشت به صفحه اصلی</span>
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 space-x-reverse bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span>بازگشت به صفحه قبل</span>
          </button>
        </div>
      </div>

      {/* Helpful Links */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Popular Pages */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              صفحات پربازدید
            </h3>
            <div className="space-y-3">
              {popularPages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => navigate(page.path)}
                  className="flex items-center space-x-3 space-x-reverse w-full p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <page.icon className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white">{page.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              مقالات اخیر
            </h3>
            <div className="space-y-3">
              {recentPosts.map((post, index) => (
                <button
                  key={index}
                  onClick={() => navigate(post.path)}
                  className="block w-full p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-right"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    نوشته {post.author}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            دنبال چیز خاصی می‌گردید؟
          </h3>
          
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در پاراگراف..."
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-12 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <button className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors">
              جستجو
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
        <div className="p-8 md:p-12 text-center">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            همچنان کمک نیاز دارید؟
          </h3>
          <p className="text-blue-800 dark:text-blue-200 mb-6">
            تیم پشتیبانی ما آماده کمک به شماست
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            تماس با پشتیبانی
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;