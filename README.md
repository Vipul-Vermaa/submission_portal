# Assignment submission portal

This repository contains a Node.js application that integrates with Redis for caching and developing a backend system for an assignment submission portal.

## Prerequisites

Before you start, ensure you have the following installed:

- Node.js
- Docker (for running Redis)

## Setup Instructions
1. Clone the Repository

```bash
git clone https://github.com/Vipul-Vermaa/submission_portal.git
cd submission_portal
```
2. Install Dependencies

Install the Node.js dependencies using npm 

```bash
npm install
```

3. Set Up Redis in Docker
- Pull the Redis image from Docker Hub:
```bash
docker pull redis
```
- Run Redis in a Docker container:

```bash
docker run --name redis-container -p 6379:6379 -d redis
```
This will start Redis in a Docker container and expose it on localhost:6379.

4. Create a .env File

In the root directory of your project, create a .env file to configure your Redis connection.

```bash
PORT=4000

FRONTEND_URL=http://localhost:3000

JWT_SECRET=your_jwt_secret

MONGO_URI=your_mongo_url

REDIS_HOST=127.0.0.1

REDIS_PORT=6379
```
5. Running the Application

To start the Node.js application, run:
```bash
npm start 
```


## API Endpoints
## Authentication

- POST /api/v1/register – Register a new user

- POST /api/v1/login – Login user

## Admin-specific routes

- POST /api/v1/admin/register – Register a new admin (admin-only)

- POST /api/v1/assignments – Upload an assignment

## Assignment Management

- POST /api/v1/assignments/:id/accept – Accept an assignment (admin-only)

- POST /api/v1/assignments/:id/reject – Reject an assignment (admin-only)

## Key Features
- User and Admin Registration: Register users and admins using JWT-based authentication.

- Task Assignment: Admins can upload tasks (assignments) for users.

- Redis Caching: Redis is used for caching admin data, improving the performance of admin-related API calls.

## Dependencies
- Node.js
- Express
- ioredis: For Redis interaction
- mongoose: For MongoDB interaction
- jsonwebtoken: For authentication
- Docker: For running Redis



## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)