const Notification = require('../../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('relatedPost', 'title')
      .populate('relatedUser', 'name');
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت اطلاعیه‌ها', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'اطلاعیه یافت نشد' });
    }
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'فقط مالک اطلاعیه می‌تواند آن را بخواند' });
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json({ message: 'اطلاعیه به عنوان خوانده‌شده علامت‌گذاری شد', notification });
  } catch (error) {
    res.status(500).json({ message: 'خطا در علامت‌گذاری اطلاعیه', error: error.message });
  }
};


// Notif کی ایجاد میشه ایمیل بره براش