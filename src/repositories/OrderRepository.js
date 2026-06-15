const BaseRepository = require("./BaseRepository");
const Order = require("../models/Order");

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  async getRevenueMetrics() {
    const revenue = await this.model.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    return revenue[0] || { totalRevenue: 0, totalOrders: 0 };
  }

  async getMonthlyRevenue() {
    return await this.model.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getTopSellingProducts() {
    return await this.model.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalQty: { $sum: "$items.quantity" },
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]);
  }
}

module.exports = new OrderRepository();
