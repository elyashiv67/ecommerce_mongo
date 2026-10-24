import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    desc:{
        type: String,
        required: true,
    },
},
    {timestamps: true});

export default mongoose.model("Category", categorySchema);