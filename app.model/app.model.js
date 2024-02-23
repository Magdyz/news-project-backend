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
    .query(
      `SELECT 
    articles.*,
    COUNT(comments.article_id) AS comment_count
    FROM 
    articles
    LEFT JOIN 
    comments ON articles.article_id = comments.article_id
    WHERE 
    articles.article_id = $1
    GROUP BY 
    articles.article_id;`,
      [id]
    )
    .then((articleData) => {
      if (articleData.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return articleData;
    });
};
exports.fetchArticles = (
  topicToFilter,
  sortby = "created_at",
  order = "ASC"
) => {
  const topics = ["mitch", "cats", "paper"];
  const columns = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const orderList = ["ASC", "DESC"];
  if (
    !columns.includes(sortby) ||
    !orderList.includes(order.toUpperCase() || !topics.includes(topicToFilter))
  ) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
  if (topicToFilter) {
    if (!topics.includes(topicToFilter)) {
      return Promise.reject({ status: 404, msg: "Topic Not Found" });
    }
    return dataBaseConnection
      .query(
        `SELECT articles.author,articles.title,articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url, 
        COUNT(comments.article_id)::integer AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE topic = $1
        GROUP BY articles.article_id
        ORDER BY ${sortby} ${order}`,
        [topicToFilter]
      )
      .then((articlesBytopic) => {
        if (articlesBytopic.rowCount === 0) {
          return Promise.reject({ status: 400, msg: "No Content" });
        }
        return articlesBytopic.rows;
      });
  } else {
    return dataBaseConnection
      .query(
        `SELECT articles.author,articles.title,articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url, 
        COUNT(comments.article_id)::integer AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id 
        ORDER BY ${sortby} ${order};`
      )
      .then((articles) => {
        return articles.rows;
      });
  }
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
exports.addCommentToDB = (username, body, articleId) => {
  if (!body || !username) {
    return Promise.reject({ status: 404, msg: "Missing Data" });
  }
  return dataBaseConnection
    .query(
      "INSERT INTO comments (body, votes, author, article_id) VALUES ($1, $2, $3, $4) RETURNING *;",
      [body, 0, username, articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.addVoteToArticle = (inc_votes, articleId) => {
  if (!inc_votes || typeof inc_votes !== "number" || isNaN(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return dataBaseConnection
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then((result) => {
      const articleToPatch = result.rows[0];
      if (!articleToPatch) {
        return Promise.reject({ status: 404, msg: "Invalid  Article ID" });
      }
      articleToPatch.votes += inc_votes;
      return articleToPatch;
    });
};
exports.deleteCommentById = (commentId) => {
  return dataBaseConnection
    .query("DELETE FROM comments WHERE comment_id=$1 RETURNING *", [commentId])
    .then((deleted) => {
      if (deleted.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};
exports.fetchUsers = () => {
  return dataBaseConnection.query("SELECT * FROM users").then((users) => {
    return users.rows;
  });
};
