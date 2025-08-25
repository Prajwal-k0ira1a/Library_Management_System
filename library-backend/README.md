POST /
Create a borrow request (requires authentication).
requestBorrowBook

GET /my
Get all borrow requests for the authenticated user.
getMyBorrowRequests

POST /return/:borrowId
Request to return a borrowed book (requires authentication).
requestReturn

GET /pending
Get all pending borrow requests (librarian only).
getPendingBorrowRequests

PUT /:requestId
Approve or reject a borrow request (librarian only).
handleBorrowRequest

PUT /approve-return/:borrowId
Approve a return request (librarian only).
approveReturn

User Routes (library-backend/src/routes/userRoutes.js)
GET /users/all — Get all users (librarian only)
GET /users/get/:id — Get user by ID (librarian only)
GET /users/me — Get current authenticated user
DELETE /users/delete/:id — Delete user by ID (librarian only)
PUT /users/update/:id — Update user by ID (with profile image upload)
Borrow Routes (library-backend/src/routes/borrowRoutes.js)
POST /borrow/ — Request to borrow a book (authenticated user)
GET /borrow/my — Get all borrow requests for the authenticated user
POST /borrow/return/:borrowId — Request to return a borrowed book (authenticated user)
GET /borrow/pending — Get all pending borrow requests (librarian only)
PUT /borrow/:requestId — Approve or reject a borrow request (librarian only)
PUT /borrow/approve-return/:borrowId — Approve a return request (librarian only)
You can find these route definitions in:

userRoutes.js
borrowRoutes.js