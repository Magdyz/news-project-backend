const dataBaseConnection = require("../db/connection");
const apiEndPointInfoFromFile = require("../endpoints.json");
const fs = require("fs/promises");
exports.fetchTopics = () => {
  return dataBaseConnection.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.fetchEndPointData = () => {
  return fs.readFile("endpoints.json", "utf8").then((data) => {
    return JSON.parse(data);
  });
};
