import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  company: string;
  location: string;
  from: Date;
  to?: Date;
  current: boolean;
  description: string;
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    from: {
      type: Date,
      required: [true, "Start date is required"],
    },
    to: {
      type: Date,
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    technologies: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Experience || mongoose.model<IExperience>("Experience", ExperienceSchema); 