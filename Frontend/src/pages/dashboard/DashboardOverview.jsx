import React, { useState, useEffect } from 'react';
import { Users, FileText, MessageCircle, Hash, TrendingUp, Eye, Heart } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useApi } from '../../hooks/useApi';

const DashboardOverview = () => {
  const { fetchPosts, fetchNotifications } = useApi();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalTopics: 0,
    pendingComments: 0,
    recentActivity: []
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // در اینجا باید از API واقعی استفاده کنید
    setStats({
      totalUsers: 1250,
      totalPosts: 450,
      totalComments: 890,
      totalTopics: 25,
      pendingComments: 12,
      recentActivity: [
        { type: 'user', message: 'کاربر جدید ثبت‌نام کرد', time: '۵ دقیقه پیش' },
        { type: 'post', message: 'پست جدید منتشر شد', time: '۱۰ دقیقه پیش' },
        { type: 'comment', message: 'نظر جدید در انتظار تایید', time: '۱۵ دقیقه پیش' }
      ]
    });
  };

  const statCards = [
    {
      title: 'کل کاربران',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'کل پست‌ها',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'کل نظرات',
      value: stats.totalComments,
      icon: MessageCircle,
      color: 'bg-yellow-500',
      change: '+15%'
    },
    {
      title: 'کل موضوعات',
      value: stats.totalTopics,
      icon: Hash,
      color: 'bg-purple-500',
      change: '+3%'
    }
  ];

  return (
    <DashboardLayout activeTab="overview">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {card.value.toLocaleString('fa-IR')}
                  </p>
                  <p className="text-sm text-green-600 mt-1">{card.change}</p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              فعالیت‌های اخیر
            </h3>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              اقدامات سریع
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 space-x-reverse p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>تایید {stats.pendingComments} نظر در انتظار</span>
              </button>
              <button className="w-full flex items-center space-x-3 space-x-reverse p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <FileText className="w-5 h-5" />
                <span>مدیریت پست‌های جدید</span>
              </button>
              <button className="w-full flex items-center space-x-3 space-x-reverse p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                <Users className="w-5 h-5" />
                <span>مدیریت کاربران</span>
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            وضعیت سیستم
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">سرور: آنلاین</span>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">دیتابیس: متصل</span>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">بک‌آپ: در حال انجام</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;