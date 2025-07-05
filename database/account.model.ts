import { models, Schema, model, Types } from "mongoose";

export interface IAccount {
  userId: Types.ObjectId; // Reference to the User model
  name: string;
  email: string;
  password: string;
  username: string;
  image?: string;
  provider: string; // e.g., 'google', 'github', etc.
  providerAccountId: string; // Unique ID from the provider
}
export interface IAccountDoc extends IAccount, Document {}
const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    image: { type: String},
    provider: { type: String, required: true }, // e.g., 'google', 'github', etc.
    providerAccountId: { type: String, required: true }, // Unique ID from the provider
  },
  {
    timestamps: true,
  }
);

const Account = models?.Account || model<IAccount>("Account", AccountSchema);
export default Account;