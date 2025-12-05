# KFUPM Maps Backend

This is the backend for the KFUPM Maps application, built using **Node.js**, **Express.js**, and **MongoDB** (with Mongoose). It provides RESTful APIs for user authentication, managing routes between buildings on campus, a leaderboard system, and administrative route management.

## Table of Contents:

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Folders Structure](#folders-structure)
- [API Documentation](#api-documintation)

  - [Authentication](#authentication)
  - [LeaderBoard](#leaderboard)
  - [Routes Management](#routes-management)

  ***

## Prerequisites

Before running this project, ensure you have the following installed on your machine:

- **Node.js** (v18 or higher recommended)
- **npm** (Node Package Manager)
- **MongoDB** (A local instance or a connection string for MongoDB Atlas)

---

## Installation

1. **Clone ther repository**
2. **Install depencies:**
   Run the following command:
   - npm install

---

## Running the Application:

To run the application use the following codes:

- npm run dev
- npm start

---

## Folders Structure:

```
Backend/
├── controllers/
│   ├── routes/
│   │   ├── manageRoutes.js
│   │   ├── route.js
│   │   ├── routeLike.js
│   │   └── routes.js
│   ├── account.js
│   ├── auth.js
│   ├── leaderboard.js
│   └── test.js
├── models/
│   ├── route.js
│   ├── routeLike.js
│   └── user.js
├── utils/
│   ├── auth.js
│   ├── config.js
│   ├── logger.js
│   ├── supabase.js
│   └── tokens.js
├── .gitignore
├── README.md
├── app.js
├── package-lock.json
└── package.json
```

---

## API Documintation

### Auth

```
Post /Login
request
{
    email,
    password
}

response
{
    accessToken,
    "user": {
        id,
        firstName
        lastName
        email,
        type,
        picture,
        score
    }
}
```

```
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
    accessToken,
    "user": {
        id,
        firstName
        lastName
        email,
        type,
        picture,
        score
    }
}
```

```
Post /refresh
response
{
  accessToken
}
```

```
Post /logout
response
{
  message
}
```

```
protected
get /updateaccount
response
{
    {firstName, lastName, picture, presignedUrl}
}

protected
Put /updateaccount
{
    {firstName, lastName, Key}
}
```

### Leaderboard

```
Get /users
[
    { firstName, lastName, picture, score}
]
```

### Routes

```
Get /routes
params = firstBuilding, secondBuilding

[
  {
    id,
    title,
    user:{
      firstName,
      lastName,
      picture
    },
    firstBuilding,
    secondBuilding,
    lastUpdated,
    starsCount,
    status,
  }
]
```

```
protected
Get /myroutes
params = status
[
  {
    id,
    title,
    user:{
      firstName,
      lastName,
      picture
    },
    firstBuilding,
    secondBuilding,
    lastUpdated,
    starsCount,
    status,
  }
]
```

```
protected - admin only
Get /manageroutes
params = status
[
  {
    id,
    title,
    user:{
      firstName,
      lastName,
      picture
    },
    firstBuilding,
    secondBuilding,
    lastUpdated,
    starsCount,
    status,
  }
]
```

```
Get /routes/:id
{
  id,
  title,
  user:{
    firstName,
    lastName,
    picture
  },
  firstBuilding,
  secondBuilding,
  steps:[
    {index, caption, photo}
  ],
  lastUpdated,
  starsCount,
  status,
}
```

```
protected
Post /routes/
{ 
  title, 
  firstBuilding, 
  secondBuilding, 
  steps:[
    {index, caption}
  ]
}
```
```
protected
Put /routes/:id
{ 
  title, 
  steps:[
    {index, caption}
  ]
}
```
```
protected
Put /routes/:id/photos
{
  photos:[
    { stepId, Key }
  ]
}
```

```
protected
Put /routes/like/:id
```

```
protected
Delete /routes/:id
```

```
protected - admin only
Put /routes/manage/:id
params: status
```
