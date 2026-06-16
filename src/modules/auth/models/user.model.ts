import type { IUser } from '@/types/types.js';
import { VALIDATIONS } from '@/utils/constants.js';
import mongoose, { Document, Model } from 'mongoose';

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [3, 'Name must be at least 3 chars long'],
      maxLength: [50, "Name shouldn't exceed 50 characters"],
      validate: {
        validator: v => v != null && v.trim().length > 0,
        message: "Name can't be blank",
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [VALIDATIONS.EMAIL_REGEX_PATTERN, 'Please Provide a valid Email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [
        VALIDATIONS.PASSWORD_MIN_LENGTH,
        `Password Must be at least ${VALIDATIONS.PASSWORD_MIN_LENGTH} characters long`,
      ],
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc: Document, ret: Record<string, any>) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.password;
      },
    },
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
