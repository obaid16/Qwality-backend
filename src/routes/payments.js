const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/PaymentController");
const { verifyJWT } = require("../middlewares/auth");

router.post("/create-order", verifyJWT, createOrder);

module.exports = router;
