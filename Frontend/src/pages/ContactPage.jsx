import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Bug } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: 'general',
      message: ''
    });
    alert('پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.');
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'ایمیل',
      value: 'info@virgool.io',
      description: 'برای سوالات عمومی'
    },
    {
      icon: Phone,
      title: 'تلفن',
      value: '۰۲۱-۱۲۳۴۵۶۷۸',
      description: 'پاسخگویی ۹ صبح تا ۶ عصر'
    },
    {
      icon: MapPin,
      title: 'آدرس',
      value: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      description: 'دفتر مرکزی پاراگراف'
    },
    {
      icon: Clock,
      title: 'ساعات کاری',
      value: 'شنبه تا چهارشنبه ۹-۱۸',
      description: 'پنج‌شنبه ۹-۱۳'
    }
  ];

  const supportCategories = [
    {
      icon: HelpCircle,
      title: 'سوالات عمومی',
      description: 'راهنمایی در استفاده از پلتفرم',
      email: 'help@virgool.io'
    },
    {
      icon: Bug,
      title: 'گزارش مشکل فنی',
      description: 'مشکلات نرم‌افزاری و باگ‌ها',
      email: 'tech@virgool.io'
    },
    {
      icon: MessageCircle,
      title: 'پیشنهادات',
      description: 'ایده‌ها و پیشنهادات بهبود',
      email: 'feedback@virgool.io'
    }
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">تماس با ما</h1>
          <p className="text-xl md:text-2xl opacity-90">
            ما همیشه آماده شنیدن نظرات شما هستیم
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          راه‌های ارتباط با ما
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <method.icon className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {method.title}
              </h3>
              <p className="text-gray-900 dark:text-white font-medium mb-1">
                {method.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {method.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Categories */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          بخش‌های پشتیبانی
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {supportCategories.map((category, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
              <category.icon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {category.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {category.description}
              </p>
              <a 
                href={`mailto:${category.email}`}
                className="inline-flex items-center space-x-2 space-x-reverse text-blue-500 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{category.email}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          فرم تماس
        </h2>
        
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نام و نام خانوادگی *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="نام خود را وارد کنید"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ایمیل *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ایمیل خود را وارد کنید"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                دسته‌بندی *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">سوالات عمومی</option>
                <option value="technical">مشکل فنی</option>
                <option value="feedback">پیشنهاد</option>
                <option value="business">همکاری تجاری</option>
                <option value="other">سایر</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                موضوع *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="موضوع پیام خود را وارد کنید"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                پیام *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="پیام خود را اینجا بنویسید..."
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center space-x-2 space-x-reverse bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                <Send className="w-5 h-5" />
                <span>ارسال پیام</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          سوالات متداول
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              چگونه می‌توانم مقاله منتشر کنم؟
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              پس از ورود به حساب کاربری، روی دکمه "نوشتن" کلیک کنید و مقاله خود را بنویسید. 
              پس از تکمیل، روی "انتشار" کلیک کنید.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              آیا استفاده از پاراگراف رایگان است؟
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              بله، استفاده از پاراگراف کاملاً رایگان است. ما همچنین طرح‌های پریمیوم با امکانات اضافی ارائه می‌دهیم.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              چگونه می‌توانم حساب کاربری خود را حذف کنم؟
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              برای حذف حساب کاربری، لطفاً با تیم پشتیبانی از طریق ایمیل support@virgool.io تماس بگیرید.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              چه مدت طول می‌کشد تا پیام من پاسخ داده شود؟
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              ما سعی می‌کنیم ظرف ۲۴ ساعت به تمام پیام‌ها پاسخ دهیم. در ایام تعطیل ممکن است این زمان تا ۴۸ ساعت افزایش یابد.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;