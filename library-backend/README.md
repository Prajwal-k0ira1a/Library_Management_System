# Library Management System API

## Overview

This is the backend API for the Library Management System that supports both borrower and librarian roles with appropriate access controls.

## API Endpoints Access Matrix

| Endpoint                           | Public | Borrower | Librarian | Description                               |
| ---------------------------------- | ------ | -------- | --------- | ----------------------------------------- |
| **Authentication**                 |
| `/auth/register`                   | ✅     | ✅       | ✅        | User registration (no auth required)      |
| `/auth/login`                      | ✅     | ✅       | ✅        | User login (no auth required)             |
| `/auth/logout`                     | ❌     | ✅       | ✅        | User logout (requires auth)               |
| **Books**                          |
| `/books/getAll`                    | ✅     | ✅       | ✅        | Get all available books (public browsing) |
| `/books/create`                    | ❌     | ❌       | ✅        | Create new book (librarian only)          |
| `/books/update/:id`                | ❌     | ❌       | ✅        | Update book details (librarian only)      |
| `/books/delete/:id`                | ❌     | ❌       | ✅        | Delete book (librarian only)              |
| **Users**                          |
| `/users/me`                        | ❌     | ✅       | ✅        | Get current user profile                  |
| `/users/update/:id`                | ❌     | ✅\*     | ✅        | Update user profile (own profile only)    |
| `/users/all`                       | ❌     | ❌       | ✅        | Get all users (librarian only)            |
| `/users/get/:id`                   | ❌     | ❌       | ✅        | Get specific user (librarian only)        |
| `/users/delete/:id`                | ❌     | ✅\*     | ✅        | Delete user (own account only)            |
| **Borrowing**                      |
| `/borrow/request-borrow`           | ❌     | ✅       | ✅        | Request to borrow a book                  |
| `/borrow/my`                       | ❌     | ✅       | ✅        | Get user's borrow history                 |
| `/borrow/return/:borrowId`         | ❌     | ✅       | ✅        | Request to return a book                  |
| `/borrow/pending`                  | ❌     | ❌       | ✅        | Get pending borrow requests (librarian)   |
| `/borrow/pending-returns`          | ❌     | ❌       | ✅        | Get pending return requests (librarian)   |
| `/borrow/:requestId`               | ❌     | ❌       | ✅        | Handle borrow request (librarian)         |
| `/borrow/approve-return/:borrowId` | ❌     | ❌       | ✅        | Approve book return (librarian)           |
| `/borrow/all`                      | ❌     | ❌       | ✅        | Get all borrow records (librarian)        |

## Role-Based Access Control

### Public Access

- Book browsing (`/books/getAll`)
- User registration and login

### Borrower Access

- View and update own profile
- Browse books
- Request book borrows
- View borrow history
- Request book returns
- Delete own account

### Librarian Access

- All borrower permissions
- Manage books (create, update, delete)
- View all users
- Handle borrow requests
- Approve book returns
- View all borrow records
- Manage user accounts

## Authentication

- **JWT Tokens**: Used for authenticated endpoints
- **Role-based Middleware**: `checkRole("librarian")` for librarian-only endpoints
- **Rate Limiting**: Applied to login endpoints
- **File Upload**: Supported for user profiles and book images

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- Soft delete for data integrity
- File upload security with Cloudinary

## Notes

- Users can only update/delete their own profiles unless they are librarians
- Book browsing is available to everyone without authentication
- Registration and login are public endpoints
- All other endpoints require proper authentication and authorization
