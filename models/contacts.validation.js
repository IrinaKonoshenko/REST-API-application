const Joi = require("joi");

const contactValidateSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ru"] },
    })
    .required(),
  phone: Joi.number().required(),
  favorite: Joi.boolean(),
});

module.exports = contactValidateSchema;
