const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'کاربر مالک لیست الزامی است']
  },
  name: {
    type: String,
    required: [true, 'نام لیست الزامی است'],
    trim: true,
    minlength: [2, 'نام لیست باید حداقل ۲ کاراکتر باشد'],
    maxlength: [50, 'نام لیست نمی‌تواند بیشتر از ۵۰ کاراکتر باشد']
  },
  description: {
    type: String,
    default: '',
    maxlength: [200, 'توضیحات نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد']
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  isPrivate: {
    type: Boolean,
    default: false
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

listSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

listSchema.index({ user: 1, name: 1 }, { unique: true });

const List = mongoose.model('List', listSchema);
module.exports = List;