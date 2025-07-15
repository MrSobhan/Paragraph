import React, { useState } from 'react';
import { useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share, Eye, MoreHorizontal, Edit, Flag } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';
import Loader from '../components/Loader';

const PostPage = () => {
  const { params, navigate } = useRouter();
  const { fetchPost, fetchComments, createComment, toggleLike } = useApi();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  
  useEffect(() => {
    if (params.postId) {
      loadPost();
      loadComments();
    }
  }, [params.postId]);

  const loadPost = async () => {
    const result = await fetchPost(params.postId);
    if (result.success) {
      setArticle(result.data.post);
    }
    setLoading(false);
  };

  const loadComments = async () => {
    const result = await fetchComments(params.postId);
    if (result.success) {
      setComments(result.data);
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
    const result = await toggleLike(params.postId);
    if (result.success) {
      setLiked(!liked);
      // Update article stats
      setArticle(prev => ({
        ...prev,
        likesCount: liked ? prev.likesCount - 1 : prev.likesCount + 1
      }));
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      submitComment();
    }
  };

  const submitComment = async () => {
    const commentData = {
      content: newComment,
      postId: params.postId,
      parentComment: null,
      rating: rating
    };

    const result = await createComment(commentData);
    if (result.success) {
      setNewComment('');
      setShowCommentForm(false);
      setRating(5);
      // Reload comments
      loadComments();
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('لینک در کلیپ‌بورد کپی شد');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('لینک در کلیپ‌بورد کپی شد');
    }
  };

  const defaultAvatar = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop";

  return (
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
                  {new Date(article.createdAt).toLocaleDateString('fa-IR')} • {article.estimatedReadTime} دقیقه مطالعه
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
              <span className="text-sm">{article.views || 0} بازدید</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{article.likesCount || 0} پسند</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{article.commentsCount || 0} نظر</span>
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
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
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
                className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                  liked 
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                    : 'text-gray-500 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span>{article.likesCount + (liked ? 1 : 0)}</span>
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
                className={`p-2 rounded-lg transition-colors ${
                  bookmarked 
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
            نظرات ({comments.length})
          </h3>
          
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-b-0">
                <div className="flex space-x-3 space-x-reverse">
                  <button onClick={() => navigate(`/user/${comment.author._id}`)}>
                    <img 
                      src={comment.author.avatar || defaultAvatar} 
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                    />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <button 
                        onClick={() => navigate(`/user/${comment.author._id}`)}
                        className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {comment.author.name}
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
  );
};

export default PostPage;