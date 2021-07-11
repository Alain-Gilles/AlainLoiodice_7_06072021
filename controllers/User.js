const db = require("../models");
const User = db.users;
const Message = db.messages;
//
// Pour gérer les variables d'environnement on a besoin d'importer le package dotenv
//
require("dotenv").config({ path: "./config/.env" });
//
// importation du package de cryptage pour les mots de passe
//
const bcrypt = require("bcrypt");
//
// importation du package qui va permettre de créer des token et de les vérifier
//
const jwt = require("jsonwebtoken");
//
// Nous allons utiliser l'algorithmes de chiffrement AES (Advanced Encryption System).
//
const CryptoJS = require("crypto-js");
//
// Utilisation du package email-validator pour controler la validité de l'email transmis par le frontend
//
var validator = require("email-validator");
//
// Test validation du mot de passe
// Importation du package password-validator
// Package qui permet de tester la validation d'un mot de passe selon un certain nombre
// de règles paramétrables
//
var passwordValidator = require("password-validator");
//
// Create and Save a new User
//
exports.signup = async (req, res, next) => {
  //
  // Validate request
  //
  //
  // username obligatoire
  //
  if (!req.body.username) {
    res.status(400).send({
      message: "Username est obligatoire can not be empty!",
    });
    return;
  }
  //
  // speudo obligatoire
  //
  if (!req.body.speudo) {
    res.status(400).send({
      message: "speudo est obligatoire can not be empty!",
    });
    return;
  }
  //
  // Le speudo doit-être unique
  //
  let user2 = await User.findOne({
    where: { speudo: req.body.speudo },
  });
  if (user2) {
    res.status(400).send({
      message: "Le speudo doit être unique",
    });
    return;
  }
  //
  // password est obligatoire
  //
  if (!req.body.password) {
    res.status(400).send({
      message: "password est obligatoire can not be empty!",
    });
    return;
  }
  //
  // password doit correspondre à un schéma
  //
  var schema = new passwordValidator();

  // Add properties to it
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(2) // Must have at least 2 digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123"]); // Blacklist these values
  //
  console.log("req.body.password", req.body.password);
  console.log(schema.validate(req.body.password));
  if (!schema.validate(req.body.password)) {
    res.status(400).send({
      message:
        "le password n est pas valide au moins longeur 8, doit contenir des Majuscules, des minuscules et au moins deux chiffres, il ne doit pas y avoir espaces",
    });
    return;
  }
  //
  // email obligatoire
  //
  if (!req.body.email) {
    res.status(400).send({
      message: "email est obligatoire can not be empty!",
    });
    return;
  }
  //
  // l'email doit-être valide
  //
  if (!validator.validate(req.body.email)) {
    res.status(400).send({
      message: "email n'est pas valide",
    });
    return;
  }
  //
  // Hash du mot de passe et Cryptage de l'adresse email
  //
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      //
      // encryptage de l'email
      //

      key = process.env.KEY;
      iv = process.env.IV;

      console.log("key", key);
      console.log("iv", iv);

      var ciphertext = CryptoJS.AES.encrypt(
        req.body.email,
        CryptoJS.enc.Base64.parse(key),
        { iv: CryptoJS.enc.Base64.parse(iv) }
      ).toString();
      console.log("signup ciphertext  :", ciphertext);
      //
      // const user = new User({
      //   email: req.body.email,
      //   password: hash,
      // });

      let emailcrypt = ciphertext;
      let passwordcrypt = hash;

      console.log("emailcrypt", emailcrypt);
      console.log("passwordcrypt", passwordcrypt);

      //
    })
    .catch((error) => res.status(500).json({ error }));
  //
  // On verifie que l'email cryptée est bien unique dans la base de données
  //
  user2 = await User.findOne({
    where: { email: emailcrypt },
  });
  if (user2) {
    res.status(400).send({
      message:
        "Email doit-être unique , un autre utilisateur a déja entré cet email",
    });
    return;
  }

  // Create a User
  const user = {
    username: req.body.username,
    speudo: req.body.speudo,
    isAdmin: 0,
    password: req.body.password,
    avatar: req.body.avatar,
    email: req.body.email,
  };

  // Save Post in the database
  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};
