// emailTemplates.js

// ================= CREATE USER EMAIL TEMPLATE =================
const createUserEmailNotificationTemplate = (user, tempPassword) => {
  const isStudent = user.role === "student";

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #1a73e8;">Hello ${user.name},</h2>
      
      <p>Your ${user.role} account has been created successfully. Please find your credentials below:</p>

      <ul>
        <li><strong>Role:</strong> ${user.role}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Password:</strong> ${tempPassword}</li>
        <li><strong>Department:</strong> ${user.department}</li>

        ${
          isStudent
            ? `
          <li><strong>Registration Number:</strong> ${user.registrationNumber}</li>
          <li><strong>Degree Type:</strong> ${user.degreeType}</li>
          <li><strong>Degree Title:</strong> ${user.degreeTitle}</li>
          <li><strong>Semester:</strong> ${user.semester}</li>
          <li><strong>Program:</strong> ${user.program}</li>
          <li><strong>Session:</strong> ${user.session}</li>
        `
            : `
          <li><strong>Designation:</strong> ${user.designation}</li>
        `
        }
      </ul>

      <p>You can login using these credentials and change your password later.</p>

      <p>Regards,<br/>IT Department</p>
    </div>
  `;
};

// Update User Account Email Template
const updateUserEmailNotificationTemplate = (
  name,
  email,
  registrationNumber,
  degreeType,
  degreeTitle,
  semester,
  department,
  program,
  session,
) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #1a73e8;">Hello ${name},</h2>
      <p>Your student account details have been updated. Please find the updated information below:</p>
      <ul>
        <li><strong>Registration Number:</strong> ${registrationNumber}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Degree Type:</strong> ${degreeType || "N/A"}</li>
        <li><strong>Degree Title:</strong> ${degreeTitle || "N/A"}</li>
        <li><strong>Semester:</strong> ${semester || "N/A"}</li>
        <li><strong>Department:</strong> ${department || "N/A"}</li>
        <li><strong>Program:</strong> ${program || "N/A"}</li>
        <li><strong>Session:</strong> ${session || "N/A"}</li>
      </ul>
      <p>If you did not request this update, please contact the administration immediately.</p>
      <p>Regards,<br/>IT Department</p>
    </div>
  `;
};

// Delete User Account Email Template
const deleteUserEmailNotificationTemplate = (
  name,
  registrationNumber,
  email,
) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #d93025;">Account Deletion Notice</h2>

      <p>Hello <strong>${name}</strong>,</p>

      <p>
        This is to inform you that your student account associated with the following details
        has been removed from the system by the administration.
      </p>

      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Registration Number:</strong> ${registrationNumber}</li>
        <li><strong>Email:</strong> ${email}</li>
      </ul>

      <p>
        If you believe this action was taken in error, please contact the university
        administration or IT department immediately.
      </p>

      <br/>

      <p>Regards,</p>
      <p><strong>University IT Department</strong></p>
    </div>
  `;
};

// --------------------------------------------------------------------------------------------------------

// const createAdminCredentialsTemplate = (
//   name,
//   email,
//   tempPassword,
//   department,
//   designation,
// ) => {
//   return `
//     <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//       <h2 style="color: #1a73e8;">Hello ${name},</h2>
//       <p>Your admin account has been created successfully. Please find the information below:</p>
//       <ul>
//         <li><strong>Email:</strong> ${email}</li>
//         <li><strong>Password:</strong> ${tempPassword}</li>
//         <li><strong>Department:</strong> ${department}</li>
//         <li><strong>Designation:</strong> ${designation}</li>
//       </ul>
//       <p>You can login to your account using these credentials, and you can also change your password later.</p>
//       <p>Regards,<br/>IT Department</p>
//     </div>
//   `;
// };

// ----------------------------------------------------------------------------------------

// OTP Email Template
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
  createUserEmailNotificationTemplate,
  updateUserEmailNotificationTemplate,
  deleteUserEmailNotificationTemplate,
  otpTemplate,
};
