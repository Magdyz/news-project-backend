const express = require("express");
const {
  getTopicsRequest,
  getEndpointsRequest,
  getArticleByIdRequest,
} = require("./app.controller/app.controller");
const {
  handle500ServerErrors,
  handle404Errors,
  handleCustomErrors,
} = require("./ErrorHandlers/ErrorHandlers");
const app = express();

app.get("/api/topics", getTopicsRequest);
app.get("/api", getEndpointsRequest);
app.get("/api/articles/:article_id", getArticleByIdRequest);

app.use(handleCustomErrors);
app.use(handle404Errors);
app.use(handle500ServerErrors);

module.exports = app;
getTopicsRequest;
