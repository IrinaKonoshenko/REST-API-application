const mongoose = require("mongoose");
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

const contactsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contacts = mongoose.model("contacts", contactsSchema);

const listContacts = async () => {
  return Contacts.find({});
};

const getContactById = async (contactId) => {
  return Contacts.findById(contactId);
};

const addContact = async (body) => {
  return Contacts.create(body);
};

const removeContact = async (contactId) => {
  return Contacts.findByIdAndDelete(contactId);
};

const updateContact = async (contactId, body) => {
  return Contacts.findByIdAndUpdate(contactId, body);
};

const updateStatusContact = async (contactId, body) => {
  return Contacts.findByIdAndUpdate(contactId, body);
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
  contactValidateSchema,
};
