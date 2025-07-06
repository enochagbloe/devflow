import { models, Schema, model, Types, Document } from "mongoose";

export interface IAccount {
  userId: Types.ObjectId; // Reference to the User model
  provider: string; // e.g., 'google', 'github', etc.
  providerAccountId: string; // Unique ID from the provider
}
export interface IAccountDoc extends IAccount, Document {}
const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, required: true }, // e.g., 'google', 'github', etc.
    providerAccountId: { type: String, required: true }, // Unique ID from the provider
  },
  {
    timestamps: true,
  }
);

const Account = models?.Account || model<IAccount>("Account", AccountSchema);
export default Account;