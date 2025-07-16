# Library Management System Backend

A Node.js/Express backend for managing library operations.

## Features

- User Authentication (Register/Login)
- Book Management (CRUD operations)
- Borrow/Return System
- MongoDB Integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd library-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5100
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. The server will start on `http://localhost:5100`

## API Endpoints

- Authentication:
  - POST `/api/auth/register` - Register a new user
  - POST `/api/auth/login` - Login user

- Books:
  - GET `/api/books` - Get all books
  - POST `/api/books` - Create a new book
  - GET `/api/books/:id` - Get a specific book
  - PUT `/api/books/:id` - Update a book
  - DELETE `/api/books/:id` - Delete a book

- Borrow:
  - POST `/api/borrow` - Borrow a book
  - GET `/api/borrow` - Get all borrow records
  - PUT `/api/borrow/:id` - Update borrow status

## Project Structure

```
src/
├── config/
│   └── db.js
├── controllers/
├── middleware/
├── models/
├── routes/
└── server.js
```

## Environment Variables

- `PORT` - Server port (default: 5100)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key for authentication

## Security

- JWT-based authentication
- CORS enabled
- Environment variables for sensitive data
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
