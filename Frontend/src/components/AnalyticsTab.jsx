import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsTab = () => {
  const { fetchPosts } = useApi();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalViews: 0,
    totalPosts: 0,
    weeklyViews: [],
    chartData: null
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Get user's posts
      const result = await fetchPosts(1, 100);
      if (result.success) {
        const userPosts = result.data.filter(post => post.author._id === user._id);
        
        // Calculate analytics
        let totalViews = 0;
        const weeklyViews = [0, 0, 0, 0, 0, 0, 0]; // 7 days
        
        userPosts.forEach(post => {
          if (post.views && Array.isArray(post.views)) {
            post.views.forEach((dayViews, index) => {
              if (index < 7) {
                weeklyViews[index] += dayViews;
                totalViews += dayViews;
              }
            });
          }
        });

        const chartData = {
          labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
          datasets: [
            {
              label: 'بازدید روزانه',
              data: weeklyViews,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        };

        setAnalyticsData({
          totalViews,
          totalPosts: userPosts.length,
          weeklyViews,
          chartData
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'آمار بازدید هفتگی پست‌های شما',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return <Loader text="در حال بارگذاری آمار..." />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">کل بازدیدها</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.totalViews.toLocaleString('fa-IR')}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">تعداد پست‌ها</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.totalPosts.toLocaleString('fa-IR')}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">میانگین بازدید</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData.totalPosts > 0 
                  ? Math.round(analyticsData.totalViews / analyticsData.totalPosts).toLocaleString('fa-IR')
                  : '0'
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          نمودار بازدید هفتگی
        </h3>
        {analyticsData.chartData && (
          <div className="h-80">
            <Line data={analyticsData.chartData} options={chartOptions} />
          </div>
        )}
      </div>

      {/* Weekly Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          جزئیات بازدید هفتگی
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'].map((day, index) => (
            <div key={day} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{day}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {analyticsData.weeklyViews[index]?.toLocaleString('fa-IR') || '0'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;