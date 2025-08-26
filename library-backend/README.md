Authentication Routes (/api/auth)
POST /api/auth/register - Register a new user (librarian only)

Requires: profileImage (optional), name, email, password, role
Protected: Yes, librarian only
Note: Includes image upload capability
POST /api/auth/login - Login user

Requires: email, password
Protected: No
Note: Uses rate limiting
POST /api/auth/logout - Logout user

Protected: No
Note: Clears authentication cookie
Book Routes (/api/books)
POST /api/books/create - Create a new book

Requires: title, author, isbn, quantity, available, genre, bookImages
Protected: Yes, librarian only
Note: Supports multiple image uploads (up to 2)
GET /api/books/getAll - Get all books

Protected: No
Returns: List of all books
PUT /api/books/update/:id - Update a book

Requires: book ID and fields to update
Protected: Yes, librarian only
Note: Can update quantity, available, and other book details
DELETE /api/books/delete/:id - Delete a book

Requires: book ID
Protected: Yes, librarian only




Borrow Routes (/api/borrow)
POST /api/borrow/ - Create a borrow request

Requires: userId, bookId
Protected: Yes, authenticated user
GET /api/borrow/my - Get user's borrow requests

Protected: Yes, authenticated user
Returns: User's borrow history
POST /api/borrow/return/:borrowId - Request to return a book

Requires: borrowId
Protected: Yes, authenticated user
GET /api/borrow/pending - Get all pending borrow requests

Protected: Yes, librarian only
Returns: All pending borrow requests
PUT /api/borrow/:requestId - Handle borrow request

Requires: requestId, status
Protected: Yes, librarian only
Note: For approving/rejecting borrow requests
PUT /api/borrow/approve-return/:borrowId - Approve return request

Requires: borrowId
Protected: Yes, librarian only
Note: Also handles fine calculation

User Routes (/api/users)
GET /api/users/all - Get all users

Protected: Yes, librarian only
Returns: All active users
GET /api/users/get/:id - Get user by ID

Protected: Yes, librarian only
Returns: Specific user details
GET /api/users/me - Get current user profile

Protected: Yes, authenticated user
Returns: Current user's details
DELETE /api/users/delete/:id - Soft delete user

Protected: Yes, librarian only
Note: Sets isActive to false instead of actual deletion
PUT /api/users/update/:id - Update user

Protected: Partially (can update own profile)
Supports: profileImage upload, password update
Note: Passwords are hashed before storage
