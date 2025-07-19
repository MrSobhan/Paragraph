const { User, Notification } = require("../../models");
const { Topic } = require("../../models");
const sendEmail = require("../../utils/email");

exports.getUsers = async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    const users = await User.find(query).lean();

    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت کاربران", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();

    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت کاربر", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = [
      "username",
      "phone",
      "name",
      "bio",
      "avatar",
      "socialLinks",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    updates.updatedAt = Date.now();

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    res.status(200).json({ message: "کاربر با موفقیت به‌روزرسانی شد", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در به‌روزرسانی کاربر", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    await User.deleteOne({ _id: id });
    res.status(200).json({ message: "کاربر با موفقیت حذف شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف کاربر", error: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user._id;

    if (userId === followerId.toString()) {
      return res
        .status(400)
        .json({ message: "نمی‌توانید خودتان را دنبال کنید" });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }
    if (userToFollow.isBanned) {
      return res.status(403).json({ message: "این کاربر مسدود شده است" });
    }

    if (!userToFollow.followers.includes(followerId)) {
      userToFollow.followers.push(followerId);
      await User.findByIdAndUpdate(followerId, {
        $push: { followingUsers: userId },
      });

      await userToFollow.save();

      await Notification.create({
        user: userId,
        type: "newFollower",
        message: "کاربر جدیدی شما را دنبال کرد",
        relatedUser: followerId,
      });

      if (userToFollow.email) {
        await sendEmail(
          userToFollow.email,
          "دنبال‌کننده جدید",
          "کاربر جدیدی شما را در ویرگول دنبال کرد!"
        );
      }
    } else {
      return res.status(400).json({ message: "شما قبلاً این کاربر را دنبال کرده‌اید." });
    }

    res.status(200).json({ message: "کاربر با موفقیت دنبال شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در دنبال کردن کاربر", error: error.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "نمی‌توان ادمین را مسدود کرد" });
    }

    user.isBanned = true;
    await user.save();

    res.status(200).json({ message: "کاربر با موفقیت مسدود شد" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در مسدود کردن کاربر", error: error.message });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    user.isBanned = false;
    await user.save();

    res.status(200).json({ message: "کاربر با موفقیت از حالت مسدود خارج شد" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در رفع مسدودیت کاربر", error: error.message });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    user.role = (user.role === "admin") ? "user" : "admin";
    await user.save();

    res.status(200).json({ message: `نقش کاربر به ${user.role} تغییر یافت` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در تغییر نقش کاربر", error: error.message });
  }
};

exports.followTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user._id;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "موضوع یافت نشد" });
    }

    const user = await User.findById(userId);
    if (user.followingTopics.includes(topicId)) {
      return res
        .status(400)
        .json({ message: "شما قبلاً این موضوع را دنبال کرده‌اید" });
    }

    user.followingTopics.push(topicId);
    await user.save();

    res.status(200).json({ message: "موضوع با موفقیت دنبال شد" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دنبال کردن موضوع", error: error.message });
  }
};

exports.unfollowTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user.followingTopics.includes(topicId)) {
      return res
        .status(400)
        .json({ message: "شما این موضوع را دنبال نکرده‌اید" });
    }

    user.followingTopics = user.followingTopics.filter(
      (id) => !id.equals(topicId)
    );
    await user.save();

    res.status(200).json({ message: "موضوع با موفقیت لغو دنبال شد" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در لغو دنبال کردن موضوع", error: error.message });
  }
};
