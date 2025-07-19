import React, { useState } from 'react';
import { useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share, Eye, MoreHorizontal, Edit, Flag } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import AuthModal from '../components/AuthModal';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';
import { useRef } from 'react';

const PostPage = () => {
  const { params, navigate } = useRouter();
  const { fetchPost, createComment, toggleLike, fetchPosts } = useApi();
  const { isLogin } = useAuth();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (params.postId && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadPost();
      loadRelatedPosts();
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      setLiked(likedPosts.includes(params.postId));
    }
  }, [params.postId]);

  useEffect(() => {
    hasLoadedRef.current = false;
  }, [params.postId]);

  const loadPost = async () => {
    // if(article?.length == 0){
      const result = await fetchPost(params.postId);
  
      if (result.success) {
        setArticle(result.data.post);
        setComments(result.data.comments)
      }
    // }

    console.log(result.data.comments);
    
    setLoading(false);
  };

  const loadRelatedPosts = async () => {
    const result = await fetchPosts(1, 10);
    if (result.success) {
      // Get 3 random posts
      const shuffled = result.data.sort(() => 0.5 - Math.random());
      setRelatedPosts(shuffled.slice(0, 3));
    }
  };

  const getTotalViews = (views) => {
    if (Array.isArray(views)) {
      return views.reduce((sum, view) => sum + view, 0);
    }
    return views || 0;
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 1 ? 'همین الان' : `${diffInMinutes} دقیقه پیش`;
      }
      return `${diffInHours} ساعت پیش`;
    } else if (diffInDays === 1) {
      return 'دیروز';
    } else if (diffInDays < 7) {
      return `${diffInDays} روز پیش`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} هفته پیش`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ماه پیش`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} سال پیش`;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <Loader text="در حال بارگذاری..." />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">مقاله یافت نشد</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    if (!isLogin) {
      setShowAuthModal(true);
      return;
    }

    const result = await toggleLike(params.postId);
    if (result.success) {
      const newLikedState = !liked;
      setLiked(newLikedState);

      // Update localStorage
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      if (newLikedState) {
        likedPosts.push(params.postId);
      } else {
        const index = likedPosts.indexOf(params.postId);
        if (index > -1) likedPosts.splice(index, 1);
      }
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

      // Update article stats
      setArticle(prev => ({
        ...prev,
        likesCount: newLikedState ? (prev.likesCount || 0) + 1 : Math.max(0, (prev.likesCount || 0) - 1)
      }));
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!isLogin) {
      setShowAuthModal(true);
      return;
    }
    if (newComment.trim()) {
      submitComment();
    }
  };

  const submitComment = async () => {
    const commentData = {
      content: newComment,
      postId: params.postId,
      parentComment: null,
      rating
    };

    const result = await createComment(commentData);
    if (result.success) {
      setNewComment('');
      // setShowCommentForm(false);
      setRating(5);
      await Swal.fire({
        title: 'موفقیت!',
        text: 'نظر با موفقیت ایجاد شد و در انتظار تأیید است',
        icon: 'success',
        confirmButtonText: 'باشه'
      });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      await Swal.fire({
        title: 'کپی شد!',
        text: 'لینک در کلیپ‌بورد کپی شد',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      await Swal.fire({
        title: 'کپی شد!',
        text: 'لینک در کلیپ‌بورد کپی شد',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const defaultAvatar = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop";

  return (
    <>
      <div className="flex-1 max-w-4xl mx-auto">
        {/* Article Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-6">
            {/* Author Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <button onClick={() => navigate(`/user/${article.author._id}`)}>
                  <img
                    src={article.author.avatar || defaultAvatar}
                    alt={article.author.name}
                    className="w-12 h-12 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                  />
                </button>
                <div>
                  <button
                    onClick={() => navigate(`/user/${article.author._id}`)}
                    className="text-right hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white">{article.author.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{article.author.username || article.author.email}</p>
                  </button>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {getTimeAgo(article.createdAt)} • {article.estimatedReadTime} دقیقه مطالعه
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <button className="p-2 text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Flag className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 space-x-reverse text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1 space-x-reverse">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{getTotalViews(article.views)} بازدید</span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{article.likeCount || 0} پسند</span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{comments?.length || 0} نظر</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white dark:bg-gray-800">
          <div className="p-6">
            {/* Featured Image */}
            {article.coverImage && (
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
              />
            )}

            {/* Article Body */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div 
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${liked
                      ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'text-gray-500 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{article.likeCount || 0}</span>
                </button>

                <button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>نظر</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg transition-colors ${bookmarked
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-500 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-500 hover:text-green-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Share className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                مقالات مرتبط
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <button
                    key={post._id}
                    onClick={() => navigate(`/post/${post._id}`)}
                    className="text-right hover:shadow-lg transition-shadow bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden"
                  >
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {post.summary}
                      </p>
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>{post.author.name}</span>
                        <span>{post.estimatedReadTime} دقیقه</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Comment Form */}
        {showCommentForm && (
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
            <form onSubmit={handleCommentSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  امتیاز شما (۱ تا ۵):
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={1}>۱ - ضعیف</option>
                  <option value={2}>۲ - متوسط</option>
                  <option value={3}>۳ - خوب</option>
                  <option value={4}>۴ - عالی</option>
                  <option value={5}>۵ - فوق‌العاده</option>
                </select>
              </div>
              <div className="flex space-x-3 space-x-reverse">
                <img
                  src={defaultAvatar}
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="نظر خود را بنویسید..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <button
                      type="button"
                      onClick={() => setShowCommentForm(false)}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      ارسال نظر
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              نظرات ({comments?.length ? comments.length : 0})
            </h3>

            <div className="space-y-6">
              {comments?.length && comments.map((comment) => (
                <div key={comment._id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-b-0">
                  <div className="flex space-x-3 space-x-reverse">
                    <button onClick={() => navigate(`/user/${comment.userId._id}`)}>
                      <img
                        src={comment.userId?.avatar || defaultAvatar}
                        alt={comment.userId?.name}
                        className="w-10 h-10 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                      />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        <button
                          onClick={() => navigate(`/user/${comment.userId._id}`)}
                          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {comment.userId?.name}
                        </button>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                        {comment.rating && (
                          <span className="text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded">
                            امتیاز: {comment.rating}/۵
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <button className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{comment.likesCount || 0}</span>
                        </button>
                        <button className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                          پاسخ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
};

export default PostPage;