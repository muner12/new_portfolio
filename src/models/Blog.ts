import mongoose, { Schema, Document } from "mongoose";

export interface ITableOfContents {
  title: string;
  id: string;
  level: number;
}

export interface IRevisionHistory {
  content: string;
  updatedAt: Date;
  changeDescription: string;
}

export interface IBlog extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  featuredImage?: string;
  embedVideo?: string;
  categories: mongoose.Types.ObjectId[];
  tags: string[];
  featured: boolean;
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  scheduledFor?: Date;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  viewCount: number;
  uniqueViewCount: number;
  readingTime?: number;
  tableOfContents: ITableOfContents[];
  revisionHistory: IRevisionHistory[];
  relatedPosts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    coverImage: {
      type: String,
    },
    featuredImage: {
      type: String,
    },
    embedVideo: {
      type: String,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    scheduledFor: {
      type: Date,
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    ogImage: {
      type: String,
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    uniqueViewCount: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
    },
    tableOfContents: [
      {
        title: String,
        id: String,
        level: Number,
      },
    ],
    revisionHistory: [
      {
        content: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        changeDescription: String,
      },
    ],
    relatedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for generating slug and reading time
BlogSchema.pre("save", function (next) {
  // Only update slug if title changed or new document
  if (this.isModified("title") || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Calculate reading time
  if (this.isModified("content")) {
    const wordCount = this.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200); // Assuming 200 wpm reading speed

    // Generate table of contents
    const headingRegex = /<h([2-4])[^>]*id="([^"]+)"[^>]*>([^<]+)<\/h\1>/g;
    const headings = [];
    let match: RegExpExecArray | null;

    while ((match = headingRegex.exec(this.content)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        id: match[2],
        title: match[3],
      });
    }

    this.tableOfContents = headings;

    // Add to revision history if not a new document
    if (!this.isNew) {
      if (!this.revisionHistory) {
        this.revisionHistory = [];
      }

      this.revisionHistory.push({
        content: this.content,
        updatedAt: new Date(),
        changeDescription: "Content updated",
      });
    }
  }

  // Set published date if status changed to published
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema); 