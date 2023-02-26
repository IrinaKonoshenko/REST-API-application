const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
  contactValidateSchema,
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
  const errors = contactValidateSchema.validate(body);
  if (errors.error && errors.error.details.length > 0) {
    return res.status(400).json({ message: errors.error.details[0].message });
  }

  const contact = await addContact(body);
  res.status(201).json({ data: contact });
});

router.delete("/:contactId", async (req, res, next) => {
  const contact = await removeContact(req.params.contactId);
  console.log(contact);
  if (contact) {
    res.json({ message: "contact deleted" });
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const errors = contactValidateSchema.validate(req.body);
  if (errors.error && errors.error.details.length > 0) {
    return res.status(400).json({ message: errors.error.details[0].message });
  }

  const contact = await updateContact(req.params.contactId, req.body);
  if (contact) {
    res.json({ data: contact });
  } else {
    res.status(404).json({ message: "missing fields" });
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  if (!req.body.hasOwnProperty("favorite"))
    return res.status(400).json({ message: "missing field favorite" });

  const contact = await updateStatusContact(req.params.contactId, req.body);
  if (contact) {
    res.json({ data: contact });
  } else {
    res.status(404).json({ message: "missing contactId" });
  }
});

module.exports = router;
