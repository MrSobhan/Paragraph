import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { RouterProvider, useRouter } from './hooks/useRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import SavedPostsPage from './pages/SavedPostsPage';
import SavedListPage from './pages/SavedListPage';
import SearchPage from './pages/SearchPage';
import FollowersPage from './pages/FollowersPage';
import FollowingPage from './pages/FollowingPage';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import UsersManagement from './pages/dashboard/UsersManagement';
import PostsManagement from './pages/dashboard/PostsManagement';
import CommentsManagement from './pages/dashboard/CommentsManagement';
import TopicsManagement from './pages/dashboard/TopicsManagement';
import BtnTop from './components/BtnTop';

const AppContent = () => {
  const { currentPath } = useRouter();
  const { theme } = useTheme();

  const renderPage = () => {
    if (currentPath === '/') return <HomePage />;
    if (currentPath.startsWith('/post/')) return <PostPage />;
    if (currentPath === '/notifications') return <NotificationsPage />;
    if (currentPath === '/create-post') return <CreatePostPage />;
    if (currentPath === '/topics') return <TopicsPage />;
    if (currentPath.startsWith('/topics/')) return <TopicPostsPage />;
    if (currentPath.startsWith('/user/')) return <UserPage />;
    if (currentPath.includes('/followers')) return <FollowersPage />;
    if (currentPath.includes('/following')) return <FollowingPage />;
    if (currentPath.startsWith('/search')) return <SearchPage />;
    if (currentPath === '/about') return <AboutPage />;
    if (currentPath === '/rules') return <RulesPage />;
    if (currentPath === '/contact') return <ContactPage />;
    if (currentPath === '/settings') return <SettingsPage />;
    if (currentPath === '/saved-posts') return <SavedPostsPage />;
    if (currentPath.startsWith('/saved-lists/')) return <SavedListPage />;
    if (currentPath === '/dashboard') return <DashboardOverview />;
    if (currentPath === '/dashboard/users') return <UsersManagement />;
    if (currentPath === '/dashboard/posts') return <PostsManagement />;
    if (currentPath === '/dashboard/comments') return <CommentsManagement />;
    if (currentPath === '/dashboard/topics') return <TopicsManagement />;
    return <NotFoundPage />;
  };

  const showSidebar = currentPath === '/' && !currentPath.startsWith('/dashboard');
  const isDashboard = currentPath.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors" dir="rtl">
      {!isDashboard && <Header />}
      <div className="flex">
        {renderPage()}
        {showSidebar && (
          <Sidebar />
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      {isDashboard ? <BtnTop side='left' /> : <BtnTop />}
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