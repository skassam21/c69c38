const Author = require('./author');
const Post = require('./post');

// associations

Author.hasMany(Post, {
  foreignKey: 'authorId',
});
Post.belongsTo(Author, {
  as: 'author',
  foreignKey: 'authorId',
});

module.exports = {
  Author,
  Post,
};
