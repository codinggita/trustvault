const { randomInt } = require('crypto');

const generateAccountNumber = () => {
  let output = '';

  for (let index = 0; index < 12; index += 1) {
    output += randomInt(0, 10).toString();
  }

  if (output.startsWith('0')) {
    output = `${randomInt(1, 10)}${output.slice(1)}`;
  }

  return output;
};

module.exports = generateAccountNumber;

