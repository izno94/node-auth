const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const articleSchema = new mongoose.Schema({
  title: String,
  contenu: String
});

const Article = mongoose.model("articles", articleSchema);

function validationArticle(article) {
  const schemaArticleJoi = {
    title: Joi.string()
      .min(3)
      .required(),
    contenu: Joi.string()
      .min(3)
      .required()
  };
  const schema = Joi.object(schemaArticleJoi);
  return schema.validateAsync(article);
  //dans la version 15

  //   const schema = {    title: Joi.string()
  //     .min(3)
  //     .required(),
  //   contenu: Joi.string()
  //     .min(3)
  //     .required()
  // };
  // return Joi.validate(article, schema)
}

module.exports.Article = Article;
module.exports.validationArticle = validationArticle;
