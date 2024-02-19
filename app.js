const express = require("express");
const { getTopicsRequest } = require("./app.controller/app.controller");
const { handle500ServerErrors } = require("./ErrorHandlers/ErrorHandlers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopicsRequest);

app.use(handle500ServerErrors);

module.exports = app;
