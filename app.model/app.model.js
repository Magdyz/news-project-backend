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
exports.fetchArticleById = (id) => {
  return dataBaseConnection
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then((articleData) => {
      if (articleData.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return articleData;
    });
};
exports.fetchArticles = () => {
  return dataBaseConnection
    .query(
      "SELECT articles.author,articles.title,articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url , COUNT(comments.article_id)::integer AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at ASC;"
    )
    .then((articles) => {
      return articles;
    });
};
exports.fetchCommentsByArticleId = (articleId) => {
  return dataBaseConnection
    .query(
      "SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC;",
      [articleId]
    )
    .then((comments) => {
      if (comments.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return comments.rows;
    });
};
