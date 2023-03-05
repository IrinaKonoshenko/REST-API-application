const express = require("express");

const {
  list,
  findById,
  create,
  remove,
  update,
} = require("../../controllers/contacts");
const { favorite } = require("../../controllers/favorite");

const router = express.Router();

router.get("/", list);

router.get("/:contactId", findById);

router.post("/", create);

router.delete("/:contactId", remove);

router.put("/:contactId", update);

router.patch("/:contactId/favorite", favorite);

module.exports = router;
