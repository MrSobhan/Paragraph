import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Hash, Save, X } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useApi } from '../../hooks/useApi';

const TopicsManagement = () => {
  const { fetchTopics, axiosInstance } = useApi();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentTopic: '',
    isMainTopic: true
  });

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const result = await fetchTopics();
      if (result.success) {
        setTopics(result.data);
      }
    } catch (error) {
      console.error('خطا در بارگذاری موضوعات:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/topics', formData);
      loadTopics();
      resetForm();
    } catch (error) {
      console.error('خطا در ایجاد موضوع:', error);
    }
  };

  const handleUpdateTopic = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/topics/${editingTopic._id}`, formData);
      loadTopics();
      resetForm();
    } catch (error) {
      console.error('خطا در بروزرسانی موضوع:', error);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (confirm('آیا از حذف این موضوع اطمینان دارید؟')) {
      try {
        await axiosInstance.delete(`/topics/${topicId}`);
        loadTopics();
      } catch (error) {
        console.error('خطا در حذف موضوع:', error);
      }
    }
  };

  const startEdit = (topic) => {
    setEditingTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description || '',
      parentTopic: topic.parentTopic?._id || '',
      isMainTopic: topic.isMainTopic
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parentTopic: '',
      isMainTopic: true
    });
    setEditingTopic(null);
    setShowModal(false);
  };

  const filteredTopics = topics.filter(topic =>
    topic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout activeTab="topics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="topics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت موضوعات</h1>
          <div className="mt-4 sm:mt-0 flex space-x-3 space-x-reverse">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 space-x-reverse bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>موضوع جدید</span>
            </button>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="جستجو موضوعات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Hash className="w-8 h-8 text-blue-500" />
              <div className="mr-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">کل موضوعات</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{topics.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Hash className="w-8 h-8 text-green-500" />
              <div className="mr-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">موضوعات اصلی</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {topics.filter(t => t.isMainTopic).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Hash className="w-8 h-8 text-purple-500" />
              <div className="mr-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">زیر موضوعات</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {topics.filter(t => !t.isMainTopic).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <div key={topic._id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {topic.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      topic.isMainTopic 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {topic.isMainTopic ? 'موضوع اصلی' : 'زیر موضوع'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1 space-x-reverse">
                  <button
                    onClick={() => startEdit(topic)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="ویرایش"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTopic(topic._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {topic.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {topic.description}
                </p>
              )}
              
              {topic.parentTopic && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  زیر موضوع: {topic.parentTopic.name}
                </p>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  ایجاد شده در {new Date(topic.createdAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={resetForm}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingTopic ? 'ویرایش موضوع' : 'موضوع جدید'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={editingTopic ? handleUpdateTopic : handleCreateTopic} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نام موضوع *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      توضیحات
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      موضوع والد
                    </label>
                    <select
                      value={formData.parentTopic}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentTopic: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">بدون والد (موضوع اصلی)</option>
                      {topics.filter(t => t.isMainTopic && t._id !== editingTopic?._id).map(topic => (
                        <option key={topic._id} value={topic._id}>{topic.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="isMainTopic"
                      checked={formData.isMainTopic}
                      onChange={(e) => setFormData(prev => ({ ...prev, isMainTopic: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isMainTopic" className="text-sm text-gray-700 dark:text-gray-300">
                      موضوع اصلی
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-3 space-x-reverse mt-6">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 space-x-reverse bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingTopic ? 'بروزرسانی' : 'ایجاد'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TopicsManagement;