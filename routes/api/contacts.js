const express = require("express");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  schema,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json({ data: contacts });
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  contact
    ? res.json({ data: contact })
    : res.status(404).json({ message: "Not found" });
});

router.post("/", async (req, res, next) => {
  const body = req.body;
  const errors = schema.validate(body);
  if (errors.error && errors.error.details.length > 0) {
    return res.status(400).json({ message: errors.error.details[0].message });
  }

  const contact = await addContact(body);
  res.status(201).json({ data: contact });
});

router.delete("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  if (contact) {
    await removeContact(contact.id);
    res.json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const errors = schema.validate(req.body);
  if (errors.error && errors.error.details.length > 0) {
    return res.status(400).json({ message: errors.error.details[0].message });
  }

  const contact = await getContactById(req.params.contactId);
  if (contact) {
    const updatedContact = await updateContact(contact.id, req.body);
    res.json({ data: updatedContact });
  } else {
    res.status(404).json({ message: "missing fields" });
  }
});

module.exports = router;
