const { Comment, Post, Notification } = require("../../models");

exports.getAllComments = async (req, res) => {
  try {
    const { postId, status } = req.query;
    const query = {};

    if (postId) {
      if (!mongoose.isValidObjectId(postId)) {
        return res.status(400).json({
          success: false,
          message: "شناسه پست نامعتبر است",
        });
      }
      query.postId = postId;
    }

    if (status && req.user?.role === "admin") {
      query.status = status;
    }

    const comments = await Comment.find(query)
      .populate("userId", "name avatar")
      .populate("postId", "title")
      .populate({
        path: "parentComment",
        populate: { path: "userId", select: "name" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Error in getAllComments:", error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت نظرات",
      error: error.message,
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { content, postId, parentComment, rating } = req.body;
    const comment = new Comment({
      content,
      userId: req.user._id,
      postId,
      parentComment,
      status: "pending",
    });
    await comment.save();

    // Update post comments array
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    // Update post rating
    const postDoc = await Post.findById(postId);
    if (!postDoc) {
      return res.status(404).json({ message: "پست یافت نشد" });
    }
    const newRatingCount = postDoc.ratingCount + 1;
    const newRating =
      (postDoc.rating * postDoc.ratingCount + (rating || 5)) / newRatingCount;
    postDoc.rating = Number(newRating.toFixed(2));
    postDoc.ratingCount = newRatingCount;
    await postDoc.save();

    res
      .status(201)
      .json({
        message: "نظر با موفقیت ایجاد شد و در انتظار تأیید است",
        comment,
      });
  } catch (error) {
    res.status(500).json({ message: "خطا در ایجاد نظر", error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "نظر یافت نشد" });
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "فقط نویسنده می‌تواند نظر را ویرایش کند" });
    }
    const { content, postId, parentComment } = req.body;
    Object.assign(comment, {
      content,
      postId,
      parentComment,
    });
    await comment.save();
    res
      .status(200)
      .json({
        message: "نظر با موفقیت به‌روزرسانی شد و در انتظار تأیید است",
        comment,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در به‌روزرسانی نظر", error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "شناسه نظر نامعتبر است" });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "نظر یافت نشد" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "کاربر احراز هویت نشده است" });
    }

    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "فقط نویسنده یا ادمین می‌تواند نظر را حذف کند" });
    }

    await Comment.deleteOne({ _id: id });

    await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: id } });

    res.status(200).json({ message: "نظر با موفقیت حذف شد" });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    res.status(500).json({ message: "خطا در حذف نظر", error: error.message });
  }
};

exports.approveComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "نظر یافت نشد" });
    }
    if (comment.status === "approved") {
      return res.status(400).json({ message: "نظر قبلاً تأیید شده است" });
    }
    comment.status = "approved";
    await comment.save();

    // Create notifications only after approval
    const postDoc = await Post.findById(comment.postId);
    if (postDoc && postDoc.author.toString() !== comment.author.toString()) {
      await Notification.create({
        user: postDoc.author._id,
        type: "newComment",
        message: "کامنت شما توسط مدیر سایت تایید شد",
        relatedPost: comment.postId,
        relatedUser: comment.author._id,
      });
    }

    if (comment.parentComment) {
      const parent = await Comment.findById(comment.parentComment);
      if (parent && parent.author.toString() !== comment.author.toString()) {
        await Notification.create({
          user: parent.author._id,
          type: "newComment",
          message: "کامنت شما توسط مدیر سایت تایید شد",
          relatedPost: comment.postId,
          relatedUser: comment.author._id,
        });
      }
    }

    res.status(200).json({ message: "نظر با موفقیت تأیید شد", comment });
  } catch (error) {
    res.status(500).json({ message: "خطا در تأیید نظر", error: error.message });
  }
};
