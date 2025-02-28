import mongoose from 'mongoose';

const { Schema } = mongoose;

// Order Product Schema (Reference to Product)
const orderProductSchema = new Schema({
    productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    productName: { type: String, required: true }, // Store product name for historical record
    productCategory: { type: String }, // Store category to preserve history
    selectedColor: { type: String, required: true },
    selectedSize: { type: String },
    quantity: { type: Number, required: true },
    discountedPrice: { type: Number, required: true }, // Preserving historical data
    totalPrice: { type: Number, required: true }       // Preserving historical data
}, { _id: false });

// Order Schema (Stored Separately from Customers)
const orderSchema = new Schema({
    customerId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    customerName: { type: String, required: true }, 
    customerEmail: { type: String, required: true },
    orderDate: { type: Date, required: true, default: Date.now },
    orderStatus: { 
        type: String, 
        enum: ['pending', 'shipped', 'delivered', 'cancelled'], 
        required: true,
        default: 'pending'
    },
    orderAddress: { type: String, required: true },
    paymentMethod: { 
        type: String, 
        enum: ['Credit Card', 'JazzCash', 'EasyPaisa', 'CashOnDelivery'],
        default: 'CashOnDelivery' 
    },
    orderPhoneNumber: { type: String },
    productsTotal: { type: Number, required: true }, // Stores total product cost only
    shippingCost: { type: Number, required: true, default: 0 }, // Shipping cost separately
    finalAmount: { type: Number, required: true }, // Includes productsTotal + shippingCost
    products: [orderProductSchema]
}, { timestamps: true });

// Indexing for better query performance
orderSchema.index({ customerId: 1 });
orderSchema.index({ orderDate: 1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
