import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { RouterProvider, useRouter } from './hooks/useRouter';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import NotificationsPage from './pages/NotificationsPage';
import CreatePostPage from './pages/CreatePostPage';
import TopicsPage from './pages/TopicsPage';
import TopicPostsPage from './pages/TopicPostsPage';
import UserPage from './pages/UserPage';
import AboutPage from './pages/AboutPage';
import RulesPage from './pages/RulesPage';
import ContactPage from './pages/ContactPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

const AppContent = () => {
  const { currentPath } = useRouter();

  const renderPage = () => {
    if (currentPath === '/') return <HomePage />;
    if (currentPath.startsWith('/post/')) return <PostPage />;
    if (currentPath === '/notifications') return <NotificationsPage />;
    if (currentPath === '/create-post') return <CreatePostPage />;
    if (currentPath === '/topics') return <TopicsPage />;
    if (currentPath.startsWith('/topics/')) return <TopicPostsPage />;
    if (currentPath.startsWith('/user/')) return <UserPage />;
    if (currentPath === '/about') return <AboutPage />;
    if (currentPath === '/rules') return <RulesPage />;
    if (currentPath === '/contact') return <ContactPage />;
    if (currentPath === '/settings') return <SettingsPage />;
    return <NotFoundPage />;
  };

  const showSidebar = currentPath === '/' || currentPath.startsWith('/post/');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors" dir="rtl">
      <Header />
      <div className="flex">
        {renderPage()}
        {showSidebar && <Sidebar />}
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;