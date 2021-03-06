const jwt = require('jsonwebtoken');

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}
const { Author } = require('./db/models');

/* eslint-disable-next-line no-unused-vars */
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  });
}

/* eslint-disable-next-line no-unused-vars */
function auth(req, res, next) {
  const token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return next();
      }
      Author.findOne({
        where: { id: decoded.id },
      })
        .then((author) => {
          if (!author) {
            throw new Error('No author found with provided token');
          }
          req.author = author;
          return next();
        })
        .catch(() => {
          next();
        });
    });
  } else {
    return next();
  }
}

module.exports = {
  notFound,
  errorHandler,
  auth,
};
