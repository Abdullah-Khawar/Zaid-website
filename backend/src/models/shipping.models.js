import mongoose from "mongoose";

const ShippingPriceSchema = new mongoose.Schema({
  province: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true
});

const ShippingPrice = mongoose.model('ShippingPrice', ShippingPriceSchema);
export default ShippingPrice;