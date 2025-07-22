import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import FeaturedSection from '../components/FeaturedSection';
import StoriesSection from '../components/StoriesSection';
import Loader from '../components/Loader';
import InitialLoader from '../components/InitialLoader';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useRef } from 'react';

const HomePage = () => {
  const { fetchPosts } = useApi();
  const { isLogin } = useAuth();
  const [articles, setArticles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const hasLoadedRef = useRef(false);


  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadInitialPosts();
    }
  }, []);

  const loadInitialPosts = async () => {
    setLoading(true);

    setTimeout(() => {
      setInitialLoad(false);
    }, 2000);

    try {
      const result = await fetchPosts(1, 5);
      if (result.success) {
        setArticles(result.data);
        setPage(2);
        if (result.data.length < 5) {
          setHasMore(false);
        }
      } else {
        toast.error('خطا در بارگذاری پست‌ها. لطفاً اتصال اینترنت خود را بررسی کنید.', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error('لطفاً اتصال اینترنت خود را بررسی کنید', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setLoading(false);
  };

  const fetchMoreArticles = useCallback(async () => {
    if (!hasMore) return;
    
    const result = await fetchPosts(page, 5);
    
    if (result.success) {
      if (result.data.length === 0) {
        setHasMore(false);
      } else {
        setArticles(prev => [...prev, ...result.data]);
        setPage(prev => prev + 1);
      }
    }
  }, [page, hasMore, fetchPosts]);

  const [isFetching] = useInfiniteScroll(fetchMoreArticles, hasMore);

  // if (initialLoad && !isLogin) {
  //   return <InitialLoader />;
  // }

  if (loading) {
    return (
      <main className="flex-1 max-w-4xl mx-auto p-6">
        <Loader text="در حال بارگذاری..." />
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-4xl mx-auto p-6 overflow-x-hidden">
      <StoriesSection />
      <FeaturedSection />

      <div className="space-y-6">
        {articles.map((article) => (
          <ArticleCard
            key={article._id}
            id={article._id}
            title={article.title}
            content={article.summary}
            author={article.author}
            image={article.coverImage}
            stats={{
              likes: article.likesCount || 0,
              comments: article.commentsCount || 0,
              views: article.views || 0
            }}
            publishedAt={new Date(article.createdAt).toLocaleDateString('fa-IR')}
            tags={article.tags}
            readTime={article.estimatedReadTime}
          />
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      {isFetching && hasMore && (
        <Loader text="در حال بارگذاری مطالب بیشتر..." />
      )}

      {!hasMore && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            تمام مطالب نمایش داده شد
          </p>
        </div>
      )}
    </main>
  );
};

export default HomePage;