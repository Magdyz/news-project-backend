const { fetchTopics, fetchEndPointData } = require("../app.model/app.model");

exports.getTopicsRequest = (request, response, next) => {
  return fetchTopics()
    .then((topics) => {
      return response.status(200).send({ topics });
    })
    .then((error) => {
      next(error);
    });
};

exports.getEndpointsRequest = (request, response, next) => {
  return fetchEndPointData()
    .then((dataFromFile) => {
      return response.status(200).send(dataFromFile);
    })
    .then((error) => {
      next(error);
    });
};
