const express = require("express");
const { getTopicsRequest, getEndpointsRequest } = require("./app.controller/app.controller");
const { handle500ServerErrors } = require("./ErrorHandlers/ErrorHandlers");
const app = express();

app.get("/api/topics", getTopicsRequest);
app.get("/api", getEndpointsRequest);


app.use(handle500ServerErrors);

module.exports = app;
getTopicsRequest