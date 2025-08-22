export const template = (email) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      font-family: 'Helvetica', Arial, sans-serif;
      background-color: #f88558ff;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #fff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      text-align: center;
    }
    .logo {
      margin-bottom: 20px;
    }
    .logo img {
      width: 120px;
      height: auto;
    }
    h1 {
      font-size: 22px;
      margin-bottom: 15px;
      color: #222;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 25px;
      color: #555;
    }
    .btn {
      display: inline-block;
      padding: 12px 25px;
      background: #007bff;
      color: #fff !important;
      text-decoration: none;
      border-radius: 5px;
      font-size: 15px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://freevector-images.s3.amazonaws.com/uploads/vector/preview/36682/36682.png" alt="Company Logo" />
    </div>
    <h1>Verify Your Email Address</h1>
    <p>Welcome! Please confirm your email address to complete your account setup. Just click the button below:</p>
    <a href="http://localhost:3000/verify/${email}" class="btn" target="_blank">Verify Email</a>
    <p>If you didn’t create an account, you can safely ignore this email.</p>
    <div class="footer">
      © ${new Date().getFullYear()} Your Company. All rights reserved.
    </div>
  </div>
</body>
</html>
`
};
