import { useState, useEffect, createContext, useContext } from 'react';

const RouterContext = createContext();

export const RouterProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [params, setParams] = useState({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      extractParams(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    extractParams(currentPath);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPath]);

  const extractParams = (path) => {
    const segments = path.split('/').filter(Boolean);
    const newParams = {};
    
    if (segments[0] === 'post' && segments[1]) {
      newParams.postId = segments[1];
    }
    if (segments[0] === 'topics' && segments[1]) {
      newParams.topicId = segments[1];
    }
    if (segments[0] === 'user' && segments[1]) {
      newParams.userId = segments[1];
    }
    if (segments[0] === 'saved-lists' && segments[1]) {
      newParams.listId = segments[1];
    }
    
    setParams(newParams);
  };

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    extractParams(path);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within RouterProvider');
  }
  return context;
};