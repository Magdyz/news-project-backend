const {
  fetchTopics,
  fetchEndPointData,
  getArticleById,
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
  return getArticleById(request.params.article_id)
    .then((articleData) => {
      const articleById = articleData.rows;
      return response.status(200).send(articleById[0]);
    })
    .catch((error) => {
      console.log(error)
      next(error);
    });
};
