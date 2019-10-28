const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Article, validationArticle } = require("../model/articles");
const auth = require("../middleware/autorisation");
const admin = require("../middleware/isAdmin");

router.get("/", async (req, resp) => {
  const result = await Article.find();
  resp.send(result);
});

router.get("/:id", (req, resp) => {
  const id = req.params.id;

  //postman => céer un nouvel article
  //http://localhost:5000/api/articles
  //POST
  //body
  //{"title" : "article1", "contenu" : "un peu de contenu"}

  // Verifie que l'id est correcte et renvoie un message d'erreur.
  const verifId = mongoose.Types.ObjectId.isValid(id);

  if (!verifId) {
    return resp.status(400).send(`${id} invalid`);
  }

  Article.findById(id)
    .then(result => {
      if (!result) return resp.status(404).send([]);
      return resp.send(result);
    })
    .catch(error => {
      resp.status(404).send(error.details[0].message);
    });
});

router.post("/", [auth, admin], (req, resp) => {
  validationArticle(req.body)
    .then(() => {
      const newArticle = new Article({
        title: req.body.title,
        contenu: req.body.contenu
      });
      newArticle.save().then(result => {
        resp.send(result);
      });
    })
    .catch(error => {
      resp.status(400).send(error.details[0].message);
    });
});

router.put("/:id", (req, resp) => {
  const id = req.params.id;
  const verifId = mongoose.Types.ObjectId.isValid(id);

  if (!verifId) {
    return resp.status(400).send(`${id} invalid`);
  }

  validationArticle(req.body)
    .then(() => {
      Article.findById(id).then(article => {
        if (!article) return resp.status(404).send([]);
        article.title = req.body.title;
        article.contenu = req.body.contenu;
        article.save().then(result => {
          resp.send(result);
        });
      });
    })
    .catch(error => {
      resp.status(400).send(error.details[0].message);
    });
});

router.delete("/:id", (req, resp) => {
  const id = req.params.id;
  const verifId = mongoose.Types.ObjectId.isValid(id);

  if (!verifId) {
    return resp.status(400).send(`${id} invalid`);
  }

  Article.findByIdAndRemove(id)
    .then(result => {
      if (!result) return resp.status(404).send({});
      return resp.send({});
    })
    .catch(error => {
      resp.status(404).send("aucun article avec id" + error);
    });
});

module.exports = router;
