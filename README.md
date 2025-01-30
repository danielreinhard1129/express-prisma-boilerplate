# Express Prisma Boilerplate

This project is a boilerplate for building a RESTful API using Express, Prisma, and TypeScript. It includes authentication, sample CRUD operations, and various middleware for validation, error handling, and more.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Testing](#testing)
- [Conventional Commits](#conventional-commits)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/danielreinhard1129/express-prisma-boilerplate.git
   cd express-prisma-boilerplate
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up the database:
   ```sh
   npx prisma db push
   ```
   or
   ```sh
   npx prisma migrate dev
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL="postgresql://postgres:password@localhost:6543/postgres"
PORT=8000
JWT_SECRET=your_jwt_secret
MAIL_USER=your_email@example.com
MAIL_PASSWORD=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Scripts

- `build`: Compile TypeScript to JavaScript.
- `start`: Start the application.
- `dev`: Start the application in development mode with hot reloading.
- `test:integration`: Run integration tests.

## Testing

### Prerequisite

Ensure you have Docker installed on your machine. The tests use a separate Docker container for the database to avoid affecting your development database.

Before running the tests, bring up the required Docker containers:

```sh
docker compose up -d
```

Then, to run the integration tests, use the following command:

```sh
npm run test:integration
```

This will execute the integration tests with the database running in a separate container.

### Explanation:

- **`docker compose up -d`**: This command will start your Docker containers in the background (`-d` stands for detached mode).
  
- **`npm run test:integration`**: This command runs your integration tests after the database containers are up and running.

## Conventional Commits

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This ensures consistent and meaningful commit history.

### Example Commit Messages

- **feat**: Add user authentication module
- **fix**: Resolve issue with database connection
- **docs**: Update README with installation instructions
- **refactor**: Simplify middleware structure
- **test**: Add integration tests for login endpoint
- **chore**: Update dependencies

Refer to the [Conventional Commits documentation](https://www.conventionalcommits.org/) for more details.

