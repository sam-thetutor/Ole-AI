const { body, param, validationResult } = require('express-validator');

// Stellar wallet address validation
const isValidStellarAddress = (address) => {
  // Stellar addresses are 56 characters long and start with G, M, or T
  const stellarAddressRegex = /^[G-M][A-Z2-7]{55}$/;
  return stellarAddressRegex.test(address);
};

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Wallet address validation rules
const validateWalletAddress = [
  body('walletAddress')
    .trim()
    .notEmpty()
    .withMessage('Wallet address is required')
    .custom((value) => {
      if (!isValidStellarAddress(value)) {
        throw new Error('Invalid Stellar wallet address format');
      }
      return true;
    }),
  handleValidationErrors
];

// Wallet address parameter validation
const validateWalletAddressParam = [
  param('walletAddress')
    .trim()
    .notEmpty()
    .withMessage('Wallet address is required')
    .custom((value) => {
      if (!isValidStellarAddress(value)) {
        throw new Error('Invalid Stellar wallet address format');
      }
      return true;
    }),
  handleValidationErrors
];

// Authentication validation
const validateAuthRequest = [
  body('walletAddress')
    .trim()
    .notEmpty()
    .withMessage('Wallet address is required')
    .custom((value) => {
      if (!isValidStellarAddress(value)) {
        throw new Error('Invalid Stellar wallet address format');
      }
      return true;
    }),
  body('signature')
    .optional()
    .isString()
    .withMessage('Signature must be a string'),
  handleValidationErrors
];

// Token validation
const validateTokenRequest = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Token is required')
    .isJWT()
    .withMessage('Invalid token format'),
  handleValidationErrors
];

module.exports = {
  isValidStellarAddress,
  handleValidationErrors,
  validateWalletAddress,
  validateWalletAddressParam,
  validateAuthRequest,
  validateTokenRequest
}; 