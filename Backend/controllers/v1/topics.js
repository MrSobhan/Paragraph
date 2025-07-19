const Topic = require("../../models/Topic");

exports.getTopics = async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    const topics = await Topic.find(query)
      .populate('parentTopic', 'name')
      .lean();

    // Create a tree structure with parent and children
    const topicMap = {};
    const result = [];

    // Initialize topic map
    topics.forEach((topic) => {
      topicMap[topic._id.toString()] = { ...topic, children: [] };
    });

    // Build hierarchy
    topics.forEach((topic) => {
      if (topic.parentTopic) {
        const parentId = topic.parentTopic._id.toString();
        if (topicMap[parentId]) {
          topicMap[parentId].children.push(topicMap[topic._id.toString()]);
        }
      } else {
        result.push(topicMap[topic._id.toString()]);
      }
    });

    res.status(200).json({ topics: result });
  } catch (error) {
    res.status(500).json({ message: 'خطا در دریافت موضوعات', error: error.message });
  }
};
exports.createTopic = async (req, res) => {
  try {
    const { name, description, parentTopic, isMainTopic } = req.body;
    const topic = new Topic({ name, description, parentTopic, isMainTopic });
    await topic.save();
    res.status(201).json({ message: "موضوع با موفقیت ایجاد شد", topic });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد موضوع", error: error.message });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: "موضوع یافت نشد" });
    }
    Object.assign(topic, req.body);
    await topic.save();
    res.status(200).json({ message: "موضوع با موفقیت به‌روزرسانی شد", topic });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در به‌روزرسانی موضوع", error: error.message });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: "موضوع یافت نشد" });
    }
    await Topic.deleteOne({ _id: id });
    res.status(200).json({ message: "موضوع با موفقیت حذف شد" });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف موضوع", error: error.message });
  }
};
