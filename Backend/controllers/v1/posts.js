const { Post, Like, Notification, User, Comment } = require("../../models");
const { sendEmail } = require("../../utils/email");

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const { title } = req.query;

    let query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (req.user?.role !== "admin") {
      query.isPublished = true;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author")
      .populate("topics")
      .lean();

    const postIds = posts.map((post) => post._id);

    // Get like counts
    const likeCounts = await Like.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);
    const likeCountMap = likeCounts.reduce((map, item) => {
      if (item._id) {
        map[item._id.toString()] = item.count;
      }
      return map;
    }, {});

    // Get approved comments
    let commentQuery = { post: { $in: postIds } };
    if (req.user?.role !== "admin") {
      commentQuery.status = "approved";
    }
    const commentDetails = await Comment.find(commentQuery);

    const commentMap = commentDetails.reduce((map, comment) => {
      if (comment.postId) {
        const postId = comment.postId.toString();
        if (!map[postId]) {
          map[postId] = [];
        }
        map[postId].push({
          content: comment.content,
          author: comment.userId,
          createdAt: comment.createdAt,
        });
      }
      return map;
    }, {});

    posts.forEach((post) => {
      const postIdStr = post._id.toString();
      post.likeCount = likeCountMap[postIdStr] || 0;
      post.comments = commentMap[postIdStr] || [];
    });

    const totalPosts = await Post.countDocuments(query);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت پست‌ها", error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    let query = { _id: id };
    if (req.user?.role !== "admin") {
      query.isPublished = true;
    }

    const post = await Post.findOne(query)
      .populate("author")
      .populate("topics")
      .lean();

    if (!post) {
      return res.status(404).json({ message: "پست یافت نشد" });
    }

    // Increment views for today
    const today = new Date().getDay();
    post.views[today] = (post.views[today] || 0) + 1;
    await Post.findByIdAndUpdate(id, {
      $set: { [`views.${today}`]: post.views[today] },
    });

    // Get like count
    const likeCount = await Like.countDocuments({ post: id });
    post.likeCount = likeCount;

    // Get comments
    const comments = await Comment.find({ postId: id })
      .select("content userId createdAt")
      .populate("userId", "name")
      .lean();
    post.comments = comments;

    res.status(200).json({ post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت پست", error: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      summary,
      topics,
      tags,
      coverImage,
      estimatedReadTime,
      podcastUrl,
    } = req.body;
    const post = await Post.create({
      title,
      content,
      summary,
      author: req.user._id,
      topics,
      tags,
      coverImage,
      estimatedReadTime,
      isPublished: false,
      podcastUrl,
      rating: 5,
      ratingCount: 0,
      views: Array(7).fill(0),
    });

    res.status(201).json({ message: "پست با موفقیت ایجاد شد", post });
  } catch (error) {
    res.status(500).json({ message: "خطا در ایجاد پست", error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "پست یافت نشد" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "فقط نویسنده می‌تواند پست را ویرایش کند" });
    }
    const {
      title,
      content,
      summary,
      topics,
      tags,
      coverImage,
      estimatedReadTime,
      podcastUrl,
    } = req.body;
    Object.assign(post, {
      title,
      content,
      summary,
      topics,
      tags,
      coverImage,
      estimatedReadTime,
      podcastUrl,
      updatedAt: Date.now(),
    });
    await post.save();
    res.status(200).json({ message: "پست با موفقیت به‌روزرسانی شد", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در به‌روزرسانی پست", error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "پست یافت نشد" });
    }
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "فقط نویسنده یا ادمین می‌تواند پست را حذف کند" });
    }
    await Post.deleteOne({ _id: id });
    res.status(200).json({ message: "پست با موفقیت حذف شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف پست", error: error.message });
  }
};

exports.publishPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "پست یافت نشد" });
    }
    if (post.isPublished) {
      return res.status(400).json({ message: "پست قبلاً منتشر شده است" });
    }

    post.isPublished = true;
    await post.save();

    // Send email to post author
    const author = await User.findById(post.author);
    if (author.email) {
      await sendEmail(
        author.email,
        "پست شما منتشر شد",
        `پست شما با عنوان "${post.title}" توسط ادمین منتشر شد.`
      );
    }

    // Create notification for post author
    await Notification.create({
      recipient: post.author,
      sender: req.user._id,
      type: "newPost",
      targetType: "post",
      targetId: post._id,
    });

    // Create notifications for followers
    const followers = author.followers || [];
    await Notification.insertMany(
      followers.map((followerId) => ({
        recipient: followerId,
        sender: post.author,
        type: "newPost",
        targetType: "post",
        targetId: post._id,
      }))
    );

    res.status(200).json({ message: "پست با موفقیت منتشر شد", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در انتشار پست", error: error.message });
  }
};
