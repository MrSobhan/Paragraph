import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useAuth } from '../contexts/AuthContext';

const FeaturedSection = () => {
  const { navigate } = useRouter();
  const { isLogin } = useAuth();
  
  const featuredArticles = [
    {
      title: 'درآمد پست مدرن مقاوم لودا',
      author: 'Abolfasl',
      image: 'https://ppt90.ir/wp-content/uploads/f122-%D9%85%D8%B9%D9%85%D8%A7%D8%B1%DB%8C-%D9%BE%D8%B3%D8%AA-%D9%85%D8%AF%D8%B1%D9%86-2.jpg',
      category: 'فناوری',
      id: '1'
    },
    {
      title: 'طراحی سیستم‌های فناوری تیمچی تلگرام',
      author: 'حبیب فرابی',
      image: 'https://sinaezzati.ir/wp-content/uploads/2021/07/Gear-Beef-Up-Video-Editing-PC-1124258613.jpg',
      category: 'طراحی',
      id: '2'
    },
    {
      title: 'فلسفت رقابت',
      author: 'ستاره',
      image: 'https://gozareha.com/wp-content/uploads/2014/04/Compttv-strtgy.jpg',
      category: 'فلسفه',
      id: '3'
    }
  ];

  return (
    <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl overflow-hidden mb-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern-svg"></div>
      </div>

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">پست‌های منتخب</p>
              <p className="text-white/80 text-sm">بهترین مطالب هفته</p>
            </div>
          </div>
          
          {/* <div className="flex items-center space-x-3 space-x-reverse">
            <div className="flex space-x-2 space-x-reverse">
              <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
              <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
            </div>
          </div> */}
        </div>

        {/* Featured Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article, index) => (
            <button
              key={index}
              onClick={() => navigate(`/post/${article.id}`)}
              className="group bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer text-right transform hover:scale-105"
            >
              <div className="relative">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {article.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-5">
                <p className="text-white font-semibold text-base mb-3 line-clamp-1 group-hover:text-yellow-200 transition-colors">
                  {article.title}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-200 line-clamp-1">{article.author}</span>
                  <div className="flex items-center space-x-2 space-x-reverse text-xs text-white/70">
                    <span>۱ روز پیش</span>
                    <span>•</span>
                    <span>۵ دقیقه مطالعه</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <div className="flex items-center justify-center space-x-8 space-x-reverse text-white/80 text-sm">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span>۱۲۰+ مقاله این هفته</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 space-x-reverse">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>۵۰+ نویسنده فعال</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>۱۰ هزار+ بازدید</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;