const { fetchTopics } = require("../app.model/app.model");

exports.getTopicsRequest = (request, response, next) => {
  return fetchTopics()
    .then((topics) => {
      return res.status(200).send(topics);
    })
    .then((error) => {
      next(error);
    });
};
