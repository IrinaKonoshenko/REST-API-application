const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const { randomUUID } = require("crypto");

const Joi = require("joi");
const Users = require("../models/users");
const SECRET_KEY = require("../config/passport");
const path = require("path");
const { storeImage } = require("../config/multer");
const Jimp = require("jimp");

const usersValidateSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ru"] },
    })
    .required(),
  password: Joi.string().min(6).required(),
});

async function signup(req, res, next) {
  const body = req.body;
  const errors = usersValidateSchema.validate(body);
  if (errors.error && errors.error.details.length > 0) {
    return res.status(400).json({ message: errors.error.details[0].message });
  }

  const user = await Users.findOne({ email: body.email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  const newUser = await Users.create(body);
  return res.status(201).json({ data: newUser });
}

async function login(req, res, next) {
  const body = req.body;
  const errors = usersValidateSchema.validate(body);
  if (errors.error && errors.error.details.length > 0) {
    return res.status(400).json({ message: errors.error.details[0].message });
  }

  const user = await Users.findOne({ email: body.email });
  const isPasswordValid = user.isValidPassword(body.password);

  if (!user || !isPasswordValid) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

  const authUser = await Users.findByIdAndUpdate({ _id: user._id }, { token });

  return res.status(200).json({
    token,
    user: {
      email: authUser.email,
      subscription: authUser.subscription,
    },
  });
}

const logout = async (req, res, next) => {
  const id = req.user._id;
  await Users.findByIdAndUpdate(id, { token: null });
  return res.status(204).json({ message: "No Content" });
};

const current = async (req, res, next) => {
  const token = req.get("Authorization")?.split(" ")[1];
  const user = await Users.findOne({ token });

  return res.status(200).json({
    email: user.email,
    subscription: user.subscription,
    avatarURL: user.avatarURL,
  });
};

const avatars = async (req, res, next) => {
  const { path: temporaryName, originalname } = req.file;

  const extension = originalname.split(".").pop();
  const fileName = randomUUID() + "." + extension;
  const avatarURL = "/avatars/" + fileName;
  const filePath = path.join(storeImage, fileName);

  try {
    const file = await Jimp.read(temporaryName);
    await file.resize(250, 250).writeAsync(temporaryName);
    await fs.rename(temporaryName, filePath);
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }

  const token = req.get("Authorization")?.split(" ")[1];
  const user = await Users.findOne({ token });

  await Users.findByIdAndUpdate(user._id, { avatarURL });

  return res.status(200).json({ avatarURL });
};

module.exports = {
  signup,
  login,
  logout,
  current,
  avatars,
};
