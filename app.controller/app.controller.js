const {
  fetchTopics,
  fetchEndPointData,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  addCommentToDB,
  addVoteToArticle,
  deleteCommentById,
  fetchUsers,
  addVoteToComment,
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
      return response.status(200).send({ article: articleById[0] });
    })
    .catch((error) => {
      next(error);
    });
};
exports.getArticlesRequest = (request, response, next) => {
  fetchArticles(
    request.query.topic,
    request.query.sorted_by,
    request.query.order
  )
    .then((articleReceived) => {
      const articles = articleReceived;
      return response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};
exports.getCommentsByArticleId = (request, response, next) => {
  fetchCommentsByArticleId(request.params.id)
    .then((commentsReceived) => {
      return response.status(200).send({ comments: commentsReceived });
    })
    .catch((error) => {
      next(error);
    });
};
exports.PostCommentRequest = (request, response, next) => {
  const username = request.body.username;
  const body = request.body.body;
  addCommentToDB(username, body, request.params.article_id)
    .then((confirmationData) => {
      return response.status(201).send({ comment: confirmationData });
    })
    .catch((error) => {
      next(error);
    });
};
exports.patchArticle = (request, response, next) => {
  const inc_votes = request.body.inc_votes;
  const articleId = request.params.article_id;
  addVoteToArticle(inc_votes, articleId)
    .then((patchedArticle) => {
      response.status(200).send({ article: patchedArticle });
    })
    .catch((error) => {
      next(error);
    });
};
exports.removeCommentRequest = (request, response, next) => {
  deleteCommentById(request.params.comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
exports.getUsersRequest = (request, response, next) => {
  return fetchUsers(request.params.username)
    .then((users) => {
      return response.status(200).send({ users });
    })
    .catch((error) => {
      next(error);
    });
};
exports.patchCommentById = (request, response, next) => {
  const inc_votes = request.body.inc_votes;
  const commentId = request.params.comment_id;
  addVoteToComment(inc_votes, commentId)
    .then((comment) => {
      response.status(200).send({ comment: comment });
    })
    .catch((error) => {
      next(error);
    });
};

