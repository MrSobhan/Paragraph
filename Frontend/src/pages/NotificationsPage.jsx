import React, { useState, useEffect } from 'react';
import { Bell, Check, User, Heart, MessageCircle, FileText, X, Trash2 } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';

const NotificationsPage = () => {
  const { navigate } = useRouter();
  const { fetchNotifications, markNotificationAsRead } = useApi();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    const result = await fetchNotifications();
    if (result.success) {
      // Show all notifications (both read and unread)
      setNotifications(result.data.notifications);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    const result = await markNotificationAsRead(notificationId);
    if (result.success) {
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    const result = await Swal.fire({
      title: 'آیا مطمئن هستید؟',
      text: 'این اعلان حذف خواهد شد!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'بله، حذف کن!',
      cancelButtonText: 'انصراف'
    });

    if (result.isConfirmed) {
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      await Swal.fire({
        title: 'حذف شد!',
        text: 'اعلان با موفقیت حذف شد.',
        icon: 'success',
        confirmButtonText: 'باشه'
      });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'newFollower':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'newLike':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'newComment':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'newPost':
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'newFollower':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'newLike':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'newComment':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'newPost':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.relatedPost) {
      navigate(`/post/${notification.relatedPost._id || notification.relatedPost}`);
    } else if (notification.relatedUser) {
      navigate(`/user/${notification.relatedUser._id || notification.relatedUser}`);
    }
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <Loader text="در حال بارگذاری اعلان‌ها..." />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">اعلان‌ها</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {notifications.filter(n => !n.isRead).length} اعلان خوانده نشده از {notifications.length} اعلان
              </p>
            </div>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                اعلانی ندارید
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                هنوز اعلانی دریافت نکرده‌اید
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`border rounded-xl p-4 transition-all hover:shadow-md ${getNotificationColor(notification.type)} ${
                    notification.isRead ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className="text-right w-full hover:opacity-80 transition-opacity"
                      >
                        <p className={`font-medium mb-1 ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(notification.createdAt).toLocaleDateString('fa-IR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </button>
                    </div>

                    <div className="flex-shrink-0 flex space-x-2 space-x-reverse">
                      {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-gray-400 hover:text-green-500 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="علامت‌گذاری به عنوان خوانده شده"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="حذف اعلان"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;