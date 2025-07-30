import { model, models, Schema, Types, Document } from "mongoose";

export interface IAccount {
  userId: Types.ObjectId;
  email: string;
  username?: string;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
}

export interface IAccountDoc extends IAccount, Document {}
const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true, unique: true, optional: true },
    username: { type: String, required: true, unique: true, optional: true },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true }
);

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account;