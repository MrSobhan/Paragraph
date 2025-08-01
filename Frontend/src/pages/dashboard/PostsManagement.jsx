import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, X, Save, Hash } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useApi } from '../../hooks/useApi';
import useAxios from '../../hooks/useAxios';
import { useAuth } from '../../contexts/AuthContext';

const PostsManagement = () => {
  const { baseUrl  } = useAuth();
  const { fetchPostsAdmin, publishPost, deletePost, fetchTopics } = useApi();
  const axiosInstance = useAxios();
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    summary: '',
    topics: [],
    tags: [],
    estimatedReadTime: 1
  });

  useEffect(() => {
    loadPosts();
    loadTopics();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await fetchPostsAdmin(1, 100);
      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error('خطا در بارگذاری پست‌ها:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async () => {
    const result = await fetchTopics();
    if (result.success) {
      setTopics(result.data);
    }
  };

  const handlePublishPost = async (postId) => {
    const result = await publishPost(postId);
    if (result.success) {
      loadPosts();
    } else {
      console.error(result.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (confirm('آیا از حذف این پست اطمینان دارید؟')) {
      const result = await deletePost(postId);
      if (result.success) {
        loadPosts();
      } else {
        console.error(result.message);
      }
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditFormData({
      title: post.title || '',
      content: post.content || '',
      summary: post.summary || '',
      topics: post.topics?.map(t => t._id) || [],
      tags: post.tags || [],
      estimatedReadTime: post.estimatedReadTime || 1
    });
    setShowEditModal(true);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/posts/${editingPost._id}`, editFormData);
      loadPosts();
      closeEditModal();
    } catch (error) {
      console.error('خطا در بروزرسانی پست:', error);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPost(null);
    setEditFormData({
      title: '',
      content: '',
      summary: '',
      topics: [],
      tags: [],
      estimatedReadTime: 1
    });
  };

  const handleTopicToggle = (topicId) => {
    setEditFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topicId)
        ? prev.topics.filter(id => id !== topicId)
        : [...prev.topics, topicId]
    }));
  };

  const getAllViews = () => {
    let total = 0;
    posts.forEach(p => {
      if (Array.isArray(p.views)) {
        total += p.views.reduce((sum, view) => sum + view, 0);
      }
    });
    return total.toLocaleString();
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
                  {getAllViews()}
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
                          src={post.author?.avatar ? (baseUrl.replace(new RegExp('/v1', 'g'), '') + post.author?.avatar) :  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                          alt={post.author?.name}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ml-2 sm:ml-3"
                        />
                        <div className="text-sm text-gray-900 dark:text-white">
                          {post.author?.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.isPublished
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                        {post.isPublished ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {
                        Array.isArray(post.views) &&
                        post.views.reduce((sum, view) => sum + view, 0) || 0
                      }
                    </td>
                    <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1 sm:space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="ویرایش"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
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

      {/* Edit Post Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeEditModal}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                ویرایش پست
              </h2>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePost} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    عنوان پست
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    خلاصه
                  </label>
                  <textarea
                    value={editFormData.summary}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, summary: e.target.value }))}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    محتوا
                  </label>
                  <textarea
                    value={editFormData.content}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    موضوعات
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                    {topics.map((topic) => (
                      <label
                        key={topic._id}
                        className="flex items-center space-x-2 space-x-reverse cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={editFormData.topics.includes(topic._id)}
                          onChange={() => handleTopicToggle(topic._id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">{topic.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    زمان تخمینی مطالعه (دقیقه)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.estimatedReadTime}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, estimatedReadTime: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 space-x-reverse mt-6">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-2 space-x-reverse bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره تغییرات</span>
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PostsManagement;