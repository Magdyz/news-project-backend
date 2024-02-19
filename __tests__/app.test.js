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
        const topics = body;
        expect(topics).toHaveLength(3);
        expect(topics.slug).toBe();
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
      .then((response) => {}); /////
  });
});
