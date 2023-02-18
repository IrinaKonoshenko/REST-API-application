const fs = require("fs/promises");
const path = require("path");
const Generator = require("id-generator");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const contacts = JSON.parse(data);
  return contacts.find((contact) => contact.id === contactId);
};

const addContact = async (body) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const contacts = JSON.parse(data);
  const contact = {
    id: new Generator().newId(),
    ...body,
  };
  contacts.push(contact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts), "utf8");
  return contact;
};

const removeContact = async (contactId) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
