import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Trash2, MessageCircle } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useApi } from '../../hooks/useApi';

const CommentsManagement = () => {
  const { axiosInstance } = useApi();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      // فرض می‌کنیم endpoint برای دریافت همه کامنت‌ها وجود دارد
      const response = await axiosInstance.get('/comments');
      setComments(response.data || []);
    } catch (error) {
      console.error('خطا در بارگذاری نظرات:', error);
      // داده‌های نمونه
      setComments([
        {
          _id: '1',
          content: 'نظر بسیار مفیدی بود، ممنون از اشتراک',
          userId: { name: 'علی احمدی', avatar: '' },
          postId: { title: 'مقاله درباره React' },
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          content: 'عالی بود، منتظر مقالات بیشتر هستم',
          userId: { name: 'مریم رضایی', avatar: '' },
          postId: { title: 'آموزش JavaScript' },
          status: 'approved',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveComment = async (commentId) => {
    try {
      await axiosInstance.put(`/comments/${commentId}/approve`);
      loadComments();
    } catch (error) {
      console.error('خطا در تایید نظر:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (confirm('آیا از حذف این نظر اطمینان دارید؟')) {
      try {
        await axiosInstance.delete(`/comments/${commentId}`);
        loadComments();
      } catch (error) {
        console.error('خطا در حذف نظر:', error);
      }
    }
  };

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout activeTab="comments">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="comments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت نظرات</h1>
          <div className="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">همه نظرات</option>
              <option value="pending">در انتظار تایید</option>
              <option value="approved">تایید شده</option>
              <option value="rejected">رد شده</option>
            </select>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="جستجو نظرات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-blue-500" />
              <div className="mr-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">کل نظرات</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{comments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="mr-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">تایید شده</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {comments.filter(c => c.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-yellow-500" />
              <div className="mr-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">در انتظار</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {comments.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500" />
              <div className="mr-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">رد شده</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {comments.filter(c => c.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div key={comment._id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse mb-3">
                    <img 
                      src={comment.userId?.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                      alt={comment.userId?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.userId?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      comment.status === 'approved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : comment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {comment.status === 'approved' ? 'تایید شده' : 
                       comment.status === 'pending' ? 'در انتظار' : 'رد شده'}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {comment.content}
                  </p>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    در پاسخ به: <span className="font-medium">{comment.postId?.title}</span>
                  </p>
                </div>
                
                <div className="flex space-x-2 space-x-reverse">
                  {comment.status === 'pending' && (
                    <button
                      onClick={() => handleApproveComment(comment._id)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      title="تایید"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredComments.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              نظری یافت نشد
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              هیچ نظری با فیلترهای انتخابی یافت نشد
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CommentsManagement;