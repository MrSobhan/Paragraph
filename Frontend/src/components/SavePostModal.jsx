import React, { useState, useEffect } from 'react';
import { X, Plus, Bookmark, Lock, Globe, Trash2, Edit3 } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const SavePostModal = ({ isOpen, onClose, postId, postTitle }) => {
  const { fetchUserLists, createList, addPostToList, removePostFromList, deleteList, updateList } = useApi();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [newListData, setNewListData] = useState({
    name: '',
    description: '',
    isPrivate: false
  });

  useEffect(() => {
    if (isOpen) {
      loadLists();
    }
  }, [isOpen]);

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
    if (!newListData.name.trim()) return;

    setLoading(true);
    const result = await createList(newListData);
    if (result.success) {
      setLists(prev => [...prev, result.data.list]);
      setNewListData({ name: '', description: '', isPrivate: false });
      setShowCreateForm(false);
    }
    setLoading(false);
  };

  const handleUpdateList = async (e) => {
    e.preventDefault();
    if (!newListData.name.trim() || !editingList) return;

    setLoading(true);
    const result = await updateList(editingList._id, newListData);
    if (result.success) {
      setLists(prev => prev.map(list => 
        list._id === editingList._id ? result.data.list : list
      ));
      setEditingList(null);
      setNewListData({ name: '', description: '', isPrivate: false });
    }
    setLoading(false);
  };

  const handleDeleteList = async (listId) => {
    if (!confirm('آیا از حذف این لیست اطمینان دارید؟')) return;

    setLoading(true);
    const result = await deleteList(listId);
    if (result.success) {
      setLists(prev => prev.filter(list => list._id !== listId));
    }
    setLoading(false);
  };

  const handleTogglePostInList = async (list) => {
    const isPostInList = list.posts.includes(postId);
    setLoading(true);

    const result = isPostInList 
      ? await removePostFromList(list._id, postId)
      : await addPostToList(list._id, postId);

    if (result.success) {
      setLists(prev => prev.map(l => {
        if (l._id === list._id) {
          return {
            ...l,
            posts: isPostInList 
              ? l.posts.filter(id => id !== postId)
              : [...l.posts, postId]
          };
        }
        return l;
      }));
    }
    setLoading(false);
  };

  const startEditList = (list) => {
    setEditingList(list);
    setNewListData({
      name: list.name,
      description: list.description || '',
      isPrivate: list.isPrivate
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingList(null);
    setShowCreateForm(false);
    setNewListData({ name: '', description: '', isPrivate: false });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            ذخیره در لیست
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">پست انتخاب شده:</p>
          <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
            {postTitle}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
              <form onSubmit={editingList ? handleUpdateList : handleCreateList}>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={newListData.name}
                      onChange={(e) => setNewListData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="نام لیست..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      value={newListData.description}
                      onChange={(e) => setNewListData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="توضیحات (اختیاری)..."
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={newListData.isPrivate}
                      onChange={(e) => setNewListData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isPrivate" className="text-sm text-gray-700 dark:text-gray-300">
                      لیست خصوصی
                    </label>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      type="submit"
                      disabled={loading || !newListData.name.trim()}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg transition-colors"
                    >
                      {editingList ? 'ویرایش' : 'ایجاد'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Lists */}
          <div className="p-4">
            {/* Create New List Button */}
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full flex items-center space-x-3 space-x-reverse p-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors mb-4"
              >
                <Plus className="w-5 h-5" />
                <span>ایجاد لیست جدید</span>
              </button>
            )}

            {/* Lists Grid */}
            {loading && lists.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">در حال بارگذاری...</p>
              </div>
            ) : lists.length === 0 ? (
              <div className="text-center py-8">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">هنوز لیستی ایجاد نکرده‌اید</p>
              </div>
            ) : (
              <div className="space-y-2">
                {lists.map((list) => (
                  <div
                    key={list._id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse flex-1">
                      <button
                        onClick={() => handleTogglePostInList(list)}
                        disabled={loading}
                        className="flex-shrink-0"
                      >
                        <Bookmark 
                          className={`w-5 h-5 transition-colors ${
                            list.posts.includes(postId)
                              ? 'text-blue-500 fill-current'
                              : 'text-gray-400 hover:text-blue-500'
                          }`}
                        />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {list.name}
                          </h3>
                          {list.isPrivate ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Globe className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        {list.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {list.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {list.posts.length} پست
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 space-x-reverse">
                      <button
                        onClick={() => startEditList(list)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavePostModal;