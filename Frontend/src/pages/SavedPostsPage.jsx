import React, { useState, useEffect } from 'react';
import { Bookmark, Lock, Globe, Trash2, Edit3, Plus, Eye } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';

const SavedPostsPage = () => {
  const { navigate } = useRouter();
  const { fetchUserLists, deleteList, updateList, createList } = useApi();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false
  });

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    setLoading(true);
    const result = await fetchUserLists();
    if (result.success) {
      setLists(result.data);
    }
    setLoading(false);
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const result = await createList(formData);
    if (result.success) {
      setLists(prev => [...prev, result.data.list]);
      resetForm();
    }
  };

  const handleUpdateList = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !editingList) return;

    const result = await updateList(editingList._id, formData);
    if (result.success) {
      setLists(prev => prev.map(list => 
        list._id === editingList._id ? result.data.list : list
      ));
      resetForm();
    }
  };

  const handleDeleteList = async (listId) => {
    const result = await Swal.fire({
      title: 'آیا مطمئن هستید؟',
      text: 'این لیست برای همیشه حذف خواهد شد!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'بله، حذف کن!',
      cancelButtonText: 'انصراف'
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteList(listId);
      if (deleteResult.success) {
        setLists(prev => prev.filter(list => list._id !== listId));
        await Swal.fire({
          title: 'حذف شد!',
          text: 'لیست با موفقیت حذف شد.',
          icon: 'success',
          confirmButtonText: 'باشه'
        });
      }
    }
  };

  const startEdit = (list) => {
    setEditingList(list);
    setFormData({
      name: list.name,
      description: list.description || '',
      isPrivate: list.isPrivate
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', isPrivate: false });
    setShowCreateForm(false);
    setEditingList(null);
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <Loader text="در حال بارگذاری لیست‌ها..." />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <div className="p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">لیست‌های ذخیره شده</h1>
          <p className="text-xl md:text-2xl opacity-90">
            مجموعه‌ای از مطالب مورد علاقه شما
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="p-6">
          {/* Create Form */}
          {showCreateForm && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {editingList ? 'ویرایش لیست' : 'ایجاد لیست جدید'}
              </h3>
              <form onSubmit={editingList ? handleUpdateList : handleCreateList}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      نام لیست *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="نام لیست را وارد کنید..."
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="توضیحات لیست (اختیاری)..."
                    />
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={formData.isPrivate}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isPrivate" className="text-sm text-gray-700 dark:text-gray-300">
                      لیست خصوصی (فقط برای شما قابل مشاهده است)
                    </label>
                  </div>
                  <div className="flex space-x-3 space-x-reverse">
                    <button
                      type="submit"
                      disabled={!formData.name.trim()}
                      className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {editingList ? 'ویرایش' : 'ایجاد'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-6 py-2 transition-colors"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Create Button */}
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 space-x-reverse bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors mb-6"
            >
              <Plus className="w-5 h-5" />
              <span>ایجاد لیست جدید</span>
            </button>
          )}

          {/* Lists Grid */}
          {lists.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                هنوز لیستی ایجاد نکرده‌اید
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                برای سازماندهی مطالب مورد علاقه‌تان، لیست‌های جدید ایجاد کنید
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                ایجاد اولین لیست
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map((list) => (
                <div
                  key={list._id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Bookmark className="w-5 h-5 text-purple-500" />
                      {list.isPrivate ? (
                        <Lock className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Globe className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <button
                        onClick={() => startEdit(list)}
                        className="p-1 text-gray-400 hover:text-purple-500 transition-colors"
                        title="ویرایش"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteList(list._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {list.name}
                  </h3>

                  {list.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {list.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {list.posts.length} پست ذخیره شده
                    </div>
                    <button
                      onClick={() => navigate(`/saved-lists/${list._id}`)}
                      className="flex items-center space-x-1 space-x-reverse text-purple-500 hover:text-purple-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">مشاهده</span>
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      ایجاد شده در {new Date(list.createdAt).toLocaleDateString('fa-IR')}
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

export default SavedPostsPage;