import { useState, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (fetchMore, hasMore = true) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        if (!isFetching && hasMore) {
          setIsFetching(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching, hasMore]);

  useEffect(() => {
    if (!isFetching || !hasMore) return;
    
    const fetchData = async () => {
      await fetchMore();
      setIsFetching(false);
    };
    
    fetchData();
  }, [isFetching, fetchMore, hasMore]);

  return [isFetching, setIsFetching];
};