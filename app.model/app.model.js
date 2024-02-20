const { rejects } = require("assert");
const dataBaseConnection = require("../db/connection");
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

exports.getArticleById = (id) => {
  return dataBaseConnection
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then((articleData) => {
      if (articleData.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }  
      return articleData;
    })
};
