import React, { useState, useEffect, useCallback } from 'react';
import { Hash, ArrowRight } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import ArticleCard from '../components/ArticleCard';
import Loader from '../components/Loader';

const TopicPostsPage = () => {
  const { params, navigate } = useRouter();
  const { fetchPostsByTopic, fetchTopics } = useApi();
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (params.topicId) {
      loadTopic();
      loadPosts();
    }
  }, [params.topicId]);

  const loadTopic = async () => {
    const result = await fetchTopics();
    if (result.success) {
      const foundTopic = result.data.find(t => t._id === params.topicId);
      setTopic(foundTopic);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    const result = await fetchPostsByTopic(params.topicId, 1, 10);
    if (result.success) {
      setPosts(result.data);
      setPage(2);
      if (result.data.length < 10) {
        setHasMore(false);
      }
    }
    setLoading(false);
  };

  const fetchMorePosts = useCallback(async () => {
    const result = await fetchPostsByTopic(params.topicId, page, 10);
    if (result.success) {
      if (result.data.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...result.data]);
        setPage(prev => prev + 1);
      }
    }
  }, [page, params.topicId]);

  const [isFetching] = useInfiniteScroll(fetchMorePosts);

  if (loading) {
    return (
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <Loader text="در حال بارگذاری..." />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <button
            onClick={() => navigate('/topics')}
            className="flex items-center space-x-2 space-x-reverse text-blue-500 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به موضوعات</span>
          </button>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Hash className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {topic?.name || 'موضوع'}
              </h1>
              {topic?.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {topic.description}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {posts.length} پست در این موضوع
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="p-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Hash className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                پستی در این موضوع یافت نشد
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                هنوز پستی در این موضوع منتشر نشده است
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <ArticleCard
                  key={post._id}
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
              ))}
            </div>
          )}

          {/* Infinite Scroll Loader */}
          {isFetching && hasMore && (
            <Loader text="در حال بارگذاری مطالب بیشتر..." />
          )}
          
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                تمام مطالب این موضوع نمایش داده شد
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicPostsPage;