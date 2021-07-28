require("dotenv").config({ path: "./config/.env" });

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;
    console.log("token  ", token);
    console.log("userId  ", userId);
    console.log("req.body  ", req.body);
    console.log("req.query.userId  ", req.query.userId);
    console.log("req.body.userId  ", req.body.userId);
    let A = "";
    if (!req.body.userId) {
      A = Number(req.query.userId);
    } else {
      A = Number(req.body.userId);
    }
    console.log("A  ", A);
    //if (req.body.userId && A !== userId)  {
    if (A !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).send({
      message: "Requete invalide utilisateur ne peut effectuer cette action",
    });
  }
};
