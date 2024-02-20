const {
  fetchTopics,
  fetchEndPointData,
  fetchArticles,
  fetchArticleById,
} = require("../app.model/app.model");

exports.getTopicsRequest = (request, response, next) => {
  return fetchTopics()
    .then((topics) => {
      return response.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getEndpointsRequest = (request, response, next) => {
  return fetchEndPointData()
    .then((dataFromFile) => {
      return response.status(200).send(dataFromFile);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticleByIdRequest = (request, response, next) => {
  return fetchArticleById(request.params.article_id)
    .then((articleData) => {
      const articleById = articleData.rows;
      return response.status(200).send({article: articleById[0]});
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticlesRequest = (request, response, next) => {
  fetchArticles().then((articleReceived) => {
    const articles = articleReceived.rows
    return response.status(200).send({ articles });
  })
}
