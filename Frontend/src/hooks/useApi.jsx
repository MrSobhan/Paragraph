import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const { axiosInstance } = useAuth();

  const fetchPosts = async (page = 1, limit = 5) => {
    try {
      const response = await axiosInstance.get(`/posts?page=${page}&limit=${limit}`);
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
        data: response.data.filter(notification => !notification.isRead)
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
      await axiosInstance.patch(`/notifications/${id}/read`);
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
      formData.append(fieldname, file);
      if (postId) {
        formData.append('postId', postId);
      }

      const response = await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'خطا در آپلود فایل'
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
    try {
      const response = await axiosInstance.get('/auth');
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
    deletePost
  };
};

export default useApi;