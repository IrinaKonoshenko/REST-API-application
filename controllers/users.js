const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const { randomUUID } = require("crypto");

const Joi = require("joi");
const Users = require("../models/users");
const SECRET_KEY = require("../config/passport");
const path = require("path");
const { storeImage } = require("../config/multer");
const Jimp = require("jimp");

const sgMail = require("@sendgrid/mail");
const { v4: uuidv4 } = require("uuid");

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

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

  const verificationToken = uuidv4();
  const newUser = await Users.create({
    ...body,
    verificationToken,
  });

  sgMail.send({
    to: body.email,
    from: "support@irinakonoshenko.github.io",
    subject: "Veretification your account",
    text: "complete veretify",
    html: `<a href="/api/users/verify/${verificationToken}">Veretify</a>`,
  });

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

  if (!user.verify) {
    return res.status(401).json({ message: "Veritify your email" });
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

const verification = async (req, res, next) => {
  const verificationToken = req.params.verificationToken;

  const user = await Users.findOneAndUpdate(
    { verificationToken },
    {
      verificationToken: null,
      verify: true,
    }
  );

  if (user) {
    return res.status(200).json({ message: "Verification successful" });
  }

  return res.status(404).json({ message: "User not found" });
};

const resendEmail = async (req, res, next) => {
  const body = req.body;

  if (!body.email) {
    return res.status(400).json({ message: "missing required field email" });
  }

  const user = Users.findOne({ email });
  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }

  sgMail.send({
    to: user.email,
    from: "support@irinakonoshenko.github.io",
    subject: "Veretification your account",
    text: "complete veretify",
    html: `<a href="/api/users/verify/${user.verificationToken}">Veretify</a>`,
  });

  return res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  signup,
  login,
  logout,
  current,
  avatars,
  verification,
  resendEmail,
};
