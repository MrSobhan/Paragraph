import React from 'react';
import { useState, useCallback } from 'react';
import ArticleCard from '../components/ArticleCard';
import FeaturedSection from '../components/FeaturedSection';
import Loader from '../components/Loader';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { mockArticles } from '../data/mockData';

const HomePage = () => {
  const [articles, setArticles] = useState(mockArticles);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMoreArticles = useCallback(async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate fetching more articles (in real app, this would be an API call)
    const newArticles = mockArticles.map((article, index) => ({
      ...article,
      id: `${article.id}-page-${page}-${index}`,
      title: `${article.title} - صفحه ${page + 1}`,
    }));
    
    setArticles(prev => [...prev, ...newArticles]);
    setPage(prev => prev + 1);
    
    // Stop loading after 5 pages for demo
    if (page >= 5) {
      setHasMore(false);
    }
  }, [page]);

  const [isFetching] = useInfiniteScroll(fetchMoreArticles);

  return (
    <main className="flex-1 max-w-4xl mx-auto p-6">
      <FeaturedSection />
      
      <div className="space-y-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            content={article.excerpt}
            author={article.author}
            image={article.image}
            stats={article.stats}
            publishedAt={article.publishedAt}
            tags={article.tags}
            featured={article.featured}
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