import React from 'react';
import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share, Eye } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import SavePostModal from './SavePostModal';

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
  const [showSaveModal, setShowSaveModal] = useState(false);

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
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">{author.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">@{author.username || author.email}</p>
            </button>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
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
            <h2 className="text-xl moraba font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-relaxed">
              {title}
            </h2>
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
              <span className="text-sm">{stats.views}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <button 
              onClick={() => setShowSaveModal(true)}
              className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-500 hover:text-green-500 transition-colors">
              <Share className="w-4 h-4" />
            </button>
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
    </>
  );
};

export default ArticleCard;