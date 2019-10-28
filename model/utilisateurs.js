const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const schemaUtilisateur = new mongoose.Schema({
  login: String,
  mdp: String,
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'traducteur', 'redacteur']
  }
});

schemaUtilisateur.methods.generateAuthenToken = function() /*#2*/
{
  const payload = {
    _id: this._id,
    role: this.role
  };
  const token = jwt.sign(payload, 'secret');
  return token;
};

const Utilisateur = mongoose.model('utilisateurs', schemaUtilisateur);

function validationUtilisateur(profil) {
  const schemaUtilisateurJoi = {
    login: Joi.string()
      .email()
      .required(),
    mdp: Joi.string().required() //,
    //role: Joi.string().required()
  };
  const schema = Joi.object(schemaUtilisateurJoi);
  return schema.validateAsync(profil);
}

module.exports.validation = validationUtilisateur;
module.exports.Utilisateur = Utilisateur;
