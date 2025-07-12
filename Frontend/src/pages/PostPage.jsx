import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share, Eye, MoreHorizontal, Edit, Flag } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { mockArticles, mockComments, mockUsers } from '../data/mockData';

const PostPage = () => {
  const { params, navigate } = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  const article = mockArticles.find(a => a.id === params.postId);
  
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

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
      setShowCommentForm(false);
    }
  };

  const relatedPosts = mockArticles.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Article Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {/* Author Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <button onClick={() => navigate(`/user/${article.author.username}`)}>
                <img 
                  src={article.author.avatar} 
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                />
              </button>
              <div>
                <button 
                  onClick={() => navigate(`/user/${article.author.username}`)}
                  className="text-right hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">{article.author.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{article.author.username}</p>
                </button>
                <p className="text-sm text-gray-400 dark:text-gray-500">{article.publishedAt} • {article.readTime} دقیقه مطالعه</p>
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
              <span className="text-sm">{article.stats.views} بازدید</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{article.stats.likes} پسند</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{article.stats.comments} نظر</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white dark:bg-gray-800">
        <div className="p-6">
          {/* Featured Image */}
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
          />

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
                <span>{article.stats.likes + (liked ? 1 : 0)}</span>
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
              <button className="p-2 text-gray-500 hover:text-green-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
            <div className="flex space-x-3 space-x-reverse">
              <img 
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
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
            نظرات ({mockComments.length})
          </h3>
          
          <div className="space-y-6">
            {mockComments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-b-0">
                <div className="flex space-x-3 space-x-reverse">
                  <button onClick={() => navigate(`/user/${comment.author.username}`)}>
                    <img 
                      src={comment.author.avatar} 
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                    />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <button 
                        onClick={() => navigate(`/user/${comment.author.username}`)}
                        className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {comment.author.name}
                      </button>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{comment.publishedAt}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <button className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{comment.likes}</span>
                      </button>
                      <button className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                        پاسخ
                      </button>
                    </div>
                    
                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 mr-6 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex space-x-3 space-x-reverse">
                            <button onClick={() => navigate(`/user/${reply.author.username}`)}>
                              <img 
                                src={reply.author.avatar} 
                                alt={reply.author.name}
                                className="w-8 h-8 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                              />
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 space-x-reverse mb-1">
                                <button 
                                  onClick={() => navigate(`/user/${reply.author.username}`)}
                                  className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                                >
                                  {reply.author.name}
                                </button>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{reply.publishedAt}</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{reply.content}</p>
                              <button className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-red-500 transition-colors">
                                <Heart className="w-3 h-3" />
                                <span className="text-xs">{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div className="bg-blue-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            مطالب مرتبط
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <button 
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="w-full text-right"
                >
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 dark:text-gray-400">
                      <span>{post.author.name}</span>
                      <span>•</span>
                      <span>{post.publishedAt}</span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;