const express = require("express");
const authrouter = express.Router();
const Signin = require('../model/signin-schema');
const schema = require('../model/validate');
const joi = require('joi');
require("dotenv").config();
var bcrypt = require("bcryptjs");
const Signinschema = require('../model/signin');


authrouter.post("/register", async (req, res) => {
  //validating the data
  const { error } = schema.validate(req.body);
  if (error) return res.send(error.details[0].message);

  //checking the user
  const emailexist = await Signin.findOne({ email: req.body.email });
  if (emailexist) return res.status(400).send("email alread exist");

  //password
  var salt = await bcrypt.genSalt(10);
  var hashPassword = await bcrypt.hash(req.body.password, salt);

  // creating a new user
  const user = new Signin({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
  });
  try {
    const saveduser = await user.save();
    res.send(saveduser);
  } catch (err) {
    res.status(400).send(err);
  }
});

//login
authrouter.post("/signin", async (req, res) => {
  //validating the data
  const { error } = Signinschema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //checking the user email
  const user = await Signin.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email not exist");
  //checking the password
  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).send("invalid password");

  res.send('sign in')

});

module.exports = authrouter;