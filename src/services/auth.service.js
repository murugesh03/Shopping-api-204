const User = require("../models/user.model");

exports.createUser = async (userData) => {
  // If we are doing any manipulation in the object use new keyword other wise we are go with the create mongoose method
  const user = new User(userData);
  return await user.save();
};

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};
