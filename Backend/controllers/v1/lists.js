const List = require('../../models/List');

exports.createList = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    const list = new List({
      user: req.user._id,
      name,
      description,
      isPrivate,
    });
    await list.save();
    res.status(201).json({ message: 'لیست با موفقیت ایجاد شد', list });
  } catch (error) {
    res.status(500).json({ message: 'خطا در ایجاد لیست', error: error.message });
  }
};

exports.updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ message: 'لیست یافت نشد' });
    }
    if (list.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'فقط مالک لیست می‌تواند آن را ویرایش کند' });
    }

    const allowedFields = ['name', 'description', 'isPrivate'];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    updates.updatedAt = Date.now();

    Object.assign(list, updates);
    await list.save();

    res.status(200).json({ message: 'لیست با موفقیت به‌روزرسانی شد', list });
  } catch (error) {
    res.status(500).json({ message: 'خطا در به‌روزرسانی لیست', error: error.message });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ message: 'لیست یافت نشد' });
    }
    if (list.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'فقط مالک لیست می‌تواند آن را حذف کند' });
    }
    await list.remove();
    res.status(200).json({ message: 'لیست با موفقیت حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف لیست', error: error.message });
  }
};

exports.addPostToList = async (req, res) => {
  try {
    const { id, postId } = req.params;
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ message: 'لیست یافت نشد' });
    }
    if (list.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'فقط مالک لیست می‌تواند پست اضافه کند' });
    }
    if (!list.posts.includes(postId)) {
      list.posts.push(postId);
      await list.save();
    }
    res.status(200).json({ message: 'پست به لیست اضافه شد', list });
  } catch (error) {
    res.status(500).json({ message: 'خطا در اضافه کردن پست به لیست', error: error.message });
  }
};

exports.removePostFromList = async (req, res) => {
  try {
    const { id, postId } = req.params;
    const list = await List.findById(id);
    if (!list) {
      return res.status(404).json({ message: 'لیست یافت نشد' });
    }
    if (list.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'فقط مالک لیست می‌تواند پست را حذف کند' });
    }
    list.posts = list.posts.filter((post) => post.toString() !== postId);
    await list.save();
    res.status(200).json({ message: 'پست از لیست حذف شد', list });
  } catch (error) {
    res.status(500).json({ message: 'خطا در حذف پست از لیست', error: error.message });
  }
};