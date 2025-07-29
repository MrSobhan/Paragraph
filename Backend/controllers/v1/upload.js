const { User, Post } = require('../../models');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'هیچ فایلی آپلود نشد' });
    }

    const fieldname = Object.keys(req.files)[0];
    const file = req.files[fieldname][0];
    let fileUrl;

    const baseUrlFile = "https://virgool.onrender.com"

    if (fieldname === 'coverImage') {
      fileUrl = `${baseUrlFile}/posts/covers/${file.filename}`;
      const postId = req.body.postId;
      if (!postId) {
        return res.status(400).json({ message: 'postId الزامی است' });
      }
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
      fileUrl = `${baseUrlFile}/users/avatars/${file.filename}`;
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'کاربر یافت نشد' });
      }
      user.avatar = fileUrl;
      await user.save();
    } else if (fieldname === 'podcast') {
      fileUrl = `${baseUrlFile}/posts/podcasts/${file.filename}`;
      const postId = req.body.postId;
      if (!postId) {
        return res.status(400).json({ message: 'postId الزامی است' });
      }
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'پست یافت نشد' });
      }
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'فقط نویسنده می‌تواند پادکست آپلود کند' });
      }
      post.podcastUrl = fileUrl;
      await post.save();
    } else {
      return res.status(400).json({ message: `فیلد ${fieldname} غیرمجاز است` });
    }

    res.status(200).json({
      success: true,
      message: 'فایل با موفقیت آپلود شد',
      data: { fileUrl },
    });
  } catch (error) {
    console.error('خطا در آپلود:', error);
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: `خطای Multer: ${error.message}` });
    }
    res.status(500).json({ message: 'خطا در آپلود فایل', error: error.message });
  }
};