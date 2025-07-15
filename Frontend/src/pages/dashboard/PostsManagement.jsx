import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useApi } from '../../hooks/useApi';

const PostsManagement = () => {
  const { fetchPosts, axiosInstance } = useApi();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await fetchPosts(1, 100);
      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error('خطا در بارگذاری پست‌ها:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishPost = async (postId) => {
    try {
      await axiosInstance.put(`/posts/${postId}/publish`);
      loadPosts();
    } catch (error) {
      console.error('خطا در انتشار پست:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (confirm('آیا از حذف این پست اطمینان دارید؟')) {
      try {
        await axiosInstance.delete(`/posts/${postId}`);
        loadPosts();
      } catch (error) {
        console.error('خطا در حذف پست:', error);
      }
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout activeTab="posts">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="posts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت پست‌ها</h1>
          <div className="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="جستجو پست‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-blue-500" />
              <div className="mr-2 sm:mr-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">کل پست‌ها</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="mr-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">منتشر شده</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {posts.filter(p => p.isPublished).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-yellow-500" />
              <div className="mr-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">پیش‌نویس</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {posts.filter(p => !p.isPublished).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-purple-500" />
              <div className="mr-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">کل بازدید</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {posts.reduce((sum, p) => sum + (p.views || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto min-w-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    عنوان
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    نویسنده
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    بازدید
                  </th>
                  <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    تاریخ
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center">
                        {post.coverImage && (
                          <img 
                            src={post.coverImage} 
                            alt={post.title}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover ml-2 sm:ml-4"
                          />
                        )}
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                            {post.title}
                          </div>
                          <div className="hidden sm:block text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {post.summary}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={post.author?.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                          alt={post.author?.name}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ml-2 sm:ml-3"
                        />
                        <div className="text-sm text-gray-900 dark:text-white">
                          {post.author?.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.isPublished 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {post.isPublished ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {post.views || 0}
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1 sm:space-x-2 space-x-reverse">
                        <button
                          onClick={() => window.open(`/post/${post._id}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="مشاهده"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!post.isPublished && (
                          <button
                            onClick={() => handlePublishPost(post._id)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="انتشار"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostsManagement;