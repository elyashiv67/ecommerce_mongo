import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            maxLength: 10
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        address: {
            type: String,
            required: true,
        },
        role:{
            type: String,
            enum: ['user', 'seller' , 'admin'],
            required: true,
            default: 'user',
        }
    },
    {timestamps: true});

export default mongoose.model("User", UserSchema);