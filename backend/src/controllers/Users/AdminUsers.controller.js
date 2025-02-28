import User from "../../models/user.models.js";
import Cart from "../../models/cart.models.js";
import { v4 as uuidv4 } from 'uuid';
import ShippingPrice from "../../models/shipping.models.js";


export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};


// @desc Get all shipping prices
export const getShippingPrices = async (req, res) => {
  try {
    const prices = await ShippingPrice.find();
    res.json(prices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getShippingPricesByQuery = async (req, res) => {
  const { province, city } = req.query;
  console.log('Province:', req.query.province);
console.log('City:', req.query.city);

  try {
    const shippingPrice = await ShippingPrice.findOne({ province, city });
    if (!shippingPrice) {
      return res.status(404).json({ message: 'Shipping price not found' });
    }
    console.log(shippingPrice.price);
    res.status(200).json({ price: shippingPrice.price });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Add Shipping Price
export const addShippingPrice = async (req, res) => {
  const { province, city, price } = req.body;
  console.log("SHIPPING ADD START")

  if (!province || !city || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }
  console.log("SHIPPING ADD after !")

  try {
    const newPrice = await ShippingPrice.create({
      province,
      city,
      price,
    });
    const prices = await ShippingPrice.find();
    res.status(201).json(prices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// @desc Update Shipping Price
export const updateShippingPrice = async (req, res) => {
  const { province, city, price } = req.body;

  if (!province || !city || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedPrice = await ShippingPrice.findByIdAndUpdate(
      req.params.id,
      { province, city, price },
      { new: true }
    );

    if (!updatedPrice) {
      return res.status(404).json({ message: "Shipping price not found" });
    }

    const prices = await ShippingPrice.find();
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// @desc Delete Shipping Price
export const deleteShippingPrice = async (req, res) => {
  try {
    const deletedPrice = await ShippingPrice.findByIdAndDelete(req.params.id);

    if (!deletedPrice) {
      return res.status(404).json({ message: "Shipping price not found" });
    }

    const prices = await ShippingPrice.find();
    res.json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

