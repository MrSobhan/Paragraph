import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, UserPlus, UserCheck } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';

const FollowersPage = () => {
  const { params, navigate } = useRouter();
  const { fetchUserProfile, followUser, unfollowUser } = useApi();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState({});

  useEffect(() => {
    if (params.userId) {
      loadUserAndFollowers();
    }
  }, [params.userId]);

  const loadUserAndFollowers = async () => {
    setLoading(true);
    const result = await fetchUserProfile(params.userId);
    if (result.success) {
      setUser(result.data.user);
      // In a real app, you'd have an API endpoint to get followers
      // For now, we'll simulate it
      setFollowers([]);
    }
    setLoading(false);
  };

  const handleFollow = async (userId) => {
    if (!currentUser) {
      await Swal.fire({
        title: 'خطا!',
        text: 'برای دنبال کردن کاربران ابتدا وارد شوید',
        icon: 'error',
        confirmButtonText: 'باشه'
      });
      return;
    }

    const isCurrentlyFollowing = followingStates[userId];
    const result = isCurrentlyFollowing 
      ? await unfollowUser(userId)
      : await followUser(userId);

    if (result.success) {
      setFollowingStates(prev => ({
        ...prev,
        [userId]: !isCurrentlyFollowing
      }));
    } else {
      await Swal.fire({
        title: 'خطا!',
        text: result.message,
        icon: 'error',
        confirmButtonText: 'باشه'
      });
    }
  };

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
            onClick={() => navigate(`/user/${params.userId}`)}
            className="flex items-center space-x-2 space-x-reverse text-blue-500 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به پروفایل</span>
          </button>

          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                دنبال‌کنندگان {user?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {followers.length} دنبال‌کننده
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Followers List */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="p-6">
          {followers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                هنوز دنبال‌کننده‌ای ندارد
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                این کاربر هنوز دنبال‌کننده‌ای ندارد
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followers.map((follower) => (
                <div
                  key={follower._id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-4 space-x-reverse mb-4">
                    <button onClick={() => navigate(`/user/${follower._id}`)}>
                      <img
                        src={follower.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                        alt={follower.name}
                        className="w-16 h-16 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                      />
                    </button>
                    <div className="flex-1">
                      <button
                        onClick={() => navigate(`/user/${follower._id}`)}
                        className="text-right hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {follower.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">@{follower.username}</p>
                      </button>
                      {follower.bio && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                          {follower.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {currentUser && currentUser._id !== follower._id && (
                    <button
                      onClick={() => handleFollow(follower._id)}
                      className={`w-full flex items-center justify-center space-x-2 space-x-reverse px-4 py-2 rounded-lg font-medium transition-colors ${
                        followingStates[follower._id]
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {followingStates[follower._id] ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                      <span>{followingStates[follower._id] ? 'دنبال می‌کنید' : 'دنبال کردن'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersPage;