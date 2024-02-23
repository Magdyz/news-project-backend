# PROJECT NC News API

![JavaScript](https://img.shields.io/badge/-JavaScript-yellow)

[Link to API](https://api1.magz.dev/api)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D10-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D12-blue)

### Versions Used:

- Node.js: v20.10.0
- PostgreSQL: 16.1

#API Endpoints:

- `GET /api`: route is used for all endpoints related to news articles.

**About the project**

The NC News Project is a backend Node.js Express application with a PostgreSQL database, designed to provide programmatic access to application data. Modeled after real-world backend services like Reddit, the project aims to mimic their functionality, offering essential information to frontend architectures.

**Installation Instructions:**

#Clone the Repository

`git clone https://github.com/Magdyz/project-nc-news.git`

#Install Dependencies:

```
cd nc-news-project
npm install
```

#Seed the Local Database:

`npm run seed`

This will seed the local PostgreSQL database with sample data. Make sure you have PostgreSQL installed and running locally. This will create an initial set of data that you can use to test out the functionality of the application. It also allows you to see how the data is structured. 


#Run Tests:

`npm run test`

This command will execute all the tests in the project to ensure everything is working correctly.

#Setting up Environments:

- Make a test and a development environment .env files. 
- populate each with your environment variables.
- You can use the example provided in `.env.example` as a starting point.

`PGDATABASE =  <YOUR_DB_NAME>` 



