import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import User from '@models/user';

const signUp = (req: Request, res: Response): void => {
  const { name, password, email, coordinator } = req.body;
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds).then((hash) => {
    const user = new User({
      name,
      password: hash,
      email,
      coordinator,
    });
    user
      .save()
      .then(() => res.status(201).json(user))
      .catch((err) => res.status(500).json({ message: err.message, err }));
  });
};
const login = (req: Request, res: Response): void => {
  res.send('login');
};

export default { signUp, login };
