import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '@models/user';

const maxAge = 7 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

const signUp = (req: Request, res: Response): void => {
  const { name, password, email, coordinator } = req.body;
  const saltRounds = 10;
  User.findOne({ email })
    .then(() => res.status(200).json({ message: 'Email already exists' }))
    .catch(() => {
      bcrypt.hash(password, saltRounds).then((hash) => {
        const user = new User({
          name,
          password: hash,
          email,
          coordinator,
        });
        user
          .save()
          .then(() => {
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(201).json({ user: user._id, email: user.email });
          })
          .catch((err) => {
            res.status(500).json({ message: err.message, err });
          });
      });
    });
};
const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      bcrypt.compare(password, user.password).then((auth) => {
        if (auth) {
          const token = createToken(user._id);
          res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(200).json({ user: user._id });
        } else {
          res.status(404).json({ message: 'Email or password invalid' });
        }
      });
    })
    .catch(() => res.status(404).json({ message: 'Email or password invalid' }));
};

export default { signUp, login };
