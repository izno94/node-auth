// ici c'est ce fichier qui est appelé lorsque l'on est devant une
// page de où on demande un login / mot de passe

// vérifier que les information sont conformes
// si ce n'est pas conforme => retour "ce n'est pas conforme"
// si conforme => jwt

const express = require('express');

const router = express.Router();
const { Utilisateur } = require('../model/utilisateurs');
const bcrypt = require('bcrypt');
//Postman
//http://localhost:5000/api/connexion
// Post
// {"login":"mail@gg.com", "mdp":"azerty"}
// credentials
router.post('/', (req, resp) => {
  //req.body.login; // contient
  // 1 login qui a été envoyé est conforme => existe dans Mongo

  Utilisateur.find({ login: req.body.login }).then(result => {
    if (result.length === 0)
      return resp.status(400).send('login ou mot de passe');
    // 2 mdp qui a été envoyé est conforme
    bcrypt.compare(req.body.mdp, result[0].mdp).then(validPassword => {
      if (!validPassword) return resp.status(400).send('login ou mot de passe');

      // 3 envoyer jwt (Json Web Token)
      const token = result[0].generateAuthenToken();
      resp.header('x-auth', token).send({ token: token });
    });
  });
});

module.exports = router;
