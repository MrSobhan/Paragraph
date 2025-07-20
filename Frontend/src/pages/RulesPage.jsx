import React from 'react';
import { Shield, Users, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const RulesPage = () => {
  const rules = [
    {
      title: 'احترام به دیگران',
      description: 'در تمام تعاملات خود با سایر کاربران، احترام و ادب را رعایت کنید.',
      icon: Users,
      type: 'required'
    },
    {
      title: 'محتوای اصیل',
      description: 'تنها محتوای اصیل و غیر کپی شده منتشر کنید. در صورت استفاده از منابع، حتماً آن‌ها را ذکر کنید.',
      icon: CheckCircle,
      type: 'required'
    },
    {
      title: 'ممنوعیت محتوای مضر',
      description: 'انتشار محتوای توهین‌آمیز، نفرت‌انگیز، یا مضر برای جامعه ممنوع است.',
      icon: XCircle,
      type: 'forbidden'
    },
    {
      title: 'حفظ حریم خصوصی',
      description: 'اطلاعات شخصی خود و دیگران را بدون اجازه منتشر نکنید.',
      icon: Shield,
      type: 'required'
    }
  ];

  const guidelines = [
    {
      title: 'کیفیت نوشتار',
      items: [
        'از املا و دستور زبان صحیح استفاده کنید',
        'عنوان‌های جذاب و مرتبط انتخاب کنید',
        'متن را به پاراگراف‌های منطقی تقسیم کنید',
        'از تصاویر مناسب و باکیفیت استفاده کنید'
      ]
    },
    {
      title: 'تعامل سازنده',
      items: [
        'نظرات سازنده و مفید ارائه دهید',
        'از انتقاد مخرب خودداری کنید',
        'به سوالات دیگران پاسخ مفید دهید',
        'از بحث‌های غیرضروری اجتناب کنید'
      ]
    },
    {
      title: 'محتوای مناسب',
      items: [
        'محتوای آموزنده و ارزشمند تولید کنید',
        'از موضوعات متنوع و جذاب استفاده کنید',
        'تجربیات شخصی خود را به اشتراک بگذارید',
        'به روزرسانی‌های منظم انجام دهید'
      ]
    }
  ];

  const violations = [
    {
      level: 'خفیف',
      description: 'اخطار کتبی و راهنمایی',
      examples: ['املای نادرست مکرر', 'عنوان‌های نامناسب', 'عدم رعایت فرمت']
    },
    {
      level: 'متوسط',
      description: 'محدودیت موقت (۱-۷ روز)',
      examples: ['محتوای کپی شده', 'تبلیغات غیرمجاز', 'اسپم']
    },
    {
      level: 'شدید',
      description: 'تعلیق حساب کاربری (۱-۳۰ روز)',
      examples: ['توهین به کاربران', 'انتشار اطلاعات نادرست', 'نقض حریم خصوصی']
    },
    {
      level: 'بحرانی',
      description: 'حذف دائمی حساب کاربری',
      examples: ['محتوای غیرقانونی', 'تهدید و ارعاب', 'سوءاستفاده مکرر']
    }
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">قوانین و مقررات</h1>
          <p className="text-xl md:text-2xl opacity-90">
            راهنمای استفاده از پلتفرم پاراگراف
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3 space-x-reverse">
            <Info className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                خوش آمدید به پاراگراف
              </h3>
              <p className="text-blue-800 dark:text-blue-200">
                این قوانین برای حفظ فضایی امن، سازنده و حرفه‌ای برای همه کاربران تدوین شده است. 
                لطفاً قبل از شروع فعالیت، این مقررات را به دقت مطالعه کنید.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">قوانین اصلی</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {rules.map((rule, index) => (
            <div 
              key={index} 
              className={`p-6 rounded-xl border-2 ${
                rule.type === 'required' 
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-start space-x-3 space-x-reverse">
                <rule.icon className={`w-6 h-6 mt-1 flex-shrink-0 ${
                  rule.type === 'required' ? 'text-green-600' : 'text-red-600'
                }`} />
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${
                    rule.type === 'required' 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-red-900 dark:text-red-100'
                  }`}>
                    {rule.title}
                  </h3>
                  <p className={`${
                    rule.type === 'required' 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {rule.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">راهنمای بهترین شیوه‌ها</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guidelines.map((guideline, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {guideline.title}
              </h3>
              <ul className="space-y-2">
                {guideline.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-2 space-x-reverse">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Violations */}
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">سطوح تخلف و مجازات‌ها</h2>
        
        <div className="space-y-6">
          {violations.map((violation, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className={`w-4 h-4 rounded-full mt-2 flex-shrink-0 ${
                  violation.level === 'خفیف' ? 'bg-yellow-500' :
                  violation.level === 'متوسط' ? 'bg-orange-500' :
                  violation.level === 'شدید' ? 'bg-red-500' : 'bg-red-700'
                }`}></div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      تخلف {violation.level}
                    </h3>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      violation.level === 'خفیف' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      violation.level === 'متوسط' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                      violation.level === 'شدید' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 
                      'bg-red-200 text-red-900 dark:bg-red-900/40 dark:text-red-300'
                    }`}>
                      {violation.description}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">نمونه‌های تخلف:</h4>
                    <ul className="space-y-1">
                      {violation.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="text-gray-600 dark:text-gray-400 text-sm">
                          • {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appeal Process */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">فرآیند اعتراض</h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            در صورت عدم موافقت با تصمیم گرفته شده، می‌توانید از طریق مراحل زیر اعتراض خود را ثبت کنید:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">ارسال درخواست اعتراض</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  از طریق ایمیل appeal@virgool.io درخواست خود را ارسال کنید.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">بررسی توسط تیم</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  تیم ما درخواست شما را ظرف ۴۸ ساعت بررسی خواهد کرد.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">اعلام نتیجه</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  نتیجه بررسی از طریق ایمیل به اطلاع شما خواهد رسید.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            سوال یا پیشنهادی دارید؟
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            تیم پشتیبانی ما آماده پاسخگویی به سوالات شماست.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@virgool.io"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              تماس با پشتیبانی
            </a>
            <a 
              href="mailto:feedback@virgool.io"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              ارسال بازخورد
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;