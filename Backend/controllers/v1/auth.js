const { User, Post, Notification } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const registerValidator = require("../../validators/v1/register");
const loginValidator = require("../../validators/v1/login");

exports.register = async (req, res) => {
  try {
    const validationResult = registerValidator(req.body);
    if (validationResult !== true) {
      return res
        .status(400)
        .json({ message: "داده‌های ورودی نامعتبر", errors: validationResult });
    }

    const { username, phone, email, password, name, bio, avatar, socialLinks } =
      req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "ایمیل قبلاً ثبت شده است"
            : "شماره تلفن قبلاً ثبت شده است",
      });
    }

    const user = new User({
      username,
      email,
      password,
      phone,
      name,
      bio,
      avatar,
      socialLinks,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ message: "کاربر با موفقیت ثبت شد", token });
  } catch (error) {
    res.status(500).json({ message: "خطا در ثبت‌نام", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const validationResult = loginValidator(req.body);
    if (validationResult !== true) {
      return res
        .status(400)
        .json({ message: "داده‌های ورودی نامعتبر", errors: validationResult });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { username: email }, { phone: email }],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({
          message: "ایمیل، نام کاربری، شماره تلفن یا رمز عبور اشتباه است",
        });
    }

    if (user.isBanned) {
      return res
        .status(403)
        .json({
          message: "حساب شما مسدود شده است. لطفاً با پشتیبانی تماس بگیرید.",
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "ورود با موفقیت انجام شد", token });
  } catch (error) {
    res.status(500).json({ message: "خطا در ورود", error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userPosts = await Post.find({ author: req.user._id })
      .select("title summary createdAt")
      .lean();

    const userNotifications = await Notification.find({
      user: req.user._id,
      isRead: false,
    })
      .select("type message createdAt relatedPost relatedUser")
      .populate("relatedPost", "title")
      .populate("relatedUser", "name")
      .lean();

    const notifications = userNotifications.map((notification) => ({
      _id: notification._id,
      type: notification.type,
      message: notification.message,
      relatedPost: notification.relatedPost
        ? {
            _id: notification.relatedPost._id,
            title: notification.relatedPost.title,
          }
        : null,
      relatedUser: notification.relatedUser
        ? {
            _id: notification.relatedUser._id,
            name: notification.relatedUser.name,
          }
        : null,
      createdAt: notification.createdAt,
    }));

    const user = {
      ...req.user,
      posts: userPosts,
      notifications,
    };

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت اطلاعات کاربر", error: error.message });
  }
};
