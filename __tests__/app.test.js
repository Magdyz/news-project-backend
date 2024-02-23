const seedDataBase = require("../db/seeds/seed");
const dataCollectedFromDataBase = require("../db/data/test-data/index");
const app = require("../app");
const request = require("supertest");
const dataBaseConnection = require("../db/connection");
const apiEndPointInfoFromFile = require("../endpoints.json");

beforeAll(() => seedDataBase(dataCollectedFromDataBase));

afterAll(() => dataBaseConnection.end());

describe("GET /api/topics", () => {
  it("Status 200 - Returns topics when a successful request is made ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics).toHaveLength(3);
        expect(typeof topics).toBe("object");
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api", () => {
  it("Status 200 - should return An object describing all the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(apiEndPointInfoFromFile);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("Status 200 - Should return an article by its id.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((articleData) => {
        const receivedData = articleData.body;
        const expectedArticle = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "11",
        };
        expect(receivedData.article).toMatchObject(expectedArticle);
      });
  });
  it("Status 404 - Should return a status of 404 and appropriate message if no article is found with that ID.", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
  it("Status 400 - Should return a status 400 and appropriate message if wrong id type is inputted", () => {
    return request(app)
      .get("/api/articles/article")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  it("Status 200 - Returns articles when a successful request is made ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  it("Should return a sorted list of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("Status 200 - Should get all comments for an article.", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((response) => {
        const commentsReceived = response.body;
        commentsReceived.comments.forEach((comment) => {
          expect(comment.article_id).toBe(5);
        });
      });
  });
  it("Should return a sorted list of comments with the newest first", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("Status 404 - Should return a status of 404 and appropriate message if no comments are found with that ID.", () => {
    return request(app)
      .get("/api/articles/5555/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
  it("Status 400 - Should return a status 400 and appropriate message if wrong article id type is inputted", () => {
    return request(app)
      .get("/api/articles/string/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("Status 201 - should add a comment for an article.", () => {
    const postBody = {
      username: "butter_bridge",
      body: "This is my first comment!",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(postBody)
      .expect(201)
      .then((postConfirmation) => {
        const post = postConfirmation.body;
        expect(post.comment[0].author).toBe(postBody.username);
        expect(post.comment[0].body).toBe(postBody.body);
        post.comment.forEach((article) => {
          expect(article).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  it("Status 400 - Should return a status 400 and appropriate message if wrong id number is inputted", () => {
    const postBody = {
      username: "butter_bridge",
      body: "This is my first comment!",
    };
    return request(app)
      .post("/api/articles/3000/comments")
      .send(postBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("Status 400 - Should return a status 400 and appropriate message if username is not in users", () => {
    const postBody = {
      username: "Mo",
      body: "This is my Second comment!",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(postBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("Status 404 - Should return a status of 404 and appropriate message if username or body doesn't exist.", () => {
    const postBody = {
      username: "",
      body: "",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(postBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing Data");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  const patchBody = { inc_votes: 1 };
  it("Status 200 - update an article by article_id.", () => {
    const expectedArticle = {
      article_id: 4,
      title: "Student SUES Mitch!",
      topic: "mitch",
      author: "rogersop",
      body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
      created_at: "2020-05-06T01:14:00.000Z",
      votes: 1,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .patch("/api/articles/4")
      .send(patchBody)
      .expect(200)
      .then((patched) => {
        const patchedArticle = patched.body.article;
        expect(patchedArticle.votes).toBe(expectedArticle.votes);
        expect(patchedArticle).toMatchObject(expectedArticle);
      });
  });
  it("Status 400 - missing request body", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("Status 400 - send wrong inc_votes type", () => {
    const patchBody = { inc_votes: "testing" };
    return request(app)
      .patch("/api/articles/4")
      .send(patchBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("Status 400 - invalid article ID", () => {
    return request(app)
      .patch("/api/articles/invalid_id")
      .send(patchBody)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  it("Status 404 - article not found", () => {
    return request(app)
      .patch("/api/articles/999")
      .send(patchBody)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid  Article ID");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("Status 204 - deletes a comment by id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  it("Status 404 - returns 404 if comment isn't found", () => {
    return request(app)
      .delete("/api/comments/55555")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });

  it("Status 400 - invalid comment ID", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  it("Status 200 - Returns users when a successful request is made ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users).toHaveLength(4);
        expect(typeof users).toBe("object");
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  it("Status 200 - returns articles with matching topic from db", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.articles).toBe("object");
        expect(body.articles.length).toEqual(12);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  it("Status 200 - returns all articles when no topic is in query", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  it("Status 404 - returns 404 if topic isn't found", () => {
    return request(app)
      .get("/api/articles?topic=testing")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Topic Not Found");
      });
  });
  it("Status 400 - returns 400 and appropriate message if topic exists but has no content", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("No Content");
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  it("Status 200 - Returns articles sorted by column name", () => {
    return request(app)
      .get("/api/articles?sorted_by=title")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("title");
      });
  });
  it("Status 200 - Returns articles sorted by column name and order", () => {
    return request(app)
      .get("/api/articles?sorted_by=author&order=desc")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("author", { descending: true });
      });
  });
  it("Status 404 - Returns an error message if sorted_by value doesn't exist", () => {
    return request(app)
      .get("/api/articles?sorted_by=testing")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});
