import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '@models/user';

const verifyAuthorization = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        User.findById(decodedToken.id)
          .then((user) => (user && user.coordinator ? next() : res.status(401).json({ message: 'Unauthorized' })))
          .catch((error) => res.status(401).json({ message: error.message }));
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export default verifyAuthorization;
