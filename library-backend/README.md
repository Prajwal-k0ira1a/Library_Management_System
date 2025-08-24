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