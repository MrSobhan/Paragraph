const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'نام موضوع الزامی است'],
    unique: true,
    trim: true,
    minlength: [2, 'نام موضوع باید حداقل ۲ کاراکتر باشد']
  },
  description: {
    type: String,
    default: '',
    maxlength: [200, 'توضیحات نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد']
  },
  parentTopic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    default: null
  },
  isMainTopic: {
    type: Boolean,
    default: true
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

topicSchema.index({ name: 1 });
topicSchema.index({ parentTopic: 1 });

const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;