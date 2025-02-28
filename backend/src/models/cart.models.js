import mongoose from "mongoose";

const variationSchema = new mongoose.Schema({
    color: String,
    size: String, 
    quantity: Number,
    image: String
});

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    variations: [variationSchema] // Each product can have multiple variations
});

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    sessionId: { type: String, default: null },
    cartItems: [cartItemSchema]
});

export default mongoose.model("Cart", cartSchema);
