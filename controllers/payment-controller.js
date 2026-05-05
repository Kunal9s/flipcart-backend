import PaytmChecksum from "../paytm/PaytmChecksum.js";
import { v4 as uuid } from "uuid";
import Razorpay from "razorpay";
import dotenv from 'dotenv';
import crypto from 'crypto';
import Order from "../model/order-schema.js";
dotenv.config();

// ================= PAYTM =================
export const addPaymentGateway = async (req, res) => {
  try {
    const paytmParams = {};

    paytmParams["MID"] = process.env.PAYTM_MID;
    paytmParams["WEBSITE"] = "WEBSTAGING";
    paytmParams["CHANNEL_ID"] = process.env.PAYTM_CHANNEL_ID;
    paytmParams["INDUSTRY_TYPE_ID"] = process.env.PAYTM_INDUSTRY_TYPE_ID;
    paytmParams["ORDER_ID"] = uuid();
    paytmParams["CUST_ID"] = process.env.PAYTM_CUST_ID;
    paytmParams["TXN_AMOUNT"] = "100";
    paytmParams["CALLBACK_URL"] = "https://flipcart-backend-smop.onrender.com/callback";
    paytmParams["EMAIL"] = "test@gmail.com";
    paytmParams["MOBILE_NO"] = "9999999999";

    const checksum = await PaytmChecksum.generateSignature(
      paytmParams,
      process.env.PAYTM_MERCHANT_KEY,
    );

    paytmParams["CHECKSUMHASH"] = checksum;

    return res.json(paytmParams);
  } catch (error) {
    console.log("PAYTM ERROR:", error);
    res.status(500).send("Error in Paytm");
  }
};

export const paytmCallback = (req, res) => {
  console.log("CALLBACK DATA:", req.body);
  res.send("Payment successful (callback received)");
};

// ================= RAZORPAY =================

export const createOrder = async (req, res) => {
  try {
     console.log("REQ BODY:", req.body);
    const amount = Number(req.body.amount) * 100;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount,
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.log("RAZORPAY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    console.log("VERIFY BODY:", req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Order.create({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: req.body.amount || 0,
      });

      return res.status(200).json({ success: true });
    } else {

      res.status(400).json({ success: false });
    }

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();  // fetch all orders
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
