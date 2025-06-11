const { User, Post } = require('../../models');
const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'هیچ فایلی آپلود نشد' });
    }

    const { fieldname } = req.file;
    const fileUrl = `/posts/covers/${req.file.filename}`;

    
    if (fieldname === 'coverImage') {
      const postId = req.body.postId;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'پست یافت نشد' });
      }
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'فقط نویسنده می‌تواند کاور آپلود کند' });
      }
      post.coverImage = fileUrl;
      await post.save();
    } else if (fieldname === 'avatar') {
      const user = await User.findById(req.user._id);
      user.avatar = `/users/avatars/${req.file.filename}`;
      await user.save();
    } else if (fieldname === 'podcast') {
      const postId = req.body.postId;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'پست یافت نشد' });
      }
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'فقط نویسنده می‌تواند پادکست آپلود کند' });
      }
      post.podcastUrl = `/posts/podcasts/${req.file.filename}`;
      await post.save();
    }

    res.status(200).json({ message: 'فایل با موفقیت آپلود شد', fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'خطا در آپلود فایل', error: error.message });
  }
};