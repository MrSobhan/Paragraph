import React from 'react';
import ArticleCard from '../components/ArticleCard';
import FeaturedSection from '../components/FeaturedSection';
import { mockArticles } from '../data/mockData';

const HomePage = () => {
  return (
    <main className="flex-1 max-w-4xl mx-auto p-6">
      <FeaturedSection />
      
      <div className="space-y-6">
        {mockArticles.map((article) => (
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

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
          مطالب بیشتر
        </button>
      </div>
    </main>
  );
};

export default HomePage;