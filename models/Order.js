import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Check if model already exists to avoid OverwriteModelError
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
