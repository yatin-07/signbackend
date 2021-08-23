const Joi = require("joi");

const Signinschema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

//export default loginschema;
module.exports = Signinschema;