import { models, Schema, model } from "mongoose";

export interface IVote {
    author: Schema.Types.ObjectId;
    id: Schema.Types.ObjectId;
    type: "question" | "answer";
    voteType: "upvote" | "downvote";
}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Schema.Types.ObjectId, required: true }, // Reference to the Question or Answer
    type: { type: String, enum: ["question", "answer"], required: true }, // Type of the vote, either 'question' or 'answer'
    voteType: { type: String, enum: ["upvote", "downvote"], required: true }, // Type of vote, either 'upvote' or 'downvote'
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);
export default Vote;
