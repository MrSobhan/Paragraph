import React from 'react';
import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share, Eye } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useAuth } from '../contexts/AuthContext';
import SavePostModal from './SavePostModal';
import AuthModal from './AuthModal';

const ArticleCard = ({
  id,
  title,
  content,
  author,
  image,
  stats,
  publishedAt,
  tags = [],
  readTime = 1
}) => {
  const { navigate } = useRouter();
  const { isLogin } = useAuth();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  

  const getTotalViews = (views) => {
    if (Array.isArray(views)) {
      return views.reduce((sum, view) => sum + view, 0);
    }
    return views || 0;
  };

  const getTimeAgo = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return 'تاریخ نامعتبر';
  }

  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now - date;

  if (diffInMs < 0) {
    return 'زمان آینده';
  }

  const diffInMinutes = Math.round(diffInMs / (1000 * 60));
  const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    if (diffInHours === 0) {
      return diffInMinutes <= 1 ? 'همین الان' : `${diffInMinutes} دقیقه پیش`;
    }
    return `${diffInHours} ساعت پیش`;
  } else if (diffInDays === 1) {
    return 'دیروز';
  } else if (diffInDays < 7) {
    return `${diffInDays} روز پیش`;
  } else if (diffInDays < 30) {
    const weeks = Math.round(diffInDays / 7);
    return `${weeks} هفته پیش`;
  } else if (diffInDays < 365) {
    const months = Math.round(diffInDays / 30);
    return `${months} ماه پیش`;
  } else {
    const years = Math.round(diffInDays / 365);
    return `${years} سال پیش`;
  }
};

  const handleSaveClick = () => {
    if (!isLogin) {
      setShowAuthModal(true);
      return;
    }
    setShowSaveModal(true);
  };

  const defaultAvatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
  return (
    <>
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
      {/* Article Image */}
      {image && (
        <div className="relative">
          <button onClick={() => navigate(`/post/${id}`)}>
            <img 
              src={image} 
              alt={title}
              className="!w-full h-88 object-cover rounded-t-xl hover:opacity-90 transition-opacity"
            />
          </button>
        </div>
      )}

      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center space-x-3 space-x-reverse mb-4">
          <button onClick={() => navigate(`/user/${author._id}`)}>
            <img 
              src={author.avatar || defaultAvatar} 
              alt={author.name}
              className="w-10 h-10 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
            />
          </button>
          <div className="flex-1">
            <button 
              onClick={() => navigate(`/user/${author._id}`)}
              className="text-right hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <p className="font-medium text-gray-900 dark:text-white text-sm">{author.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">@{author.username || author.email}</p>
            </button>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-500">
            <div>{publishedAt}</div>
            <div>{readTime} دقیقه مطالعه</div>
          </div>
        </div>

        {/* Article Content */}
        <div className="mb-4">
          <button 
            onClick={() => navigate(`/post/${id}`)}
            className="text-right w-full hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <p className="text-xl moraba font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-relaxed">
              {title}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
              {content}
            </p>
          </button>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-red-500 transition-colors group">
              <Heart className="w-4 h-4 group-hover:fill-current" />
              <span className="text-sm">{stats.likes}</span>
            </button>
            
            <button className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{stats.comments}</span>
            </button>
            
            <div className="flex items-center space-x-1 space-x-reverse text-gray-500">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{getTotalViews(stats.views)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <p 
              onClick={handleSaveClick}
              className="p-1 text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
            </p>
            <p className="p-1 text-gray-600 hover:text-green-500 transition-colors cursor-pointer">
              <Share className="w-4 h-4" />
            </p>
          </div>
        </div>
      </div>
      </article>

      <SavePostModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        postId={id}
        postTitle={title}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
};

export default ArticleCard;