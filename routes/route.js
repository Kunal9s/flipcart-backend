import express from 'express';
import { userSignup, userLogin } from '../controllers/userController.js';
import { getProducts, getProductById } from '../controllers/product-controller.js';
import { addPaymentGateway } from '../controllers/payment-controller.js';
import { paytmCallback } from '../controllers/payment-controller.js';
import { createOrder } from '../controllers/payment-controller.js';
import { verifyPayment } from '../controllers/payment-controller.js';
import { getOrders } from '../controllers/payment-controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/payment', addPaymentGateway);
router.post('/callback', paytmCallback);
router.post('/razorpay/order', createOrder);
router.post('/razorpay/verify', verifyPayment);

router.get('/products', getProducts);
router.get('/product/:id', getProductById);
// router.get('/orders', getOrders);
router.get('/orders', verifyToken, getOrders);

// router.post('/login', (req, res) => {
//   res.send("working");
// });

export default router;