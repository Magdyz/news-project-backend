const { fetchTopics } = require("../app.model/app.model");

exports.getTopicsRequest = (request, response, next) => {
  return fetchTopics()
      .then((topics) => {
        console.log(typeof topics)
      return response.status(200).send(topics);
    })
    .then((error) => {
      next(error);
    });
};
