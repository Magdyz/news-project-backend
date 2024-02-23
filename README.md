# PROJECT NC News API

![JavaScript](https://img.shields.io/badge/-JavaScript-yellow)
![Node.js](https://img.shields.io/badge/Node.js-v20.10.0-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16.1-blue)

## Link To API:
[PROJECT NC News API](https://api1.magz.dev/api)


## API Endpoints:
### Endpoints Overview:

- `GET /api`: responds with a list of available endpoints.
- `GET /api/topics`: responds with a list of topics.
- `GET /api/articles/: article_id`: responds with a single article by article_id.
- `GET /api/articles`: responds with a list of articles.
- `GET /api/articles/:article_id/comments`: responds with a list of comments by article_id.
- `POST /api/articles/:article_id/comments`: add a comment by article_id.
- `PATCH /api/articles/:article_id`: updates an article by article_id.
- `DELETE /api/comments/:comment_id`: deletes a comment by comment_id.
- `GET /api/users`: responds with a list of users.
- `GET /api/articles (queries)`: allows articles to be filtered and sorted.
- `GET /api/articles/:article_id (comment count)`: adds a comment count to the response when retrieving a single article.


## About the project

The NC News Project is a backend Node.js Express application with a PostgreSQL database, designed to provide programmatic access to application data. Modeled after real-world backend services like Reddit, the project aims to mimic their functionality, offering essential information to frontend architectures.


# Installation Instructions:

## Clone the Repository

`git clone https://github.com/Magdyz/project-nc-news.git`

## Install Dependencies:

```
cd nc-news-project
npm install
```

## Seed the Local Database:

`npm run seed`

This will seed the local PostgreSQL database with sample data. Make sure you have PostgreSQL installed and running locally. This will create an initial set of data that you can use to test out the functionality of the application. It also allows you to see how the data is structured. 

## Run Tests:

`npm run test`

This command will execute all the tests in the project to ensure everything is working correctly.

## Setting up Environments:

- Make a test and a development environment .env files. 
- populate each with your environment variables.
- You can use the example provided in `.env.example` as a starting point.

`PGDATABASE =  <YOUR_DB_NAME>` 



