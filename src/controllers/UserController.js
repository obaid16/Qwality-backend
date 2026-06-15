const userRepository = require("../repositories/UserRepository");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const getProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  
  if (name) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;

  await req.user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile updated successfully"));
});

const addAddress = asyncHandler(async (req, res) => {
  const { name, street, city, state, zip, country, isDefault } = req.body;
  
  if (isDefault) {
    req.user.addresses.forEach(addr => addr.isDefault = false);
  }

  req.user.addresses.push({ name, street, city, state, zip, country, isDefault: !!isDefault });
  await req.user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, req.user.addresses, "Address added successfully"));
});

const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const { name, street, city, state, zip, country, isDefault } = req.body;

  const address = req.user.addresses.id(addressId);
  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  if (isDefault) {
    req.user.addresses.forEach(addr => addr.isDefault = false);
    address.isDefault = true;
  } else if (isDefault === false) {
    address.isDefault = false;
  }

  if (name) address.name = name;
  if (street) address.street = street;
  if (city) address.city = city;
  if (state) address.state = state;
  if (zip) address.zip = zip;
  if (country) address.country = country;

  await req.user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, req.user.addresses, "Address updated successfully"));
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const address = req.user.addresses.id(addressId);
  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  // Use pull on parent array to delete
  req.user.addresses.pull(addressId);
  await req.user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, req.user.addresses, "Address deleted successfully"));
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const address = req.user.addresses.id(addressId);
  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  req.user.addresses.forEach(addr => {
    addr.isDefault = addr._id.toString() === addressId;
  });

  await req.user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, req.user.addresses, "Default address set successfully"));
});

// Admin views
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const options = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    sort: { createdAt: -1 },
  };

  const result = await userRepository.find({}, options);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "All users fetched successfully"));
});

const toggleUserBlock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { block } = req.body; // boolean

  const user = await userRepository.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(400, "Cannot block/unblock admin accounts");
  }

  user.isBlocked = !!block;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, `User is now ${user.isBlocked ? "blocked" : "active"}`));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await userRepository.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(400, "Cannot delete admin accounts");
  }

  await userRepository.deleteById(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAllUsers,
  toggleUserBlock,
  deleteUser,
};
