const express = require("express");
const {
  getTopicsRequest,
  getEndpointsRequest,
  getArticleByIdRequest,
  getArticlesRequest,
  getCommentsByArticleId,
  PostCommentRequest,
  patchArticle,
  removeCommentRequest,
} = require("./app.controller/app.controller");
const {
  handle500ServerErrors,
  handle404Errors,
  handleCustomErrors,
} = require("./ErrorHandlers/ErrorHandlers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopicsRequest);
app.get("/api", getEndpointsRequest);
app.get("/api/articles/:article_id", getArticleByIdRequest);
app.get("/api/articles", getArticlesRequest);
app.get("/api/articles/:id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", PostCommentRequest);
app.patch("/api/articles/:article_id", patchArticle);
app.delete("/api/comments/:comment_id", removeCommentRequest);

app.use(handleCustomErrors);
app.use(handle404Errors);
app.use(handle500ServerErrors);

module.exports = app;
getTopicsRequest;
