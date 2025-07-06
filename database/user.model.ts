// create a schema for user

import  { model, models, Schema, Document } from "mongoose";


//accept typescript types
export interface IUser {
    name: string;
    email: string;
    username: string;
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
}

// Define the schema for the user model
// This schema defines the structure of the user document in the MongoDB database
export interface IUserDoc extends IUser, Document {}
const UserSchema = new Schema({
    // what are the thing or schema the user needs to have
    name:{ type: String, required: true },
    email:{ type: String, required: true, unique: true },
    username:{ type: String, required: function(this:any) { return this.provider === "credentials"; }},
    bio:{ type: String },
    image:{ type: String },
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