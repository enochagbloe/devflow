import { models, Schema, model, Types } from "mongoose";

export interface ITagQuestion {
    tags: Types.ObjectId; // Reference to the Tag model
    question:Types.ObjectId; // Reference to the Question model
}

export interface ITagQuestionDocument extends ITagQuestion, Document {}
const TagQuestionSchema = new Schema<ITagQuestion>({
    tags: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
}, { timestamps: true });

const TagQuestion = models?.TagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema);
export default TagQuestion;