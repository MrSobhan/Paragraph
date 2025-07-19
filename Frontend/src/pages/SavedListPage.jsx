import React, { useState, useEffect } from 'react';
import { ArrowRight, Bookmark, Eye, Trash2 } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';
import ArticleCard from '../components/ArticleCard';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';

const SavedListPage = () => {
  const { params, navigate } = useRouter();
  const { fetchUserLists, removePostFromList, fetchPosts } = useApi();
  const [list, setList] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.listId) {
      loadList();
    }
  }, [params.listId]);

  const loadList = async () => {
    setLoading(true);
    const result = await fetchUserLists();
    if (result.success) {
      const foundList = result.data.find(l => l._id == params.listId);

      if (foundList) {
        setList(foundList);

        // Search posts
        const postsResult = await fetchPosts(1, 20);
        const posts = postsResult.success ? postsResult.data : [];

        const foundPosts = posts.filter(post => foundList.posts.includes(post._id));

        setPosts(foundPosts || []);
      }
    }
    setLoading(false);
  };

  const handleRemovePost = async (postId) => {
    const result = await Swal.fire({
      title: 'آیا مطمئن هستید؟',
      text: 'این پست از لیست حذف خواهد شد!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'بله، حذف کن!',
      cancelButtonText: 'انصراف'
    });

    if (result.isConfirmed) {
      const removeResult = await removePostFromList(list._id, postId);
      if (removeResult.success) {
        setPosts(prev => prev.filter(p => p._id !== postId));
        await Swal.fire({
          title: 'حذف شد!',
          text: 'پست از لیست حذف شد.',
          icon: 'success',
          confirmButtonText: 'باشه'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <Loader text="در حال بارگذاری لیست..." />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">لیست یافت نشد</h2>
          <button
            onClick={() => navigate('/saved-posts')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            بازگشت به لیست‌ها
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <button
            onClick={() => navigate('/saved-posts')}
            className="flex items-center space-x-2 space-x-reverse text-blue-500 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به لیست‌ها</span>
          </button>

          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Bookmark className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {list.name}
              </h1>
              {list.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {list.description}
                </p>
              )}
              <div className="flex items-center space-x-4 space-x-reverse mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>{posts.length} پست ذخیره شده</span>
                <span>ایجاد شده در {new Date(list.createdAt).toLocaleDateString('fa-IR')}</span>
                {list.isPrivate && <span className="text-orange-500">خصوصی</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="p-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                این لیست خالی است
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                هنوز پستی در این لیست ذخیره نکرده‌اید
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post._id} className="relative">
                  <ArticleCard
                    id={post._id}
                    title={post.title}
                    content={post.summary}
                    author={post.author}
                    image={post.coverImage}
                    stats={{
                      likes: post.likesCount || 0,
                      comments: post.commentsCount || 0,
                      views: post.views || 0
                    }}
                    publishedAt={new Date(post.createdAt).toLocaleDateString('fa-IR')}
                    tags={post.tags}
                    readTime={post.estimatedReadTime}
                  />

                  {/* Remove from list button */}
                  <button
                    onClick={() => handleRemovePost(post._id)}
                    className="absolute top-4 left-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="حذف از لیست"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedListPage;