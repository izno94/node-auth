function admin(req, resp, next) {
  // 401 non authorisé
  // 403 Accès interdit
  if (req.utilisateur.role !== "admin")
    return resp.status(403).send("Ressource non authorisée");

  next();
}

module.exports = admin;
