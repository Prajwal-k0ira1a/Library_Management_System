import nodemailer from "nodemailer";

// Step 1: Setup email configuration
const setupEmail = () => {
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your app password
    },
  });
};

const templates = {
  // When user borrows a book
  bookBorrowed: (userName, bookTitle, dueDate) => ({
    subject: ` You borrowed: ${bookTitle}`,
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Book Borrowed</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;"> Library System</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #4CAF50, #45a049); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px;">
                                ✓
                            </div>
                            <h2 style="color: #2c3e50; margin: 0; font-size: 24px; font-weight: 600;">Book Borrowed Successfully!</h2>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Hi <strong>${userName}</strong>,</p>
                        
                        <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0; color: #2c3e50; font-size: 16px;">
                                <strong>Book:</strong> ${bookTitle}<br>
                                <strong>Due Date:</strong> <span style="color: #e74c3c; font-weight: 600;">${dueDate}</span>
                            </p>
                        </div>
                        
                        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 25px 0;">
                            <p style="margin: 0; color: #856404; font-size: 14px;">
                                <strong> Reminder:</strong> Please return your book on time to avoid late fees. You'll receive a reminder 3 days before the due date.
                            </p>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">Happy reading! </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
                        <p style="color: #bdc3c7; margin: 0; font-size: 14px;">
                            Thank you for using our library system<br>
                            <span style="color: #95a5a6;">© 2025 Library Management System</span>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
  }),

  // When book is overdue
  bookOverdue: (userName, bookTitle, fine) => ({
    subject: ` OVERDUE: ${bookTitle} - Action Required`,
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Book Overdue</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">🚨 Library System</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #e74c3c, #c0392b); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px; color: white;">
                                ⚠
                            </div>
                            <h2 style="color: #e74c3c; margin: 0; font-size: 24px; font-weight: 600;">Book is Overdue!</h2>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Hi <strong>${userName}</strong>,</p>
                        
                        <div style="background-color: #ffeaa7; border-left: 4px solid #e74c3c; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0; color: #2c3e50; font-size: 16px;">
                                <strong>Overdue Book:</strong> ${bookTitle}<br>
                                <strong>Fine Amount:</strong> <span style="color: #e74c3c; font-weight: 600; font-size: 18px;">Rs ${fine}</span>
                            </p>
                        </div>
                        
                        <div style="background-color: #ffebee; border: 1px solid #e74c3c; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h3 style="color: #c62828; margin: 0 0 10px 0; font-size: 18px;">Immediate Action Required</h3>
                            <ul style="color: #555; margin: 0; padding-left: 20px;">
                                <li>Return the book immediately to avoid additional fines</li>
                                <li>Pay the current fine amount: <strong>Rs ${fine}</strong></li>
                                <li>Visit the library or contact us for assistance</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="#" style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);">
                                Pay Fine Online
                            </a>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
                        <p style="color: #bdc3c7; margin: 0; font-size: 14px;">
                            Please return your book as soon as possible<br>
                            <span style="color: #95a5a6;">© 2025 Library Management System</span>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
  }),

  // When book is returned
  bookReturned: (userName, bookTitle, fine) => ({
    subject: ` Book Returned: ${bookTitle}`,
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Book Returned</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #27ae60 0%, #229954 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">📚 Library System</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #27ae60, #229954); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px; color: white;">
                                ✓
                            </div>
                            <h2 style="color: #27ae60; margin: 0; font-size: 24px; font-weight: 600;">Book Returned Successfully!</h2>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Hi <strong>${userName}</strong>,</p>
                        
                        <div style="background-color: #f8f9fa; border-left: 4px solid #27ae60; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0 0 10px 0; color: #2c3e50; font-size: 16px;">
                                <strong>Returned Book:</strong> ${bookTitle}
                            </p>
                            ${
                              fine > 0
                                ? `<p style="margin: 0; color: #e74c3c; font-size: 16px;">
                                    <strong>Fine Paid:</strong> Rs ${fine}
                                </p>`
                                : `<p style="margin: 0; color: #27ae60; font-size: 16px; font-weight: 600;">
                                     No fine - returned on time!
                                </p>`
                            }
                        </div>
                        
                        <div style="background-color: #d5f4e6; border: 1px solid #27ae60; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                            <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 18px;">Thank You! </h3>
                            <p style="color: #155724; margin: 0; font-size: 16px;">
                                We appreciate you returning the book. You can now borrow new books from our collection.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="#" style="background: linear-gradient(135deg, #27ae60, #229954); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);">
                                Browse More Books
                            </a>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
                        <p style="color: #bdc3c7; margin: 0; font-size: 14px;">
                            Happy reading! Come back soon for more books<br>
                            <span style="color: #95a5a6;">© 2025 Library Management System</span>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
  }),

  // Welcome new user
  welcome: (userName, userEmail, userPassword) => ({
    subject: `🎉 Welcome to Our Library, ${userName}!`,
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Library</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 300;">🎉 Welcome!</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">You're now part of our library family</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #6c5ce7, #a29bfe); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px;">
                                
                            </div>
                            <h2 style="color: #2c3e50; margin: 0; font-size: 26px; font-weight: 600;">Welcome to Our Library!</h2>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Hi <strong>${userName}</strong>,</p>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Your account has been created successfully! We're excited to have you join our community of book lovers.
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; margin: 30px 0; color: white;">
                            <h3 style="margin: 0 0 20px 0; font-size: 20px; text-align: center;">Your Login Details</h3>
                            <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; backdrop-filter: blur(10px);">
                                <p style="margin: 0 0 10px 0; font-size: 16px;">
                                    <strong>📧 Email:</strong> ${userEmail}
                                </p>
                                <p style="margin: 0; font-size: 16px;">
                                    <strong>🔑 Password:</strong> ${userPassword}
                                </p>
                            </div>
                        </div>
                        
                        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">🔒 Security Notice</h4>
                            <p style="margin: 0; color: #856404; font-size: 14px;">
                                Please keep your login details safe and change your password after first login for better security.
                            </p>
                        </div>
                        
                        <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h4 style="color: #2e7d2e; margin: 0 0 15px 0; font-size: 18px;"> What you can do now:</h4>
                            <ul style="color: #2e7d2e; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 8px;">Browse our extensive book collection</li>
                                <li style="margin-bottom: 8px;">Borrow up to 3 books at a time</li>
                                <li style="margin-bottom: 8px;">Reserve books that are currently unavailable</li>
                                <li>Access digital resources and e-books</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="#" style="background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3); margin: 10px;">
                                Login Now
                            </a>
                            <a href="#" style="background: transparent; color: #6c5ce7; padding: 15px 35px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; border: 2px solid #6c5ce7; margin: 10px;">
                                Browse Books
                            </a>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; text-align: center;">
                            Happy reading! 
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
                        <p style="color: #bdc3c7; margin: 0; font-size: 14px;">
                            Welcome to our library community!<br>
                            <span style="color: #95a5a6;">© 2025 Library Management System</span>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
  }),

  // Book reminder (3 days before due)
  bookReminder: (userName, bookTitle, daysLeft) => ({
    subject: `⏰ Reminder: Return "${bookTitle}" in ${daysLeft} days`,
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Book Return Reminder</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;"> Library System</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f39c12, #e67e22); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px; color: white;">
                            
                            </div>
                            <h2 style="color: #f39c12; margin: 0; font-size: 24px; font-weight: 600;">Book Return Reminder</h2>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Hi <strong>${userName}</strong>,</p>
                        
                        <div style="background-color: #fff4e6; border-left: 4px solid #f39c12; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0 0 10px 0; color: #2c3e50; font-size: 16px;">
                                <strong>Book:</strong> ${bookTitle}
                            </p>
                            <p style="margin: 0; color: #e67e22; font-size: 18px; font-weight: 600;">
                                <strong>Due in:</strong> ${daysLeft} ${
      daysLeft === 1 ? "day" : "days"
    }
                            </p>
                        </div>
                        
                        <div style="background-color: #fef9e7; border: 1px solid #fadb14; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h3 style="color: #d48806; margin: 0 0 15px 0; font-size: 18px;">📝 Friendly Reminder</h3>
                            <p style="color: #d48806; margin: 0; font-size: 16px;">
                                Your borrowed book is due soon. Please return it on time to avoid late fees and help other readers access it.
                            </p>
                        </div>
                        
                        <div style="display: flex; gap: 20px; margin: 30px 0; justify-content: center; flex-wrap: wrap;">
                            <div style="flex: 1; min-width: 200px; text-align: center; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                                <div style="font-size: 24px; margin-bottom: 10px;">📚</div>
                                <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Return Book</h4>
                                <p style="color: #666; margin: 0; font-size: 14px;">Visit the library during operating hours</p>
                            </div>
                            <div style="flex: 1; min-width: 200px; text-align: center; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                                <div style="font-size: 24px; margin-bottom: 10px;">🔄</div>
                                <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Renew Online</h4>
                                <p style="color: #666; margin: 0; font-size: 14px;">Extend your borrowing period if eligible</p>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="#" style="background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3); margin: 10px;">
                                Renew Book
                            </a>
                            <a href="#" style="background: transparent; color: #f39c12; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; border: 2px solid #f39c12; margin: 10px;">
                                Library Hours
                            </a>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
                        <p style="color: #bdc3c7; margin: 0; font-size: 14px;">
                            Thank you for being a responsible library member<br>
                            <span style="color: #95a5a6;">© 2025 Library Management System</span>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
  }),

  // Bonus: Book reservation confirmation
  bookReserved: (userName, bookTitle, estimatedDate) => ({
    subject: `📋 Book Reserved: ${bookTitle}`,
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Book Reserved</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">📋 Library System</h1>
                    </div>
                    
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9b59b6, #8e44ad); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px; color: white;">
                                📋
                            </div>
                            <h2 style="color: #9b59b6; margin: 0; font-size: 24px; font-weight: 600;">Book Reserved Successfully!</h2>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Hi <strong>${userName}</strong>,</p>
                        
                        <div style="background-color: #f8f9fa; border-left: 4px solid #9b59b6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0 0 10px 0; color: #2c3e50; font-size: 16px;">
                                <strong>Reserved Book:</strong> ${bookTitle}
                            </p>
                            <p style="margin: 0; color: #9b59b6; font-size: 16px;">
                                <strong>Estimated Available:</strong> ${estimatedDate}
                            </p>
                        </div>
                        
                        <div style="background-color: #f4f0ff; border: 1px solid #9b59b6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <p style="margin: 0; color: #6c3483; font-size: 16px;">
                                We'll notify you as soon as the book becomes available. Your reservation is confirmed!
                            </p>
                        </div>
                    </div>
                    
                    <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
                        <p style="color: #bdc3c7; margin: 0; font-size: 14px;">
                            Your reservation is confirmed<br>
                            <span style="color: #95a5a6;">© 2025 Library Management System</span>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
  }),

  // When book request is rejected
  bookRejected: (userName, bookTitle) => ({
    subject: `❌ Book Request Rejected: ${bookTitle}`,
    html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Book Request Rejected</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 300;">❌ Library System</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #e74c3c, #c0392b); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 36px; color: white;">
                                ❌
                            </div>
                            <h2 style="color: #e74c3c; margin: 0; font-size: 24px; font-weight: 600;">Book Request Rejected</h2>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Hi <strong>${userName}</strong>,</p>
                        
                        <div style="background-color: #ffebee; border-left: 4px solid #e74c3c; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0; color: #2c3e50; font-size: 16px;">
                                <strong>Book:</strong> ${bookTitle}<br>
                                <strong>Status:</strong> <span style="color: #e74c3c; font-weight: 600;">Request Rejected</span>
                            </p>
                        </div>
                        
                        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">📝 What this means:</h3>
                            <ul style="color: #856404; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 8px;">Your request to borrow this book has been declined</li>
                                <li style="margin-bottom: 8px;">The book may be unavailable or reserved for other purposes</li>
                                <li style="margin-bottom: 8px;">You can try requesting again later or choose a different book</li>
                                <li>Contact the library for more information if needed</li>
                            </ul>
                        </div>
                        
                        <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h4 style="color: #2e7d2e; margin: 0 0 15px 0; font-size: 18px;">💡 Suggestions:</h4>
                            <ul style="color: #2e7d2e; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 8px;">Browse our available books collection</li>
                                <li style="margin-bottom: 8px;">Check if similar books are available</li>
                                <li style="margin-bottom: 8px;">Visit the library to speak with a librarian</li>
                                <li>Consider placing a reservation for when it becomes available</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="#" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); margin: 10px;">
                                Browse Available Books
                            </a>
                            <a href="#" style="background: transparent; color: #667eea; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; border: 2px solid #667eea; margin: 10px;">
                                Contact Library
                            </a>
                        </div>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; text-align: center;">
                            Don't worry! There are plenty of other great books available for you to enjoy.
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
                        <p style="color: #bdc3c7; margin: 0; font-size: 14px;">
                            Thank you for understanding<br>
                            <span style="color: #95a5a6;">© 2025 Library Management System</span>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
  }),
};
// Step 3: Simple function to send email
export const sendEmail = async (userEmail, templateName, ...data) => {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email not configured - skipping email send");
      return false;
    }

    // Get email setup
    const transporter = setupEmail();

    // Check if template exists
    if (!templates[templateName]) {
      console.log(`Email template '${templateName}' not found`);
      return false;
    }

    // Get the right template
    const template = templates[templateName](...data);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: template.subject,
      html: template.html,
    });

    console.log(`✅ Email sent to ${userEmail} - ${template.subject}`);
    return true;
  } catch (error) {
    console.log("❌ Email failed:", error.message);
    return false;
  }
};
