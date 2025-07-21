import React, { useState, useEffect } from 'react';
import { Users, FileText, MessageCircle, Hash, Eye, Crown, Ban } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useApi } from '../../hooks/useApi';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardOverview = () => {
  const { fetchDashboardStats } = useApi();
  const [stats, setStats] = useState({
    overview: {},
    charts: {},
    recentActivity: [],
    topAuthors: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const result = await fetchDashboardStats();
    if (result.success) {
      setStats(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <DashboardLayout activeTab="overview">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      title: 'کل کاربران',
      value: stats.overview.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      subtitle: `${stats.overview.bannedUsers || 0} مسدود شده`
    },
    {
      title: 'کل پست‌ها',
      value: stats.overview.totalPosts || 0,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%',
      subtitle: `${stats.overview.publishedPosts || 0} منتشر شده`
    },
    {
      title: 'کل نظرات',
      value: stats.overview.totalComments || 0,
      icon: MessageCircle,
      color: 'bg-yellow-500',
      change: '+15%',
      subtitle: `${stats.overview.pendingComments || 0} در انتظار`
    },
    {
      title: 'کل بازدیدها',
      value: stats.overview.totalViews || 0,
      icon: Eye,
      color: 'bg-purple-500',
      change: '+25%',
      subtitle: 'این ماه'
    }
  ];

  // Chart configurations
  const monthlyViewsChart = {
    labels: stats.charts.monthlyViews?.map(item => item.month) || [],
    datasets: [
      {
        label: 'بازدید ماهانه',
        data: stats.charts.monthlyViews?.map(item => item.views) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const postsChart = {
    labels: stats.charts.postsByStatus?.map(item => item.status) || [],
    datasets: [
      {
        data: stats.charts.postsByStatus?.map(item => item.count) || [],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <DashboardLayout activeTab="overview">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {card.value.toLocaleString('fa-IR')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.subtitle}</p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Monthly Views Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              بازدید ماهانه
            </h3>
            <div className="h-64">
              <Line data={monthlyViewsChart} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }} />
            </div>
          </div>

          {/* Posts Status Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              وضعیت پست‌ها
            </h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={postsChart} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }} />
            </div>
          </div>
        </div>

        {/* Activity and Top Authors */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              فعالیت‌های اخیر
            </h3>
            <div className="space-y-4">
              {stats.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Authors */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              نویسندگان برتر
            </h3>
            <div className="space-y-4">
              {stats.topAuthors.map((author, index) => (
                <div key={author._id} className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    <img
                      src={author.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                      alt={author.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {author.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {author.postCount} پست
                    </p>
                  </div>
                  <div className="text-sm font-bold text-blue-500">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            آمار تفصیلی
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.overview.totalAdmins || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">مدیران</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Hash className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.overview.totalTopics || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">موضوعات</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Ban className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.overview.bannedUsers || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">مسدود شده</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.overview.approvedComments || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">نظرات تایید شده</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;