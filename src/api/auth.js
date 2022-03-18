const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Author } = require('../db/models');

/**
 * Register a new author
 * req.body is expected to contain {username: required(string), password: required(string)}
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    }

    const author = await Author.create(req.body);

    const token = jwt.sign(
      { id: author.dataValues.id },
      process.env.SESSION_SECRET,
      { expiresIn: 86400 }
    );
    res.json({
      ...author.dataValues,
      token,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(401)
        .json({ error: 'Author with provided username already exists' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(401).json({ error: 'Validation error' });
    }
    next(error);
  }
});

/**
 * Authenticate an existing author
 * req.body is expected to contain {username: required(string), password: required(string)}
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required fields' });
    }

    const author = await Author.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!author) {
      return res.status(401).json({ error: 'Wrong username and/or password' });
    }
    if (!Author.correctPassword(author, password)) {
      return res.status(401).json({ error: 'Wrong username and/or password' });
    }
    const token = jwt.sign(
      { id: author.dataValues.id },
      process.env.SESSION_SECRET,
      { expiresIn: 86400 }
    );
    res.json({
      ...author.dataValues,
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
