import React, { useState, useRef } from 'react';
import { Upload, X, Image, Music, User } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const FileUpload = ({ 
  fieldname, 
  postId = null, 
  onUploadSuccess, 
  onUploadError,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
  children,
  showPreview = true
}) => {
  const { uploadFile } = useApi();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const getFileIcon = () => {
    switch (fieldname) {
      case 'avatar':
        return <User className="w-6 h-6" />;
      case 'podcast':
        return <Music className="w-6 h-6" />;
      default:
        return <Image className="w-6 h-6" />;
    }
  };

  const getAcceptedTypes = () => {
    switch (fieldname) {
      case 'podcast':
        return "audio/*";
      case 'avatar':
      case 'coverImage':
      default:
        return "image/*";
    }
  };

  const validateFile = (file) => {
    if (file.size > maxSize) {
      return `حجم فایل نباید بیشتر از ${Math.round(maxSize / (1024 * 1024))} مگابایت باشد`;
    }

    const acceptedTypes = getAcceptedTypes();
    if (acceptedTypes === "image/*" && !file.type.startsWith('image/')) {
      return 'فقط فایل‌های تصویری مجاز هستند';
    }
    if (acceptedTypes === "audio/*" && !file.type.startsWith('audio/')) {
      return 'فقط فایل‌های صوتی مجاز هستند';
    }

    return null;
  };

  const handleFileSelect = async (file) => {
    const error = validateFile(file);
    if (error) {
      onUploadError?.(error);
      return;
    }

    // Show preview for images
    if (showPreview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }

    setUploading(true);
    
    try {
      const result = await uploadFile(file, fieldname, postId);
      if (result.success) {
        onUploadSuccess?.(result.data.fileUrl || result.data.url, file);
      } else {
        onUploadError?.(result.message);
        setPreview(null);
      }
    } catch (error) {
      onUploadError?.('خطا در آپلود فایل');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (children) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedTypes()}
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div onClick={() => fileInputRef.current?.click()}>
          {children}
        </div>
      </>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptedTypes()}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${uploading 
            ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800'
          }
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 mb-3"></div>
            <p className="text-blue-600 dark:text-blue-400">در حال آپلود...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-gray-400 mb-3">
              {getFileIcon()}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              برای آپلود کلیک کنید یا فایل را اینجا بکشید
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              حداکثر حجم: {Math.round(maxSize / (1024 * 1024))} مگابایت
            </p>
          </div>
        )}
      </div>

      {/* Preview */}
      {preview && showPreview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;