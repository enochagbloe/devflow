import { models, Schema, model } from "mongoose";

export interface ITag {
    name: string; // Unique name for the tag
    question?: number; // Optional question associated with the tag
}

const TagSchema = new Schema<ITag>({
    name: { type: String, required: true, unique: true },
    question: { type: Number, default: 0 } // Default to 0 if not provided  ,
}, { timestamps: true });

const Tag = models?.Tag || model<ITag>("Tag", TagSchema);
export default Tag;