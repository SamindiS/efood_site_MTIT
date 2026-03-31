// const crypto = require('crypto');

// function generatePayHereHash(merchant_id, order_id, amount, currency, secret_key) {
//   // PayHere expects:
//   // 1. Amount must be string with exactly 2 decimal places
//   // 2. Secret key should NOT be re-encoded (use as-is from .env)
//   // 3. All values concatenated without separators
  
//   const formattedAmount = parseFloat(amount).toFixed(2);
//   const rawString = merchant_id + order_id + formattedAmount + currency + secret_key;
  
//   return crypto.createHash('sha256')
//              .update(rawString)
//              .digest('hex')
//              .toLowerCase(); // PayHere expects lowercase
// }

// module.exports = generatePayHereHash;