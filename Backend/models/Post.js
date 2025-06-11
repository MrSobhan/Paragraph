const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "عنوان الزامی است"],
    trim: true,
    minlength: [3, "عنوان باید حداقل ۳ کاراکتر باشد"],
  },
  content: {
    type: String,
    required: [true, "محتوا الزامی است"],
    minlength: [10, "محتوا باید حداقل ۱۰ کاراکتر باشد"],
  },
  summary: {
    type: String,
    required: [true, "خلاصه الزامی است"],
    trim: true,
    minlength: [10, "خلاصه باید حداقل ۱۰ کاراکتر باشد"],
    maxlength: [200, "خلاصه نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "نویسنده الزامی است"],
  },
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  coverImage: {
    type: String,
    default: "",
  },
  estimatedReadTime: {
    type: Number,
    min: [1, "زمان مطالعه باید حداقل ۱ دقیقه باشد"],
    default: 1,
  },
  rating: {
    type: Number,
    min: [0, "امتیاز نمی‌تواند منفی باشد"],
    max: [5, "امتیاز نمی‌تواند بیشتر از ۵ باشد"],
    default: 0,
  },
  ratingCount: {
    type: Number,
    min: [0, "تعداد امتیازها نمی‌تواند منفی باشد"],
    default: 0,
  },
  views: [
    {
      type: Number,
      min: [0, "تعداد بازدیدها نمی‌تواند منفی باشد"],
      default: 0,
    },
  ],
  isPublished: {
    type: Boolean,
    default: true,
  },
  podcastUrl: {
    type: String,
    default: "",
  },
  // comments: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Comment",
  //   },
  // ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure views array always has length 7
postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  if (this.views.length !== 7) {
    this.views = Array(7).fill(0);
  }
  next();
});

// Indexes for query optimization
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ topics: 1 });
postSchema.index({ tags: 1 });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
