# Library Management System API

## Overview

This is the backend API for the Library Management System that supports both borrower and librarian roles with appropriate access controls. The system is built with Node.js, Express.js, and MongoDB, providing a robust and scalable solution for library management.

## Project Structure

```
library-backend/
├── .env                # Environment variables
├── package.json        # Project dependencies and scripts
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API route definitions
│   ├── server.js       # Application entry point
│   └── utils/          # Utility functions
```

## Data Models

### 1. User
- **Fields**:
  - `profileImage`: String (URL)
  - `name`: String (required)
  - `email`: String (required, unique)
  - `password`: String (min 10 chars, required)
  - `role`: String (enum: "borrower" or "librarian", default: "borrower")
  - `isActive`: Boolean (default: true)

### 2. Book
- **Fields**:
  - `bookImage`: String (URL, required)
  - `title`: String (required)
  - `author`: String (required)
  - `isbn`: String (required, unique)
  - `quantity`: Number (required)
  - `available`: Number (required)
  - `description`: String (required)
  - `genre`: String (required)
  - `status`: String (enum: "Available" or "Borrowed", default: "Available")

### 3. Borrow
- **Fields**:
  - `userId`: ObjectId (reference to User, required)
  - `bookId`: ObjectId (reference to Book, required)
  - `requestDate`: Date (default: now)
  - `borrowDate`: Date
  - `dueDate`: Date
  - `returnDate`: Date
  - `approvedDate`: Date
  - `fine`: Number (default: 0)
  - `status`: String (enum: "pending", "approved", "rejected", "pending_return", "returned", default: "pending")

## API Endpoints Access Matrix

| Endpoint                           | Public | Borrower | Librarian | Description                               |
| ---------------------------------- | ------ | -------- | --------- | ----------------------------------------- |
| **Authentication**                 |
| `/auth/register`                   | ✅     | ✅       | ✅        | User registration (no auth required)      |
| `/auth/login`                      | ✅     | ✅       | ✅        | User login (no auth required)             |
| `/auth/logout`                     | ❌     | ✅       | ✅        | User logout (requires auth)               |
| `/auth/me`                         | ❌     | ✅       | ✅        | Get current user profile                  |
| **Books**                          |
| `/books/getAll`                    | ✅     | ✅       | ✅        | Get all available books (public browsing) |
| `/books/create`                    | ❌     | ❌       | ✅        | Create new book (librarian only)          |
| `/books/update/:id`                | ❌     | ❌       | ✅        | Update book details (librarian only)      |
| `/books/delete/:id`                | ❌     | ❌       | ✅        | Delete book (librarian only)              |
| **Users**                          |
| `/users/update/:id`                | ❌     | ✅*      | ✅        | Update user profile (own profile only)    |
| `/users/all`                       | ❌     | ❌       | ✅        | Get all users (librarian only)            |
| `/users/get/:id`                   | ❌     | ❌       | ✅        | Get specific user (librarian only)        |
| `/users/delete/:id`                | ❌     | ✅*      | ✅        | Delete user (own account only)            |
| **Borrowing**                      |
| `/borrow/request-borrow`           | ❌     | ✅       | ✅        | Request to borrow a book                  |
| `/borrow/my`                       | ❌     | ✅       | ✅        | Get user's borrow history                 |
| `/borrow/return/:borrowId`         | ❌     | ✅       | ✅        | Request to return a book                  |
| `/borrow/pending`                  | ❌     | ❌       | ✅        | Get pending borrow requests (librarian)   |
| `/borrow/pending-returns`          | ❌     | ❌       | ✅        | Get pending return requests (librarian)   |
| `/borrow/:requestId`               | ❌     | ❌       | ✅        | Handle borrow request (librarian)         |
| `/borrow/approve-return/:borrowId` | ❌     | ❌       | ✅        | Approve book return (librarian)           |
| `/borrow/all`                      | ❌     | ❌       | ✅        | Get all borrow records (librarian)        |

## Authentication & Security

- **JWT Tokens**: Used for authenticated endpoints
- **Password Hashing**: bcrypt with 10 salt rounds
- **Role-based Middleware**: `checkRole("librarian")` for protected routes
- **Rate Limiting**: Applied to authentication endpoints
- **CORS**: Configured for both development and production
- **File Upload**: Secure file handling with Cloudinary

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_ENV=development
```

## Setup & Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`
4. Start the development server:
   ```bash
   npm run dev
   ```
5. For production:
   ```bash
   npm start
   ```

## Default Admin User

A default admin user is automatically created if none exists:
- **Email**: admin@library.com
- **Password**: admin123

## Dependencies

- **Core**: Express.js, Mongoose (MongoDB ODM)
- **Authentication**: bcryptjs, jsonwebtoken
- **File Upload**: multer, multer-storage-cloudinary
- **Security**: cors, dotenv, express-rate-limit
- **Email**: nodemailer
- **Development**: nodemon

## Notes

- Users can only update/delete their own profiles unless they are librarians
- Book browsing is available to everyone without authentication
- Registration and login are public endpoints
- All other endpoints require proper authentication and authorization
- The system includes comprehensive error handling and input validation
