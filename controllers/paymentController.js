import 'dotenv/config';
import Stripe from "stripe";
import Payment from "../models/paymentModel.js";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res, next) => {
    try {
        const { amount, orderId, userId } = req.body;

        // تحقق من صحة IDs
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: "Invalid userId or orderId" });
        }

        const userObjId = new mongoose.Types.ObjectId(userId);
        const orderObjId = new mongoose.Types.ObjectId(orderId);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: "usd",
            metadata: { orderId, userId },
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        });


        const payment = await Payment.create({
            userId: userObjId,
            orderId: orderObjId,
            amount,
            currency: "usd",
            status: "pending",
            stripePaymentIntentId: paymentIntent.id
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            payment
        });
    } catch (err) {
        next(err);
    }
};


export const handleWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = event = req.body;

    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        await Payment.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntent.id },
            { status: "succeeded" }
        );
    }

    if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object;
        await Payment.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntent.id },
            { status: "failed" }
        );
    }

    res.json({ received: true });
};