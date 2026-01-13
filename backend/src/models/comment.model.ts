import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  token: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    token: { type: Schema.Types.ObjectId, ref: "Token", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 500 },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
