import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Globe, Download, Trash2, Save, BarChart3, Linkedin, Twitter, Github } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import FileUpload from '../components/FileUpload';
import Swal from 'sweetalert2';
import AnalyticsTab from '../components/AnalyticsTab';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, getMe } = useAuth();
  const { updateUserProfile } = useApi();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
      socialLinks: {
        linkedin: user?.socialLinks?.linkedin || '',
        twitter: user?.socialLinks?.twitter || '',
        github: user?.socialLinks?.github || ''
      }
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      newFollowers: true,
      comments: true,
      likes: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showLocation: true,
      allowMessages: true
    },
    preferences: {
      language: 'fa',
      timezone: 'Asia/Tehran',
      dateFormat: 'persian'
    }
  });

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setMessage(''); // Clear any previous messages
  };

  const handleSave = async () => {
    if (activeTab === 'profile') {
      setLoading(true);
      setMessage('');
      
      try {
        const result = await updateUserProfile(settings.profile , user._id);
        if (result.success) {
          await Swal.fire({
            title: 'موفقیت!',
            text: 'پروفایل با موفقیت به‌روزرسانی شد',
            icon: 'success',
            confirmButtonText: 'باشه'
          });
          // Refresh user data
          await getMe();
        } else {
          await Swal.fire({
            title: 'خطا!',
            text: result.message || 'خطا در به‌روزرسانی پروفایل',
            icon: 'error',
            confirmButtonText: 'باشه'
          });
        }
      } catch (error) {
        await Swal.fire({
          title: 'خطا!',
          text: 'خطای غیرمنتظره رخ داد',
          icon: 'error',
          confirmButtonText: 'باشه'
        });
      } finally {
        setLoading(false);
      }
    } else {
      await Swal.fire({
        title: 'موفقیت!',
        text: 'تنظیمات با موفقیت ذخیره شد',
        icon: 'success',
        confirmButtonText: 'باشه'
      });
    }
  };

  const tabs = [
    { id: 'profile', label: 'پروفایل', icon: User },
    { id: 'analytics', label: 'آمار بازدید', icon: BarChart3 },
    { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
    { id: 'privacy', label: 'حریم خصوصی', icon: Shield },
    { id: 'preferences', label: 'تنظیمات', icon: Palette }
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تنظیمات</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            مدیریت حساب کاربری و تنظیمات شخصی
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-64 bg-white dark:bg-gray-800 border-b lg:border-b-0 lg:border-l border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-right transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="p-6">
            {/* Success/Error Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('موفقیت') 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    اطلاعات پروفایل
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        تصویر پروفایل
                      </label>
                      <div className="flex items-start space-x-4 space-x-reverse">
                        <img 
                          src={settings.profile.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <FileUpload
                            fieldname="avatar"
                            postId={null}
                            onUploadSuccess={(fileUrl) => {
                              handleInputChange('profile', 'avatar', fileUrl);
                              Swal.fire({
                                title: 'موفقیت!',
                                text: 'تصویر پروفایل با موفقیت به‌روزرسانی شد',
                                icon: 'success',
                                confirmButtonText: 'باشه'
                              });
                            }}
                            onUploadError={(error) => {
                              Swal.fire({
                                title: 'خطا!',
                                text: error,
                                icon: 'error',
                                confirmButtonText: 'باشه'
                              });
                            }}
                            accept="image/*"
                            maxSize={2 * 1024 * 1024} // 2MB
                            showPreview={false}
                          >
                            <div className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer">
                              تغییر تصویر پروفایل
                            </div>
                          </FileUpload>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نام و نام خانوادگی
                      </label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ایمیل
                      </label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        بیوگرافی
                      </label>
                      <textarea
                        value={settings.profile.bio}
                        onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        شبکه‌های اجتماعی
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Linkedin className="w-5 h-5 text-blue-600" />
                          <input
                            type="url"
                            value={settings.profile.socialLinks.linkedin}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                socialLinks: {
                                  ...prev.profile.socialLinks,
                                  linkedin: e.target.value
                                }
                              }
                            }))}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="LinkedIn Profile URL"
                          />
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Twitter className="w-5 h-5 text-blue-400" />
                          <input
                            type="url"
                            value={settings.profile.socialLinks.twitter}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                socialLinks: {
                                  ...prev.profile.socialLinks,
                                  twitter: e.target.value
                                }
                              }
                            }))}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Twitter Profile URL"
                          />
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Github className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                          <input
                            type="url"
                            value={settings.profile.socialLinks.github}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                socialLinks: {
                                  ...prev.profile.socialLinks,
                                  github: e.target.value
                                }
                              }
                            }))}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="GitHub Profile URL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <AnalyticsTab />
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    تنظیمات اعلان‌ها
                  </h2>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {key === 'emailNotifications' && 'اعلان‌های ایمیل'}
                            {key === 'pushNotifications' && 'اعلان‌های فوری'}
                            {key === 'weeklyDigest' && 'خلاصه هفتگی'}
                            {key === 'newFollowers' && 'دنبال‌کنندگان جدید'}
                            {key === 'comments' && 'نظرات جدید'}
                            {key === 'likes' && 'لایک‌های جدید'}
                          </h3>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    تنظیمات حریم خصوصی
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نمایش پروفایل
                      </label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleInputChange('privacy', 'profileVisibility', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="public">عمومی</option>
                        <option value="followers">فقط دنبال‌کنندگان</option>
                        <option value="private">خصوصی</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">نمایش ایمیل</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ایمیل شما در پروفایل نمایش داده شود</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.showEmail}
                          onChange={(e) => handleInputChange('privacy', 'showEmail', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">نمایش موقعیت</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">موقعیت شما در پروفایل نمایش داده شود</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.showLocation}
                          onChange={(e) => handleInputChange('privacy', 'showLocation', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">اجازه پیام خصوصی</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">کاربران بتوانند برای شما پیام ارسال کنند</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.privacy.allowMessages}
                          onChange={(e) => handleInputChange('privacy', 'allowMessages', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    تنظیمات عمومی
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">حالت تاریک</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">تغییر ظاهر به حالت تاریک یا روشن</p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {theme === 'dark' ? 'روشن' : 'تاریک'}
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        زبان
                      </label>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="fa">فارسی</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        منطقه زمانی
                      </label>
                      <select
                        value={settings.preferences.timezone}
                        onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Asia/Tehran">تهران</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        فرمت تاریخ
                      </label>
                      <select
                        value={settings.preferences.dateFormat}
                        onChange={(e) => handleInputChange('preferences', 'dateFormat', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="persian">شمسی</option>
                        <option value="gregorian">میلادی</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data Management */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    مدیریت داده‌ها
                  </h2>
                  
                  <div className="space-y-4">
                    <button className="flex items-center space-x-3 space-x-reverse w-full p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <Download className="w-5 h-5" />
                      <div className="text-right">
                        <div className="font-medium">دانلود داده‌ها</div>
                        <div className="text-sm opacity-75">دریافت کپی از تمام اطلاعات شما</div>
                      </div>
                    </button>

                    <button className="flex items-center space-x-3 space-x-reverse w-full p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                      <Trash2 className="w-5 h-5" />
                      <div className="text-right">
                        <div className="font-medium">حذف حساب کاربری</div>
                        <div className="text-sm opacity-75">حذف دائمی حساب و تمام داده‌ها</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center space-x-2 space-x-reverse bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;