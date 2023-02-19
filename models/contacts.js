const fs = require("fs/promises");
const path = require("path");
const Generator = require("id-generator");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ru"] },
    })
    .required(),
  phone: Joi.number().required(),
});

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

const removeContact = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf8");
  const contacts = JSON.parse(data).filter(
    (contact) => contact.id !== contactId
  );
  await fs.writeFile(contactsPath, JSON.stringify(contacts), "utf8");
  return true;
};

const updateContact = async (contactId, body) => {
  const data = await fs.readFile(contactsPath, "utf8");
  let updatedContact = {};
  const contacts = JSON.parse(data).map((contact) => {
    if (contactId === contact.id) {
      updatedContact = {
        ...contact,
        ...body,
      };
      return updatedContact;
    }
    return contact;
  });
  await fs.writeFile(contactsPath, JSON.stringify(contacts), "utf8");
  return updatedContact;
};

module.exports = {
  schema,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
