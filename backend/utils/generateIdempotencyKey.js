const { randomUUID } = require('crypto');

const generateIdempotencyKey = () => randomUUID();

module.exports = generateIdempotencyKey;

