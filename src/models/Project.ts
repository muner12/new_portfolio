import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubLink?: string;
  demoLink?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    image: {
      type: String,
    },
    technologies: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      trim: true,
    },
    demoLink: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema); 