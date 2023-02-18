const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
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
  const { name, email, phone } = req.body;
  if (!name) {
    return res.status(422).json({
      message: "Name field is required",
    });
  }
  if (!email) {
    return res.status(422).json({
      message: "Email field is required",
    });
  }
  if (!phone) {
    return;
  }

  const contact = await addContact({ name, email, phone });
  res.json({ data: contact });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
