import mongoose, { Schema, Document } from "mongoose";

export interface IEducation extends Document {
  userId: mongoose.Types.ObjectId;
  institution: string;
  degree: string;
  field: string;
  location: string;
  from: Date;
  to?: Date;
  current: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    institution: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
    },
    field: {
      type: String,
      required: [true, "Field of study is required"],
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
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Education || mongoose.model<IEducation>("Education", EducationSchema); 