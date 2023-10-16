import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

async function auth(req, res, next) {
  const authHeader = req.headers['authorization'] ? req.headers['authorization'] : undefined;

  if (!authHeader) {
    return res.status(401).json({ msg: 'Authorization header is missing' });
  }

  const secretKey = process.env.SECRET;
  const authToken = authHeader.replace('Bearer ', '');

  try {
    const authorized = jwt.verify(authToken, secretKey);
    const user = await User.findOne({ _id: authorized.id });

    if (user.userRole === 'USER' || user.userRole === 'ADMIN') {
      req.user = user;
      next();
    } else {
      res.status(401).json({ msg: 'Unauthorized request!' });
    }
  } catch (err) {
    console.log(err.name);
    res.status(400).json({ msg: 'Invalid token' });
  }
}

export { auth };
