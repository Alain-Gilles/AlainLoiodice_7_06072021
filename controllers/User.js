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
  console.log("req.body", req.body);
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
  // pseudo obligatoire
  //
  if (!req.body.pseudo) {
    res.status(400).send({
      message: "pseudo est obligatoire can not be empty!",
    });
    return;
  }
  //
  // Le pseudo doit-être unique
  //
  let user2 = await User.findOne({
    where: { pseudo: req.body.pseudo },
  });
  console.log("user2", user2);
  if (user2) {
    res.status(400).send({
      message: "Le pseudo doit être unique",
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
    .then(async (hash) => {
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

      let emailcrypt = ciphertext;
      let passwordcrypt = hash;

      console.log("emailcrypt", emailcrypt);
      console.log("passwordcrypt", passwordcrypt);
      //
      // Définition d'un fonction asynchrone qui va rechercher si l'email encrypté existe deja dans la base
      // Si c'est le cas erreur car in veut une adresse email unique
      //
      // L'appel de findOne doit se faire avec await c'est pourquoi la fonction d'appel doit etre async
      //
      let user3 = await User.findOne({
        where: { email: emailcrypt },
      });

      if (user3) {
        res.status(400).send({
          message:
            "Email doit-être unique , un autre utilisateur a déja entré cet email",
        });
        return;
      }
      //
      // appel de la fonction de controle unicité du email dans la BD
      // On verifie que l'email cryptée est bien unique dans la base de données
      //
      //
      // L'email est unique on poursuit
      //
      //
      // Create a User
      //
      const user = {
        username: req.body.username,
        pseudo: req.body.pseudo,
        isAdmin: 0,
        password: passwordcrypt,
        avatar: req.body.avatar,
        email: emailcrypt,
      };

      // Save Post in the database
      User.create(user)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = async (req, res, next) => {
  //
  // l'utilisateur peut se connecter avec pseudo + password ou  email + password
  //
  let MotDePasse = "";
  let User_Id = 0;
  let User_Is_Admin = false;
  let User_Pseudo = "";
  //
  // si pseudo est renseigné il doit exister
  //
  if (req.body.pseudo) {
    let user1 = await User.findOne({
      where: { pseudo: req.body.pseudo },
    });
    if (!user1) {
      res.status(400).send({
        message: "Le pseudo s'il est renseigné doit exister",
      });
      return;
    }
    MotDePasse = user1.password;
    User_Id = user1.id;
    User_Is_Admin = user1.isAdmin;
    User_Pseudo = user1.pseudo;
  }
  //
  // il faut renseigner soit le pseudo soit email
  //
  if (!req.body.pseudo && !req.body.email) {
    res.status(400).send({
      message:
        "vous devez vous connecter soit avec votre pseudo et votre mot de passe soit avec votre adresse email et votre mot de passe",
    });
    return;
  }
  //
  // Saisir soit votre pseudo soit votre adresse email
  //
  if (req.body.pseudo && req.body.email) {
    res.status(400).send({
      message: "saisir soit votre pseudo soit votre email",
    });
    return;
  }
  //
  // La saisie du mot de passe est obligatoire
  //
  if (!req.body.password) {
    res.status(400).send({
      message: "La saisie du mot de passe est obligatoire",
    });
    return;
  }
  //
  // L'utilisateur se connecte avec email + mot de passe
  //
  if (req.body.email) {
    //
    // Encodage de email passé dans req.body
    //
    key = process.env.KEY;
    iv = process.env.IV;
    var ciphertext = CryptoJS.AES.encrypt(
      req.body.email,
      CryptoJS.enc.Base64.parse(key),
      { iv: CryptoJS.enc.Base64.parse(iv) }
    ).toString();
    console.log("login ciphertext  :", ciphertext);
    //
    let emailcrypt = ciphertext;
    //
    //
    let user = await User.findOne({
      where: { email: emailcrypt },
    });

    if (!user) {
      res.status(400).send({
        message: "Email n'existe pas connexion refusée",
      });
      return;
    }
    MotDePasse = user.password;
    User_Id = user.id;
    User_Is_Admin = user.isAdmin;
    User_Pseudo = user.pseudo;
  }

  bcrypt
    .compare(req.body.password, MotDePasse)
    .then((valid) => {
      if (!valid) {
        res.status(400).send({
          message: "Connexion refusée mot de passe non reconnu",
        });
        return;
      }
      res.status(200).send({
        userId: User_Id,
        token: jwt.sign({ userId: User_Id }, process.env.SECRET_KEY, {
          expiresIn: "24h",
        }),
        userIsAdmin: User_Is_Admin,
        userPseudo: User_Pseudo,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};
////////////////
exports.getAllUser = async (req, res, next) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Message.",
      });
    });
};
////////////////
