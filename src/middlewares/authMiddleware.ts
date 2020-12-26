import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '@models/user';

const verifyAuthorization = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.jwt;
  if (token) {
    console.log('if token');
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        User.find({ id: decodedToken.id, coordinator: true })
          .exec()
          .then((userAuthorized) =>
            userAuthorized.length > 0 ? next() : res.status(401).json({ message: 'Unauthorized' })
          )
          .catch((error) => res.status(500).json({ message: error.message }));
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export default verifyAuthorization;
