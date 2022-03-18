const Sequelize = require('sequelize');
const db = require('../db');

const Post = db.define('post', {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  likes: {
    type: Sequelize.NUMBER,
    allowNull: false,
    defaultValue: 0,
  },
  reads: {
    type: Sequelize.NUMBER,
    allowNull: false,
    defaultValue: 0,
  },
  popularity: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
    validate: {
      min: 0.0,
      max: 1.0,
    },
  },
  tags: {
    // note: comma separated string since sqlite does not support arrays
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Post;
