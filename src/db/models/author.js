const Sequelize = require('sequelize');
const crypto = require('crypto');
const db = require('../db');

const Author = db.define('author', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      min: 6,
    },
    allowNull: false,
    get() {
      return () => this.getDataValue('password');
    },
  },
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('salt');
    },
  },
});

Author.correctPassword = function (author, password) {
  return Author.encryptPassword(password, author.salt()) === author.password();
};

Author.createSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};

Author.encryptPassword = function (plainPassword, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainPassword)
    .update(salt)
    .digest('hex');
};

const setSaltAndPassword = (author) => {
  if (author.changed('password')) {
    author.salt = Author.createSalt();
    author.password = Author.encryptPassword(author.password(), author.salt());
  }
};

Author.beforeCreate(setSaltAndPassword);
Author.beforeUpdate(setSaltAndPassword);
Author.beforeBulkCreate((authors) => {
  authors.forEach(setSaltAndPassword);
});

module.exports = Author;
