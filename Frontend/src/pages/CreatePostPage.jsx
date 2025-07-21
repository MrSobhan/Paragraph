import React, { useState, useEffect } from 'react';
import { Save, Eye, X, Plus, Tag, Hash } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useApi } from '../hooks/useApi';
import FileUpload from '../components/FileUpload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';

const CreatePostPage = () => {
  const { navigate } = useRouter();
  const { createPost, fetchTopics } = useApi();
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    coverImage: '',
    topics: [],
    tags: [],
    estimatedReadTime: 1,
    podcastUrl: ''
  });
  const [newTag, setNewTag] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    const result = await fetchTopics();
    if (result.success) {
      setTopics(result.data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTopicToggle = (topicId) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topicId)
        ? prev.topics.filter(id => id !== topicId)
        : [...prev.topics, topicId]
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.summary.trim()) {
      await Swal.fire({
        title: 'خطا!',
        text: 'لطفاً تمام فیلدهای الزامی را پر کنید',
        icon: 'error',
        confirmButtonText: 'باشه'
      });
      return;
    }

    if (formData.topics.length === 0) {
      await Swal.fire({
        title: 'خطا!',
        text: 'لطفاً حداقل یک موضوع انتخاب کنید',
        icon: 'error',
        confirmButtonText: 'باشه'
      });
      return;
    }

    setLoading(true);
    const result = await createPost(formData);

    if (result.success) {
      await Swal.fire({
        title: 'موفقیت!',
        text: 'پست با موفقیت ایجاد شد',
        icon: 'success',
        confirmButtonText: 'باشه'
      });
      navigate(`/post/${result.data._id}`);
    } else {
      await Swal.fire({
        title: 'خطا!',
        text: result.message,
        icon: 'error',
        confirmButtonText: 'باشه'
      });
    }
    setLoading(false);
  };

  const estimateReadTime = (content) => {
    const wordsPerMinute = 100; // Persian reading speed
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  useEffect(() => {
    const readTime = estimateReadTime(formData.content);
    setFormData(prev => ({
      ...prev,
      estimatedReadTime: readTime
    }));
  }, [formData.content]);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'align', 'link', 'image'
  ];

  return (
    <div className="flex-1 max-w-8xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white hidden md:block">نوشتن پست جدید</h1>
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{preview ? 'ویرایش' : 'پیش‌نمایش'}</span>
              </button>
              <button
                type="submit"
                form="post-form"
                disabled={loading}
                className="flex items-center space-x-2 space-x-reverse bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'در حال انتشار...' : 'انتشار پست'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap">
        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {!preview ? (
            <form id="post-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عنوان پست *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 text-xl border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="عنوان جذاب برای پست خود بنویسید..."
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  خلاصه پست *
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  maxLength="200"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="خلاصه‌ای از محتوای پست خود بنویسید... (حداکثر ۲۰۰ کاراکتر)"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formData.summary.length}/200 کاراکتر
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تصویر کاور
                </label>
                <FileUpload
                  fieldname="coverImage"
                  postId={formData.postId || null}
                  onUploadSuccess={(fileUrl) => {
                    setFormData(prev => ({ ...prev, coverImage: fileUrl }));
                  }}
                  onUploadError={(error) => {
                    Swal.fire({
                      title: 'خطا!',
                      text: error,
                      icon: 'error',
                      confirmButtonText: 'باشه'
                    });
                  }}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  محتوای پست *
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="محتوای پست خود را اینجا بنویسید... (از Markdown پشتیبانی می‌شود)"
                  className="h-64 lg:h-96 mb-12 lg:mb-16"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  زمان تخمینی مطالعه: {formData.estimatedReadTime} دقیقه
                </div>
              </div>

              {/* Podcast URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  فایل پادکست (اختیاری)
                </label>
                <FileUpload
                  fieldname="podcast"
                  postId={formData.postId || null}
                  onUploadSuccess={(fileUrl) => {
                    setFormData(prev => ({ ...prev, podcastUrl: fileUrl }));
                  }}
                  onUploadError={(error) => {
                    Swal.fire({
                      title: 'خطا!',
                      text: error,
                      icon: 'error',
                      confirmButtonText: 'باشه'
                    });
                  }}
                  accept="audio/*"
                  maxSize={50 * 1024 * 1024} // 50MB for audio
                  showPreview={false}
                />
              </div>
            </form>
          ) : (
            /* Preview */
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {formData.title || 'عنوان پست'}
              </h1>

              {formData.coverImage && (
                <img
                  src={formData.coverImage}
                  alt="Cover"
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                {formData.summary || 'خلاصه پست'}
              </p>

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: formData.content || 'محتوای پست اینجا نمایش داده می‌شود...' 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-gray-50 dark:bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 p-4 lg:p-6">
          {/* Topics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Hash className="w-5 h-5 ml-2" />
              موضوعات *
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {
                topics.length && (
                  topics.map((topic) => (
                    <label
                      key={topic._id}
                      className="flex items-center space-x-3 space-x-reverse p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer text-sm lg:text-base"
                    >
                      <input
                        type="checkbox"
                        checked={formData.topics.includes(topic._id)}
                        onChange={() => handleTopicToggle(topic._id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-gray-900 dark:text-white">{topic.name}</span>
                    </label>
                  ))
                )
              }
            </div>
            {formData.topics.length === 0 && (
              <p className="text-red-500 text-sm mt-2">حداقل یک موضوع انتخاب کنید</p>
            )}
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Tag className="w-5 h-5 ml-2" />
              برچسب‌ها
            </h3>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="w-full sm:flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="برچسب جدید..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="w-full sm:w-auto px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 space-x-reverse bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Post Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-sm lg:text-base">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">آمار پست</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">کلمات:</span>
                <span className="text-gray-900 dark:text-white">
                  {formData.content.trim().split(/\s+/).filter(word => word.length > 0).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">کاراکترها:</span>
                <span className="text-gray-900 dark:text-white">{formData.content.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">زمان مطالعه:</span>
                <span className="text-gray-900 dark:text-white">{formData.estimatedReadTime} دقیقه</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">موضوعات:</span>
                <span className="text-gray-900 dark:text-white">{formData.topics.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">برچسب‌ها:</span>
                <span className="text-gray-900 dark:text-white">{formData.tags.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;