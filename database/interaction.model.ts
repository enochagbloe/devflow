import { models, Schema, model, Types } from "mongoose";

export interface IInteraction {
    action: string; // Action performed by the user (e.g., "like", "comment")
    user: Types.ObjectId; // Reference to the User model
    actionId:Types.ObjectId; // ID of the entity being interacted with (e.g., Question, Answer)
    actionType: "question" | "answer"; // Type of action (e.g., question or answer)
}

const InteractionSchema = new Schema<IInteraction>({
    action: { type: String, required: true }, // Action performed by the user
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
    actionId: { type: Schema.Types.ObjectId, required: true }, // ID of the entity being interacted with (e.g., Question, Answer)
    actionType: { type: String, enum: ["question", "answer"], required: true }, // Type of action
}, { timestamps: true });

const Interaction = models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);
export default Interaction;