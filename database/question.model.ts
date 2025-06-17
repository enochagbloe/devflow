import { Schema, model, models } from "mongoose";

export interface IQuestion {
    title: string;
    author: Schema.Types.ObjectId; // Reference to the User model
    content: string;
    tags: Schema.Types.ObjectId[];
    upvotes: number;
    downvotes: number;
    views: number;
    answers: boolean;
}

const QuestionSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    answers: { type: Number, default: false },
  },
  {
    timestamps: true,
  }
);

const Question = models?.Question || model("Question", QuestionSchema);
export default Question;
