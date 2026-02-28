const studentCredentialsTemplate = (name, email, tempPassword) => {
  return `
  <div style="font-family: Arial, sans-serif; padding:20px;">
    <h2>Welcome to University Portal 🎓</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your student account has been created successfully.</p>

    <div style="background:#f4f4f4;padding:15px;border-radius:5px;">
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
    </div>

    <p>Please login and change your password immediately for security reasons.</p>

    <br/>
    <p>Regards,<br/>IT Department Administration</p>
  </div>
  `;
};

const adminCredentialsTemplate = (name, email, tempPassword) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #007BFF;">Welcome, ${name}!</h2>
      <p>Your admin account has been created successfully.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      <p>Please <strong>log in and change your password immediately</strong> for security.</p>
      <hr />
      <p style="font-size: 12px; color: #555;">
        This is an automated message. Please do not reply.
      </p>
    </div>
  `;
};

const otpTemplate = (name, otp) => {
  return `
  <div style="font-family: Arial, sans-serif; padding:20px;">
    <h2>Password Reset OTP</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>You requested a password reset. Use the following OTP to reset your password:</p>
    <div style="background:#f4f4f4;padding:15px;border-radius:5px;font-size:18px;">
      <strong>OTP: ${otp}</strong>
    </div>
    <p>This OTP is valid for 5 minutes.</p>
    <br/>
    <p>Regards,<br/>IT Department Administration</p>
  </div>
  `;
};





module.exports = {
  studentCredentialsTemplate,
  otpTemplate,
  adminCredentialsTemplate
}