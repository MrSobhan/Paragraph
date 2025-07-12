import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';

const FeaturedSection = () => {
  const { navigate } = useRouter();
  
  const featuredArticles = [
    {
      title: 'درآمد پست مدرن مقاوم لودا',
      author: 'AbolfaslHoni',
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'فناوری',
      id: '1'
    },
    {
      title: 'طراحی سیستم‌های فناوری تیمچی تلگرام',
      author: 'حبیب فرابی',
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'طراحی',
      id: '2'
    },
    {
      title: 'فلسفت رقابت',
      author: 'ستاره',
      image: 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'فلسفه',
      id: '1'
    }
  ];

  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="ml-2">🏆</span>
          پست‌های منتخب
        </h2>
        <div className="flex space-x-2 space-x-reverse">
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredArticles.map((article, index) => (
          <button
            key={index}
            onClick={() => navigate(`/post/${article.id}`)}
            className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-colors cursor-pointer text-right"
          >
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="text-xs text-blue-200 mb-2">{article.category}</div>
              <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-200">{article.author}</span>
                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded">
                  ۱ روز پیش
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;