const Contacts = require("../models/contacts");

async function favorite(req, res, next) {
  if (!req.body.hasOwnProperty("favorite"))
    return res.status(400).json({ message: "missing field favorite" });

  const contact = await Contacts.findByIdAndUpdate(
    req.params.contactId,
    req.body
  );
  if (contact) {
    res.json({ data: contact });
  } else {
    res.status(404).json({ message: "missing contactId" });
  }
}

module.exports = {
  favorite,
};
