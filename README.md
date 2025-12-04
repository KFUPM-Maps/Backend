# KFUPM Maps Backend

This is the backend for the KFUPM Maps application, built using **Node.js**, **Express.js**, and **MongoDB** (with Mongoose). It provides RESTful APIs for user authentication, managing routes between buildings on campus, a leaderboard system, and administrative route management.

## Table of Contents:
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)
* [Running the Application](#running the application)
* [Folders Structure](#folders structure)
* [API Documentation](#api documintation)
  * [Authentication](#authentication)
  * [Account Management](#account management)
  * [LeaderBoard](#leaderboard)
  * [Routes Management](#routes management)

 ---

 ## Prerequisites
Before running this project, ensure you have the following installed on your machine:
* **Node.js** (v18 or higher recommended)
* **npm** (Node Package Manager)
* **MongoDB** (A local instance or a connection string for MongoDB Atlas)

---


## end points

### Auth
Post /Login
request
{
    email,
    password
}
response
{
    "id": "1",
    "user": {
        "email": "yousef@example.com",
        "firstName": "Yousef",
        "lastName": "Abdelaziz",
        "type": "admin",
        "picture": "https://picsum.photos/200?random=1"
    },
    "accessToken": "123456"
}
Post /signup
req
{
    firstName,
    lastName,
    email,
    password
}
res
response
{
    "id": "1",
    "user": {
        "email": "yousef@example.com",
        "firstName": "Yousef",
        "lastName": "Abdelaziz",
        "type": "admin",
        "picture": "https://picsum.photos/200?random=1"
    },
    "accessToken": "123456"
}

protected
get /updateaccount
{
    {firstName, lastName, picture, presignedUrl}
}

protected
Put /updateaccount
{
    {firstName, lastName}
}

Post /refresh

Post /logout

### leaderboard
Get /users
[
    { firstName: "Yousef", lastName: "Alhajri", picture:"url", score: 150 }
]


### routes
Get /routes
params = firstBuilding, secondBuilding

[
    {
      "id": "1",
      "title": "Fastest Route to Work",
      "firstBuilding": "B58",
      "secondBuilding": "B57",
      "user": {
        "firstName": "Majid",
        "lastName": "Saleh",
        "picture": "https://loremflickr.com/200/200/nature?random=1"
      },
      "lastUpdated": "08/11/24",
      "starsCount": 75,
    }
]

protected
Get /myroutes
params = status
[
    {
      "id": "21",
      "title": "Fastest Route to Work",
      "firstBuilding": "B58",
      "secondBuilding": "B57",
      "user": {
        "firstName": "Majid",
        "lastName": "Saleh",
        "picture": "https://loremflickr.com/200/200/nature?random=1"
      },
      "lastUpdated": "08/11/24",
      "starsCount": 75,
      "status": "rejected"
    }
]

protected - admin only
Get /manageroutes
params = status
[
    {
      "id": "21",
      "title": "Fastest Route to Work",
      "firstBuilding": "B58",
      "secondBuilding": "B57",
      "user": {
        "firstName": "Majid",
        "lastName": "Saleh",
        "picture": "https://loremflickr.com/200/200/nature?random=1"
      },
      "lastUpdated": "08/11/24",
      "starsCount": 75,
      "status": "rejected"
    }
]

----

Get /routes/:id
{
      "id": "21",
      "title": "Fastest Route to Work",
      "firstBuilding": "B58",
      "secondBuilding": "B57",
      "user": {
        "firstName": "Majid",
        "lastName": "Saleh",
        "picture": "https://loremflickr.com/200/200/nature?random=1"
      },
      "steps": {
        "1": { "photo": "https://loremflickr.com/200/200/nature?random=2", "caption": "walk straight until you see the tall window" },
        "2": { "photo": "https://loremflickr.com/200/200/nature?random=3", "caption": "turn left near the small staircase" },
        "3": { "photo": "https://loremflickr.com/200/200/nature?random=4", "caption": "continue forward through the narrow hall" },
        "4": { "photo": "https://loremflickr.com/200/200/nature?random=5", "caption": "take the elevator to the second floor" }
      },
      "lastUpdated": "08/11/24",
      "starsCount": 75,
      "islikedByUser": false
}

protected
Put /routes/:id
{
      "title": "Fastest Route to Work",
      "steps": {
        "1": { "photo": "https://loremflickr.com/200/200/nature?random=2", "caption": "walk straight until you see the tall window" },
        "2": { "photo": "https://loremflickr.com/200/200/nature?random=3", "caption": "turn left near the small staircase" },
        "3": { "photo": "https://loremflickr.com/200/200/nature?random=4", "caption": "continue forward through the narrow hall" },
        "4": { "photo": "https://loremflickr.com/200/200/nature?random=5", "caption": "take the elevator to the second floor" }
      }
}

protected
Put /routes/like/:id

protected
Delete /routes/:id

protected - admin only
Put /routes/manage/:id
params: status
