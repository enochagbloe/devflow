import { models, Schema, model } from "mongoose";

export interface ITag {
    name: string; // Unique name for the tag
    questions: number; // Number of question associated with the tag
}
export interface ITagDoc extends ITag, Document {
  _id: any;
}
const TagSchema = new Schema<ITag>({
    name: { type: String, required: true, unique: true },
    questions: { type: Number, default: 0 } // Default to 0 if not provided  ,
}, { timestamps: true });

const Tag = models?.Tag || model<ITag>("Tag", TagSchema);
export default Tag;