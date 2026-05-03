import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderId: String,
    paymentId: String,
    amount: Number,
    product: Object,
});

const Order = mongoose.model("order", orderSchema);

export default Order;