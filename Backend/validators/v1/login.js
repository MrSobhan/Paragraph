const Validator = require('fastest-validator');

const v = new Validator();

const schema = {
  password: { type: 'string', min: 4, max: 36 },
  email: { type: 'string' },
  $$strict: true,
};

const check = v.compile(schema);

module.exports = check;