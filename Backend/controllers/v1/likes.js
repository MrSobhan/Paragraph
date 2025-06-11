const { Like, Post, Notification } = require('../../models');

exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'پست یافت نشد' });
    }
    
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return res.status(200).json({ message: 'لایک حذف شد' });
    }

    // Create notification for post author
    if (post.author.toString() !== userId.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: 'newLike',
        targetType: 'post',
        targetId: postId,
      });
    }

    const like = await Like.create({ user: userId, post: postId });
    res.status(201).json({ message: 'لایک اضافه شدد', like });
  } catch (error) {
    res.status(500).json({ message: 'خطا در مدیریت لایک', error: error.message });
  }
};