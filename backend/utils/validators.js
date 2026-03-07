const Joi = require('joi');

// Validate register input
const validateRegister = (data) => {
  const schema = Joi.object({
    full_name: Joi.string().min(3).max(100).required(),
    national_id: Joi.string().min(4).max(20).required(),
    phone: Joi.string().min(10).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
  });
  return schema.validate(data);
};

// Validate login input
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};

// Validate deposit/withdraw input
const validateAmount = (data) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required()
  });
  return schema.validate(data);
};

// Validate transfer input
const validateTransfer = (data) => {
  const schema = Joi.object({
    receiver_id: Joi.number().integer().positive().required(),
    amount: Joi.number().positive().required()
  });
  return schema.validate(data);
};

// Validate loan application input
const validateLoan = (data) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required(),
    duration_months: Joi.number().integer().min(1).max(60).required()
  });
  return schema.validate(data);
};

// Validate PIN input
const validatePin = (data) => {
  const schema = Joi.object({
    pin: Joi.string().length(4).pattern(/^\d+$/).required()
  });
  return schema.validate(data);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateAmount,
  validateTransfer,
  validateLoan,
  validatePin
};