const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const ApiError = require("../utils/ApiError");

class PaymentService {
  async createRazorpayOrder(amountInDollars) {
    try {
      const options = {
        amount: Math.round(amountInDollars * 100), // convert dollars to cents/paise
        currency: "INR", // Razorpay standard demo currency
        receipt: `receipt_order_${Date.now()}`,
      };
      
      const order = await razorpay.orders.create(options);
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      };
    } catch (error) {
      console.error("Razorpay order placement failed: ", error);
      throw new ApiError(500, "Razorpay payment integration failure");
    }
  }

  verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const text = razorpayOrderId + "|" + razorpayPaymentId;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "razorpay_secret_key_123456")
      .update(text)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      throw new ApiError(400, "Payment signature validation mismatch. Transaction invalid.");
    }
    return true;
  }
}

module.exports = new PaymentService();
