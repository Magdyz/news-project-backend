const dataBaseConnection = require("../db/connection");

exports.fetchTopics = () => {
  return dataBaseConnection.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};
