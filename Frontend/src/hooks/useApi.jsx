import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const { axiosInstance, isLogin } = useAuth();

  const fetchPosts = async (page = 1, limit = 5, search = '') => {
    try {
      let url = `/posts?page=${page}&limit=${limit}`;
      if (search) {
        url += `&title=${encodeURIComponent(search)}`;
      }
      const response = await axiosInstance.get(url);
      return {
        success: true,
        data: response.data.posts || response.data,
        pagination: response.data.pagination || null
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در دریافت پست‌ها'
      };
    }
  };

  const fetchPost = async (id) => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در دریافت پست'
      };
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در دریافت اعلان‌ها'
      };
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در علامت‌گذاری اعلان'
      };
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axiosInstance.get(`/comments?postId=${postId}`);
      return {
        success: true,
        data: response.data.filter(comment => comment.status === 'approved')
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در دریافت نظرات'
      };
    }
  };

  const createComment = async (commentData) => {
    try {
      const response = await axiosInstance.post('/comments', commentData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در ارسال نظر'
      };
    }
  };

  const toggleLike = async (postId) => {
    try {
      const response = await axiosInstance.post('/likes', { postId });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در لایک'
      };
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await axiosInstance.post('/posts', postData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در ایجاد پست'
      };
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await axiosInstance.get('/topics');
      return {
        success: true,
        data: response.data.topics
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در دریافت موضوعات'
      };
    }
  };

  const fetchPostsByTopic = async (topicId, page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(`/posts?topic=${topicId}&page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.posts || response.data,
        pagination: response.data.pagination || null
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در دریافت پست‌ها'
      };
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axiosInstance.get(`/auth/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در دریافت پروفایل'
      };
    }
  };

  const fetchUserLists = async () => {
    try {
      const response = await axiosInstance.get('/lists');
      return {
        success: true,
        data: response.data.lists
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در دریافت لیست‌ها'
      };
    }
  };

  const createList = async (listData) => {
    try {
      const response = await axiosInstance.post('/lists', listData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در ایجاد لیست'
      };
    }
  };

  const updateList = async (listId, listData) => {
    try {
      const response = await axiosInstance.put(`/lists/${listId}`, listData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در به‌روزرسانی لیست'
      };
    }
  };

  const deleteList = async (listId) => {
    try {
      await axiosInstance.delete(`/lists/${listId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در حذف لیست'
      };
    }
  };

  const addPostToList = async (listId, postId) => {
    try {
      const response = await axiosInstance.post(`/lists/${listId}/posts`, { postId });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در اضافه کردن پست به لیست'
      };
    }
  };

  const removePostFromList = async (listId, postId) => {
    try {
      await axiosInstance.delete(`/lists/${listId}/posts/${postId}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در حذف پست از لیست'
      };
    }
  };

  const uploadFile = async (file, fieldname, postId = null) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("fieldname", fieldname);
      if (postId) formData.append("postId", postId);

      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // const tokene = localStorage.getItem('token');
      
      // let response
      // await fetch('http://localhost:3000/v1/upload', {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //     "Authorization": `Bearer ${tokene}`

      //   },
      //   body: formData
      // }).then(res => res.json()).then(data => {
      //   // response = data
      //   console.log(data)
      // }).catch(err => console.log(err)   )

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "خطا در آپلود فایل",
      };
    }
  };


  const updateUserProfile = async (userData, userId) => {
    try {
      const response = await axiosInstance.put(`/auth/${userId}`, userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در بروزرسانی پروفایل'
      };
    }
  };

  const fetchAllUserProfile = async () => {
    if (isLogin) {
      try {
        const response = await axiosInstance.get('/auth')

        return {
          success: true,
          data: response.data
        };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'خطا در دریافت پروفایل'
        };
      }
    }
    return false
  };

  const banUser = async (userId) => {
    try {
      const response = await axiosInstance.put(`/auth/${userId}/ban`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در مسدود کردن کاربر'
      };
    }
  };

  const unbanUser = async (userId) => {
    try {
      const response = await axiosInstance.put(`/auth/${userId}/unban`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در رفع مسدودیت کاربر'
      };
    }
  };

  const changeRole = async (userId) => {
    try {
      const response = await axiosInstance.put(`/auth/${userId}/change-role`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در تغییر نقش کاربر'
      };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/auth/${userId}`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در حذف کاربر'
      };
    }
  };
  const publishPost = async (postId) => {
    try {
      await axiosInstance.put(`/posts/${postId}/publish`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در انتشار پست:'
      };
    }
  };
  const deletePost = async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در حذف پست:'
      };
    }
  };

  const followUser = async (userId) => {
    try {
      const response = await axiosInstance.post(`/auth/${userId}/follow`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در دنبال کردن کاربر'
      };
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const response = await axiosInstance.post(`/auth/${userId}/unfollow`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در لغو دنبال کردن کاربر'
      };
    }
  };

  const followTopic = async (topicId) => {
    try {
      const response = await axiosInstance.post(`/auth/${topicId}/follow-topic`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در دنبال کردن موضوع'
      };
    }
  };

  const unfollowTopic = async (topicId) => {
    try {
      const response = await axiosInstance.post(`/auth/${topicId}/unfollow-topic`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در لغو دنبال کردن موضوع'
      };
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axiosInstance.get('/dashboard/stats');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در دریافت آمار داشبورد'
      };
    }
  };

  return {
    fetchPosts,
    fetchPost,
    fetchNotifications,
    markNotificationAsRead,
    fetchComments,
    createComment,
    toggleLike,
    createPost,
    fetchTopics,
    fetchPostsByTopic,
    fetchUserProfile,
    fetchUserLists,
    createList,
    updateList,
    deleteList,
    addPostToList,
    removePostFromList,
    uploadFile,
    updateUserProfile,
    fetchAllUserProfile,
    banUser,
    unbanUser,
    changeRole,
    deleteUser,
    publishPost,
    deletePost,
    followUser,
    unfollowUser,
    followTopic,
    unfollowTopic,
    fetchDashboardStats
  };
};

export default useApi;