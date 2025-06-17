import { models, Schema, model } from "mongoose";

export interface ITagQuestion {
    tags: Schema.Types.ObjectId; // Reference to the Tag model
    question: Schema.Types.ObjectId; // Reference to the Question model
}

const TagQuestionSchema = new Schema<ITagQuestion>({
    tags: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
}, { timestamps: true });

const TagQuestion = models?.TagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema);
export default TagQuestion;