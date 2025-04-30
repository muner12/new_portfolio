import mongoose, { Schema, Document } from "mongoose";

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
}

export interface IContact {
  email?: string;
  phone?: string;
  address?: string;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  title: string;
  description: string;
  photo?: string;
  resume?: string;
  socialLinks: ISocialLinks;
  contact: IContact;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Professional title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    photo: {
      type: String,
    },
    resume: {
      type: String,
    },
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      facebook: String,
      instagram: String,
      youtube: String,
      website: String,
    },
    contact: {
      email: String,
      phone: String,
      address: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema); 