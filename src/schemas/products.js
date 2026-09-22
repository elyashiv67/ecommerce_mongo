import mongoose from 'mongoose';

const objectId = mongoose.Types.ObjectId;

const ProductSchema = new mongoose.Schema({
    user_id:{
        type: objectId,
        required: true,
        ref: 'User'
    },
    category_id:{
        type: objectId,
        required: true,
        ref: 'Category'
    },
    title: {
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
}, {timestamps: true});

export default mongoose.model('Product', ProductSchema);