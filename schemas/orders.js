import mongoose from "mongoose";

const objectId = mongoose.Types.ObjectId;

const orderSchema = new mongoose.Schema({
    user_id: {
        type: objectId,
        required: true,
        ref: "User"
    },
    products: {
        type: [
            {
                product_id: {
                    type: objectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1
                },
                total_price: {
                    type: Number,
                    required: true,
                }
            }],
        required: true,
        default: []
    },
    status: {
        type: String,
        enum: ["pending", "working", "completed", "canceled"],
        default: "pending"
    },
    total_price: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

export default mongoose.model("Order", orderSchema);