import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String},
  },
  { _id: false }
);


const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [imageSchema],
    sizes: {
      type: Map,
      of: Number,
      
    },

    stock: {
      type: Number,
      validate: {
        validator: function (value) {
          return this.sizes === undefined; // Prevent both stock & sizes
        },
        message: "Either 'sizes' or 'stock' can be defined, but not both."
      }
    },
  },
  { _id: false }
);

const productInfoSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    items: [{ type: String }],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return !value || value < this.price;
        },
        message: "Discounted price must be lower than the original price."
      }
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    colors: [colorSchema],
    productInfo: [productInfoSchema],
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model("Product", productSchema);

export default Product;
