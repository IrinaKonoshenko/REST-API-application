const Contacts = require("../models/contacts");
const contactValidateSchema = require("../models/contacts.validation");

async function update(req, res, next) {
  const errors = contactValidateSchema.validate(req.body);
  if (errors.error && errors.error.details.length > 0) {
    return res.status(400).json({ message: errors.error.details[0].message });
  }

  const contact = await Contacts.findByIdAndUpdate(
    req.params.contactId,
    req.body
  );
  if (contact) {
    res.json({ data: contact });
  } else {
    res.status(404).json({ message: "missing fields" });
  }
}

async function remove(req, res, next) {
  const contact = await Contacts.findByIdAndDelete(req.params.contactId);
  if (contact) {
    res.json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
}

async function create(req, res, next) {
  const body = req.body;
  const errors = contactValidateSchema.validate(body);
  if (errors.error && errors.error.details.length > 0) {
    return res.status(400).json({ message: errors.error.details[0].message });
  }

  const contact = await Contacts.create(body);
  res.status(201).json({ data: contact });
}

async function findById(req, res, next) {
  const contact = await Contacts.findById(req.params.contactId);
  contact
    ? res.json({ data: contact })
    : res.status(404).json({ message: "Not found" });
}

async function list(req, res, next) {
  const contacts = await Contacts.find({});
  res.json({ data: contacts });
}

module.exports = {
  update,
  remove,
  create,
  findById,
  list,
};
