import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    username: {
        type:Schema.Types.String,
        required:true,
        unique:true,
    },
    name:Schema.Types.String,
    password:{
        type:Schema.Types.String,
        required:true,
    }
})

export const User = model('User',UserSchema);