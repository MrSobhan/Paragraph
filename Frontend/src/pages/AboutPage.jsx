import React from 'react';
import { Users, Target, Heart, Award, Mail, Phone, MapPin } from 'lucide-react';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'علی احمدی',
      role: 'مدیر عامل و بنیان‌گذار',
      image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      bio: 'با بیش از ۱۰ سال تجربه در حوزه فناوری و رسانه'
    },
    {
      name: 'مریم رضایی',
      role: 'مدیر محصول',
      image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      bio: 'متخصص تجربه کاربری و طراحی محصول'
    },
    {
      name: 'حسین مرادی',
      role: 'مدیر فنی',
      image: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      bio: 'توسعه‌دهنده ارشد و معماری نرم‌افزار'
    }
  ];

  const stats = [
    { label: 'کاربران فعال', value: '۱۰۰,۰۰۰+', icon: Users },
    { label: 'مقالات منتشر شده', value: '۵۰,۰۰۰+', icon: Target },
    { label: 'نویسندگان', value: '۵,۰۰۰+', icon: Heart },
    { label: 'جوایز دریافتی', value: '۱۵', icon: Award }
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">درباره پاراگراف</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            پلتفرم پیشرو نوشتن و خواندن محتوای فارسی
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">ماموریت ما</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
            پاراگراف با هدف ایجاد فضایی امن و حرفه‌ای برای نویسندگان و خوانندگان فارسی‌زبان راه‌اندازی شده است. 
            ما معتقدیم که هر فردی داستان منحصر به فردی برای گفتن دارد و پاراگراف بستری است تا این داستان‌ها 
            به بهترین شکل ممکن به اشتراک گذاشته شوند.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">ارزش‌های ما</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">کیفیت محتوا</h3>
            <p className="text-gray-600 dark:text-gray-400">
              ما متعهد به ارائه محتوای باکیفیت و ارزشمند هستیم که به رشد و یادگیری خوانندگان کمک کند.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">جامعه‌محوری</h3>
            <p className="text-gray-600 dark:text-gray-400">
              ایجاد جامعه‌ای فعال و متعامل از نویسندگان و خوانندگان که از یکدیگر حمایت می‌کنند.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">نوآوری</h3>
            <p className="text-gray-600 dark:text-gray-400">
              استفاده از جدیدترین فناوری‌ها برای ارائه بهترین تجربه کاربری ممکن.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">تیم ما</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {member.name}
              </h3>
              <p className="text-blue-500 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* History Section */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">تاریخچه پاراگراف</h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start space-x-4 space-x-reverse">
              <div className="w-4 h-4 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">۱۴۰۰ - آغاز راه</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  پاراگراف با هدف ایجاد پلتفرمی برای نویسندگان فارسی‌زبان راه‌اندازی شد.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 space-x-reverse">
              <div className="w-4 h-4 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">۱۴۰۱ - رشد جامعه</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  عضویت بیش از ۱۰,۰۰۰ نویسنده و انتشار ۵۰,۰۰۰ مقاله در پلتفرم.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 space-x-reverse">
              <div className="w-4 h-4 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">۱۴۰۲ - نوآوری‌های جدید</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  راه‌اندازی قابلیت‌های جدید شامل پادکست، ویدیو و ابزارهای تعاملی.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 space-x-reverse">
              <div className="w-4 h-4 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">۱۴۰۳ - گسترش بین‌المللی</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  حضور در بازارهای بین‌المللی و پشتیبانی از نویسندگان فارسی‌زبان در سراسر جهان.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">تماس با ما</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">ایمیل</h3>
            <p className="text-gray-600 dark:text-gray-400">info@virgool.io</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">تلفن</h3>
            <p className="text-gray-600 dark:text-gray-400">۰۲۱-۱۲۳۴۵۶۷۸</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">آدرس</h3>
            <p className="text-gray-600 dark:text-gray-400">تهران، ایران</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;