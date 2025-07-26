const { User, Post } = require("../../models");
const path = require("path");
const multer = require("multer");

// تنظیمات ذخیره‌سازی فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "coverImage") {
      cb(null, "public/posts/covers/");
    } else if (file.fieldname === "avatar") {
      cb(null, "public/users/avatars/");
    } else if (file.fieldname === "podcast") {
      cb(null, "public/posts/podcasts/");
    } else {
      cb(new Error("فیلد نامعتبر است"), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// فیلتر فایل
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    coverImage: ["image/jpeg", "image/png", "image/jpg"],
    avatar: ["image/jpeg", "image/png", "image/jpg"],
    podcast: ["audio/mpeg", "audio/mp3"],
  };

  if (allowedTypes[file.fieldname]?.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `فرمت فایل ${file.mimetype} برای ${file.fieldname} نامعتبر است`
      ),
      false
    );
  }
};

// تنظیم Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // حداکثر 5 مگابایت
}).fields([
  { name: "coverImage", maxCount: 1 },
  { name: "avatar", maxCount: 1 },
  { name: "podcast", maxCount: 1 },
]);

const uploadFile = async (req, res) => {
  try {
    console.log("req.body.files:", req.body.files);
    console.log("req.body:", req.body);

    if (!req.body.files || Object.keys(req.body.files).length === 0) {
      return res.status(400).json({ message: "هیچ فایلی آپلود نشد" });
    }

    const fieldname = Object.keys(req.body.files)[0];
    const file = req.body.files[fieldname][0];
    let fileUrl;

    if (fieldname === "coverImage") {
      fileUrl = `/public/posts/covers/${file.filename}`;
      const postId = req.body.postId;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "پست یافت نشد" });
      }
      if (post.author.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "فقط نویسنده می‌تواند کاور آپلود کند" });
      }
      post.coverImage = fileUrl;
      await post.save();
    } else if (fieldname === "avatar") {
      fileUrl = `/public/users/avatars/${file.filename}`;
      const user = await User.findById(req.user._id);
      user.avatar = fileUrl;
      await user.save();
    } else if (fieldname === "podcast") {
      fileUrl = `/public/posts/podcasts/${file.filename}`;
      const postId = req.body.postId;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "پست یافت نشد" });
      }
      if (post.author.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "فقط نویسنده می‌تواند پادکست آپلود کند" });
      }
      post.podcastUrl = fileUrl;
      await post.save();
    } else {
      return res.status(400).json({ message: `فیلد ${fieldname} غیرمجاز است` });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "فایل با موفقیت آپلود شد",
        data: { fileUrl },
      });
  } catch (error) {
    console.error("خطا در آپلود:", error);
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: `خطای Multer: ${error.message}` });
    }
    res
      .status(500)
      .json({ message: "خطا در آپلود فایل", error: error.message });
  }
};

module.exports = { uploadFile };

/*
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
*/
