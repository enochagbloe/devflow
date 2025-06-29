// create a schema for user

import  { model, models, Schema } from "mongoose";

//accept typescript types
export interface IUser {
    name: string;
    email: string;
    password: string;
    username: string;
    bio?: string;
    avatar: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
}

// Define the schema for the user model
// This schema defines the structure of the user document in the MongoDB database
const UserSchema = new Schema({
    // what are the thing or schema the user needs to have
    name:{ type: String, required: true },
    email:{ type: String, required: true },
    password:{ type: String, required: true },
    username:{ type: String, required: true },
    bio:{ type: String, required: "" },
    avatar:{ type: String, required: true },
    location:{ type: String},
    portfolio:{ type: String },
    reputation:{ type: Number, default: 0 },
}, {
    timestamps: true,
});

// define the user model and if the user model already exists, create a new model
// define the type interface in the model
// this will allow us to use the IUser interface in the user model
const User = models?.User || model<IUser>("User", UserSchema);
export default User;


