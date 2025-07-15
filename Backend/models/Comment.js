const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'متن نظر الزامی است'],
    trim: true,
    minlength: [2, 'نظر باید حداقل ۲ کاراکتر باشد'],
    maxlength: [500, 'نظر نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'نویسنده نظر الزامی است']
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'پست مرتبط الزامی است']
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

commentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ userId: 1 }); 

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;