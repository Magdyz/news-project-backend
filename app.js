const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const {
  getTopicsRequest,
  getEndpointsRequest,
  getArticleByIdRequest,
  getArticlesRequest,
  getCommentsByArticleId,
  PostCommentRequest,
  patchArticle,
  removeCommentRequest,
  getUsersRequest,
  patchCommentById,
} = require("./app.controller/app.controller");
const {
  handle500ServerErrors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./ErrorHandlers/ErrorHandlers");
const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

app.get("/api", getEndpointsRequest);
app.get("/api/articles", getArticlesRequest);
app.get("/api/users", getUsersRequest);
app.get("/api/users/:username", getUsersRequest);
app.get("/api/topics", getTopicsRequest);
app.get("/api/articles/:article_id", getArticleByIdRequest);
app.get("/api/articles/:id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", PostCommentRequest);
app.patch("/api/articles/:article_id", patchArticle);
app.patch("/api/comments/:comment_id", patchCommentById);
app.delete("/api/comments/:comment_id", removeCommentRequest);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500ServerErrors);

module.exports = app;
getTopicsRequest;
