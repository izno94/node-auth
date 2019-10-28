//middleware/autorisation.js

const jwt = require("jsonwebtoken");

function auth(req, resp, next) {
  const token = req.header("x-auth"); /*#1*/
  if (!token)
    return resp.status(401).send("Accès refusé, token non fourni"); /*#2*/
  try {
    const decoded = jwt.verify(token, "secret"); /*#3*/
    req.utilisateur = decoded; /*#5*/
    next(); /*#5*/
  } catch (err) {
    resp.status(400).send("Token fourni invalide"); /*#4*/
  }
}

module.exports = auth;
