const { User, Post, Comment, Topic, Notification } = require('../../models');

exports.getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalPosts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ isPublished: true });
    const unpublishedPosts = await Post.countDocuments({ isPublished: false });
    const totalComments = await Comment.countDocuments();
    const pendingComments = await Comment.countDocuments({ status: 'pending' });
    const approvedComments = await Comment.countDocuments({ status: 'approved' });
    const totalTopics = await Topic.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });

    // Calculate total views from all posts
    const posts = await Post.find({}, 'views').lean();
    let totalViews = 0;
    posts.forEach(post => {
      if (post.views && Array.isArray(post.views)) {
        totalViews += post.views.reduce((sum, view) => sum + view, 0);
      }
    });

    // Get recent activity (last 10 notifications)
    const recentActivity = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name')
      .populate('relatedUser', 'name')
      .populate('relatedPost', 'title')
      .lean();

    // Get top authors by post count
    const topAuthors = await Post.aggregate([
      { $group: { _id: '$author', postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $project: {
          name: '$author.name',
          avatar: '$author.avatar',
          postCount: 1
        }
      }
    ]);

    // Get monthly views (last 12 months)
    const monthlyViews = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('fa-IR', { month: 'long' });
      
      // For now, we'll use random data since we don't have monthly tracking
      // In a real app, you'd track this properly
      monthlyViews.push({
        month: monthName,
        views: Math.floor(Math.random() * 10000) + 5000
      });
    }

    // Get posts by status for chart
    const postsByStatus = [
      { status: 'منتشر شده', count: publishedPosts },
      { status: 'پیش‌نویس', count: unpublishedPosts }
    ];

    // Get comments by status for chart
    const commentsByStatus = [
      { status: 'تایید شده', count: approvedComments },
      { status: 'در انتظار', count: pendingComments },
      { status: 'رد شده', count: totalComments - approvedComments - pendingComments }
    ];

    const stats = {
      overview: {
        totalUsers,
        totalAdmins,
        totalPosts,
        publishedPosts,
        unpublishedPosts,
        totalComments,
        pendingComments,
        approvedComments,
        totalTopics,
        bannedUsers,
        totalViews
      },
      charts: {
        monthlyViews,
        postsByStatus,
        commentsByStatus
      },
      recentActivity: recentActivity.map(activity => ({
        id: activity._id,
        type: activity.type,
        message: activity.message,
        user: activity.user?.name || 'کاربر ناشناس',
        relatedUser: activity.relatedUser?.name,
        relatedPost: activity.relatedPost?.title,
        createdAt: activity.createdAt
      })),
      topAuthors
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار داشبورد',
      error: error.message
    });
  }
};