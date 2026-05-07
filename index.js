import express from 'express';
import Connection from './database/db.js';
import dotenv from 'dotenv';
import DefaultData from './default.js';
import Router from './routes/route.js';
import cors from 'cors';
import bodyParser from 'body-parser';
// import { v4 as uuid } from 'uuid';
import mongoose from 'mongoose';

const app = express();

dotenv.config()

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://flipcart-frontend-ryij.vercel.app'],
  credentials: true
}));

app.use(bodyParser.json({ extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', Router);

// Health check route (important for render)
app.get('/', (req, res) => {
  res.send('Backend is running');
})

const PORT = process.env.PORT || 8000;

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

// Connect DB + Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  
    app.listen(PORT, () => {
      console.log(`Server is running successfully on port ${PORT}`);
    });

    // send data after DB is ready
    DefaultData();
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });



// export let paytmMerchantKey = process.env.PAYTM_MERCHANT_KEY;
// export let paytmParams = {};
// paytmParams['MID'] = process.env.PAYTM_MID;
// paytmParams['WEBSITE'] = 'WEBSTAGING';
// paytmParams['CHANNEL_ID'] = process.env.PAYTM_CHANNEL_ID;
// paytmParams['INDUSTRY_TYPE_ID'] = process.env.PAYTM_INDUSTRY_TYPE_ID;
// paytmParams['ORDER_ID'] = uuid();
// paytmParams['CUST_ID'] = process.env.PAYTM_CUST_ID;
// paytmParams['TXN_AMOUNT'] = '100';
// paytmParams['CALLBACK_URL'] = 'http://localhost:8000/callback';
// paytmParams['EMAIL'] = 'test@gmail.com';
// paytmParams['MOBILE_NO'] = '1234567890';



