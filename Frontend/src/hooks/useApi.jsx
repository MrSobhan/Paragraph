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

  const updateUserProfile = async (userData , userId) => {
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
    updateUserProfile
  };
};

export default useApi;