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
      .get("/api/articles/4")
      .expect(200)
      .then((articleData) => {
        const receivedData = articleData.body;
        const expectedArticle = {
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
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
  it("Status 400 - Should return a status 400 and appropriate message if wrong id type is inputted", () => {
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
  it("Status 400 - Should return a status of 400 and appropriate message if username doesn't exist.", () => {
    const postBody = {
      username: "Mo",
      body: "This is my first comment!",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(postBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
