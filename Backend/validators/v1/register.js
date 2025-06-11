const Validator = require('fastest-validator');

const v = new Validator();

const schema = {
  name: { type: 'string', min: 3, max: 255 },
  email: { type: 'email' },
  bio: { type: 'string', min: 0, max: 500, optional: true },
  avatar: { type: 'url', optional: true },
  socialLinks: {
    type: 'object',
    optional: true,
    props: {
      linkedin: { type: 'url', optional: true },
      twitter: { type: 'url', optional: true },
      github: { type: 'url', optional: true },
    },
  },
  $$strict: true,
};

const check = v.compile(schema);

module.exports = check;