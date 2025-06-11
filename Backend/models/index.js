const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Topic = require('./Topic');
const List = require('./List');
const Like = require('./Like');
const Notification = require('./Notification');

module.exports = {
  User,
  Post,
  Comment,
  Topic,
  List,
  Like,
  Notification,
};