import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import IUser from '@interfaces/user';

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, minlength: 6, required: true },
  coordinator: { type: Boolean, required: true },
});

userSchema.plugin(uniqueValidator);
export default mongoose.model<IUser>('user', userSchema);
