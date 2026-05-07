require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db.config");
const FAQ = require("../models/FAQ");

// ================= DUMMY FAQ DATA =================

const faqs = [
  {
    question: "How can I reset my student portal password?",
    answer:
      "You can reset your password by clicking the forgot password option on the login page and following the instructions sent to your registered email.",
    category: "technical",
    status: "active",
  },
  {
    question: "What is the minimum attendance required for exams?",
    answer:
      "Students must maintain at least 75 percent attendance to become eligible for final examinations.",
    category: "attendance",
    status: "active",
  },
  {
    question: "How can I apply for university admission?",
    answer:
      "Admissions can be applied online through the university admission portal during the official admission schedule.",
    category: "admissions",
    status: "active",
  },
  {
    question: "Where can I check my semester result?",
    answer:
      "Semester results are available on the student portal under the results section after official announcement.",
    category: "result",
    status: "active",
  },
  {
    question: "Can I change my enrolled courses?",
    answer:
      "Yes, students can add or drop courses during the officially announced add-drop period.",
    category: "courses",
    status: "active",
  },
  {
    question: "What documents are required for admission?",
    answer:
      "Required documents include academic certificates, CNIC or B-Form, domicile, photographs, and fee challan.",
    category: "admissions",
    status: "active",
  },
  {
    question: "How can I get a library membership card?",
    answer:
      "Library cards are issued after enrollment verification through the university library office.",
    category: "library",
    status: "active",
  },
  {
    question: "What should I do if my account gets locked?",
    answer:
      "You should contact the IT helpdesk or department administrator to unlock your account.",
    category: "security",
    status: "active",
  },
  {
    question: "How can I apply for a scholarship?",
    answer:
      "Students can apply for scholarships through the scholarship portal by submitting the required documents.",
    category: "scholarship",
    status: "active",
  },
  {
    question: "How do I pay my semester fee online?",
    answer:
      "Semester fees can be paid through designated banks or online banking services using the generated challan form.",
    category: "fee",
    status: "active",
  },
  {
    question: "What is the procedure for semester freeze?",
    answer:
      "Students can apply for semester freeze through the department office with a valid reason and supporting documents.",
    category: "rules",
    status: "active",
  },
  {
    question: "Can I improve a failed course grade?",
    answer:
      "Yes, students can repeat failed courses according to university academic policies.",
    category: "courses",
    status: "active",
  },
  {
    question: "How can I access online lectures?",
    answer:
      "Online lectures are available on the Learning Management System using your university credentials.",
    category: "technical",
    status: "active",
  },
  {
    question: "What happens if I miss a final exam?",
    answer:
      "Students must contact the examination department immediately and provide a valid reason for absence.",
    category: "examination",
    status: "active",
  },
  {
    question: "How can I update my profile information?",
    answer:
      "You can update your profile details from the student portal settings section.",
    category: "general",
    status: "active",
  },
  {
    question: "How can I contact the examination department?",
    answer:
      "The examination department can be contacted through official email or during office hours.",
    category: "examination",
    status: "active",
  },
  {
    question: "Where can I download my fee challan?",
    answer:
      "Fee challans can be downloaded from the student portal fee section.",
    category: "fee",
    status: "active",
  },
  {
    question: "Can students participate in university events?",
    answer:
      "Yes, students are encouraged to participate in academic and extracurricular events.",
    category: "events",
    status: "active",
  },
  {
    question: "How do I request an official transcript?",
    answer:
      "Transcript requests can be submitted online or through the registrar office.",
    category: "general",
    status: "active",
  },
  {
    question: "What is the university dress code policy?",
    answer:
      "Students are expected to follow the university dress code during academic hours.",
    category: "rules",
    status: "active",
  },
  {
    question: "How can I report a technical issue in the portal?",
    answer:
      "Technical issues can be reported through the helpdesk system or IT support office.",
    category: "technical",
    status: "active",
  },
  {
    question: "Can I apply for hostel accommodation online?",
    answer:
      "Yes, hostel applications can be submitted online during the hostel registration period.",
    category: "general",
    status: "active",
  },
  {
    question: "What should I do if I forget my registration number?",
    answer:
      "You can recover your registration number through the administration office after identity verification.",
    category: "general",
    status: "active",
  },
  {
    question: "How can I check my attendance record?",
    answer:
      "Attendance records are available on the student portal under the attendance section.",
    category: "attendance",
    status: "active",
  },
  {
    question: "What is the passing criteria for courses?",
    answer:
      "Students must achieve the minimum passing marks and required GPA according to university policy.",
    category: "courses",
    status: "active",
  },
  {
    question: "Can students access WiFi on campus?",
    answer:
      "Yes, students can access campus WiFi using their university login credentials.",
    category: "technical",
    status: "active",
  },
  {
    question: "How are scholarships awarded?",
    answer:
      "Scholarships are awarded based on merit, financial need, or specific eligibility criteria.",
    category: "scholarship",
    status: "active",
  },
  {
    question: "What is the process for degree verification?",
    answer:
      "Degree verification requests can be submitted to the registrar office with required documents.",
    category: "general",
    status: "active",
  },
  {
    question: "Can I submit assignments after the deadline?",
    answer:
      "Late submissions depend on instructor policy and may include penalties.",
    category: "courses",
    status: "active",
  },
  {
    question: "How can I receive university notifications?",
    answer:
      "Notifications are sent through the student portal, official email, and SMS services.",
    category: "general",
    status: "active",
  },
  {
    question: "What should I do if my fee payment is not updated?",
    answer:
      "You should contact the accounts office with your payment receipt for verification.",
    category: "fee",
    status: "active",
  },
  {
    question: "Can students organize events on campus?",
    answer:
      "Students can organize events after obtaining approval from university administration.",
    category: "events",
    status: "active",
  },
  {
    question: "How can I renew borrowed library books?",
    answer:
      "Library books can be renewed online or through the library circulation desk.",
    category: "library",
    status: "active",
  },
  {
    question: "What security measures protect student accounts?",
    answer:
      "Student accounts are protected through password encryption and authentication systems.",
    category: "security",
    status: "active",
  },
  {
    question: "How can I check exam schedules?",
    answer:
      "Exam schedules are uploaded on the student portal and department notice boards.",
    category: "examination",
    status: "active",
  },
  {
    question: "Can I transfer to another department?",
    answer:
      "Department transfer requests are processed according to eligibility and seat availability.",
    category: "rules",
    status: "active",
  },
  {
    question: "How do I obtain a bonafide certificate?",
    answer:
      "Bonafide certificates can be requested through the administration office.",
    category: "general",
    status: "active",
  },
  {
    question: "What is the policy for unfair means in exams?",
    answer:
      "Students involved in unfair means are subject to disciplinary action according to university rules.",
    category: "rules",
    status: "active",
  },
  {
    question: "Can students access digital library resources remotely?",
    answer:
      "Yes, digital library resources can be accessed remotely using university credentials.",
    category: "library",
    status: "active",
  },
  {
    question: "How can I update my email address in the portal?",
    answer:
      "Email addresses can be updated through the profile settings section after verification.",
    category: "technical",
    status: "active",
  },
  {
    question: "What happens if I fail to pay fee on time?",
    answer:
      "Late fee charges may apply and access to university services can be restricted.",
    category: "fee",
    status: "inactive",
  },
  {
    question: "Can I apply for multiple scholarships?",
    answer:
      "Students may apply for multiple scholarships if they meet the eligibility criteria.",
    category: "scholarship",
    status: "active",
  },
  {
    question: "How can I recover deleted assignments from LMS?",
    answer:
      "Students should contact their course instructor or LMS administrator for assistance.",
    category: "technical",
    status: "active",
  },
  {
    question: "Are makeup exams available for medical emergencies?",
    answer:
      "Makeup exams may be arranged after approval from the examination department and valid proof.",
    category: "examination",
    status: "active",
  },
  {
    question: "How can students participate in sports competitions?",
    answer:
      "Students can register through the sports department during announced registration periods.",
    category: "events",
    status: "active",
  },
  {
    question: "What is the process for migration certificate issuance?",
    answer:
      "Migration certificates are issued by the registrar office after clearance verification.",
    category: "general",
    status: "active",
  },
  {
    question: "Can library fines be paid online?",
    answer:
      "Yes, library fines can be paid through the university online payment system.",
    category: "library",
    status: "active",
  },
  {
    question: "How can I secure my university account?",
    answer:
      "Use strong passwords and never share your login credentials with others.",
    category: "security",
    status: "active",
  },
  {
    question: "How are semester GPAs calculated?",
    answer:
      "Semester GPA is calculated based on credit hours and grade points earned in each course.",
    category: "result",
    status: "active",
  },
  {
    question: "Can I appeal against my examination result?",
    answer:
      "Yes, students can submit result rechecking or appeal applications within the announced deadline.",
    category: "result",
    status: "active",
  },
  {
    question: "How can I view upcoming university events?",
    answer:
      "Upcoming events are listed on the university portal and official social media pages.",
    category: "events",
    status: "active",
  },
];

// ================= ADD COMMON FIELDS =================

const faqData = faqs.map((faq) => ({
  ...faq,
  createdById: new mongoose.Types.ObjectId("69d7349d07aeeb8db0f9359d"),
  createdByName: "Abdul Waleed",
}));

// ================= SEED FUNCTION =================

const seedFAQs = async () => {
  try {
    await connectDB();

    console.log("MongoDB Connected");

    // Optional: remove previous FAQs
    await FAQ.deleteMany();

    console.log("Previous FAQs Removed");

    // Insert FAQs
    await FAQ.insertMany(faqData);

    console.log("FAQs Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error("FAQ Seed Error:", error.message);
    process.exit(1);
  }
};

seedFAQs();
