const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'کاربر دریافت‌کننده الزامی است']
  },
  type: {
    type: String,
    enum: ['newFollower', 'newComment', 'newLike', 'newPost'],
    required: [true, 'نوع اطلاعیه الزامی است']
  },
  message: {
    type: String,
    required: [true, 'پیام اطلاعیه الزامی است']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

notificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;