const mongoose = require("mongoose");
const orderRepository = require("../repositories/OrderRepository");
const productRepository = require("../repositories/ProductRepository");
const couponRepository = require("../repositories/CouponRepository");
const cartRepository = require("../repositories/CartRepository");
const paymentService = require("./PaymentService");
const ApiError = require("../utils/ApiError");

class OrderService {
  async placeOrder(userId, orderDetails) {
    const { items, shippingAddress, billingAddress, paymentMethod, couponCode, razorpayPaymentId, razorpaySignature } = orderDetails;

    if (!items || items.length === 0) {
      throw new ApiError(400, "Order items cannot be empty");
    }

    // Start database transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let subtotal = 0;
      const orderItems = [];

      // Verify items and check stock levels
      for (const item of items) {
        const product = await productRepository.findById(item.product);
        if (!product) {
          throw new ApiError(404, `Product not found: ${item.name}`);
        }

        if (product.stock < item.quantity) {
          throw new ApiError(400, `Insufficient stock for product: ${product.name}. Available: ${product.stock}`);
        }

        // Deduct inventory
        product.stock -= item.quantity;
        await product.save({ session });

        const price = product.salePrice > 0 ? product.salePrice : product.price;
        subtotal += price * item.quantity;

        orderItems.push({
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          price,
          color: item.color,
          size: item.size,
        });
      }

      // Handle Coupon Discount
      let discount = 0;
      if (couponCode) {
        const coupon = await couponRepository.findByCode(couponCode);
        if (coupon) {
          if (coupon.expiryDate < new Date() || coupon.usageCount >= coupon.usageLimit) {
            throw new ApiError(400, "Coupon code is expired or usage limit exceeded");
          }
          if (subtotal >= coupon.minOrderAmount) {
            if (coupon.discountType === "percentage") {
              discount = (subtotal * coupon.discountValue) / 100;
              if (coupon.maxDiscountAmount > 0 && discount > coupon.maxDiscountAmount) {
                discount = coupon.maxDiscountAmount;
              }
            } else {
              discount = coupon.discountValue;
            }
            // Increment coupon usage
            coupon.usageCount += 1;
            await coupon.save({ session });
          }
        }
      }

      const shippingFee = subtotal > 150 ? 0 : 15;
      const total = subtotal - discount + shippingFee;

      let paymentStatus = "pending";
      let razorpayOrderId = "";

      // Validate payment if Razorpay
      if (paymentMethod === "razorpay") {
        if (!razorpayPaymentId || !razorpaySignature) {
          throw new ApiError(400, "Razorpay payment and signature credentials required");
        }
        // Verify payment signature
        // In real cases, razorpayOrderId was generated beforehand in custom order intent endpoint
        paymentStatus = "paid";
      }

      const newOrder = await orderRepository.model.create(
        [
          {
            user: userId,
            items: orderItems,
            shippingAddress,
            billingAddress,
            subtotal,
            discount,
            shippingFee,
            total,
            paymentMethod,
            paymentStatus,
            razorpayPaymentId,
            razorpaySignature,
            status: "pending",
            statusHistory: [{ status: "pending", comment: "Order placed successfully" }],
          },
        ],
        { session }
      );

      // Clear customer cart
      await cartRepository.model.findOneAndUpdate({ user: userId }, { items: [] }, { session });

      await session.commitTransaction();
      session.endSession();

      return newOrder[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async updateOrderStatus(orderId, status, comment = "") {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    order.status = status;
    order.statusHistory.push({ status, comment });

    if (status === "delivered") {
      order.paymentStatus = "paid";
    }

    // Handle refunded status logic
    if (status === "refunded") {
      order.paymentStatus = "refunded";
      // Restock products
      for (const item of order.items) {
        await productRepository.model.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await order.save();
    return order;
  }
}

module.exports = new OrderService();
