require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db.config");
const User = require("../models/User");

// ================= HELPERS =================

const departments = ["IT", "CS", "SE", "BBA", "EE"];

const degreeTypes = ["BS", "MS", "MPhil", "PhD"];

const programs = ["morning", "evening", "shifted", "bridging"];

// ================= 100 NAMES =================

const names = [
  "Ali Raza",
  "Ahmed Hassan",
  "Usman Tariq",
  "Hamza Khalid",
  "Bilal Aslam",
  "Hassan Rauf",
  "Abdullah Imran",
  "Saad Khan",
  "Zain Ahmed",
  "Ahsan Javed",

  "Umar Farooq",
  "Talha Waqar",
  "Daniyal Shah",
  "Huzaifa Ali",
  "Farhan Iqbal",
  "Shayan Malik",
  "Taha Anwar",
  "Muneeb Ahmad",
  "Kashif Mehmood",
  "Waqas Saleem",

  "Areeb Tariq",
  "Sufyan Akhtar",
  "Jawad Ali",
  "Nouman Raza",
  "Haris Iqbal",
  "Fatima Noor",
  "Ayesha Khan",
  "Zara Ahmed",
  "Hira Tariq",
  "Iqra Malik",

  "Maham Rauf",
  "Anaya Hassan",
  "Eman Khalid",
  "Laiba Noor",
  "Sana Javed",
  "Komal Aslam",
  "Rabia Imran",
  "Amna Shah",
  "Mehwish Ali",
  "Nimra Tariq",

  "Maryam Waheed",
  "Sidra Ahmed",
  "Aiman Khan",
  "Aleena Raza",
  "Noor Fatima",
  "Sobia Malik",
  "Hafsa Tariq",
  "Kiran Javed",
  "Zainab Hassan",
  "Mahnoor Ali",

  "Rimsha Khalid",
  "Areeba Noor",
  "Bushra Ahmed",
  "Sehrish Khan",
  "Anum Tariq",
  "Fariha Javed",
  "Kainat Ali",
  "Madiha Aslam",
  "Muskan Shah",
  "Iqra Waheed",

  "Hamna Rauf",
  "Areej Malik",
  "Huda Hassan",
  "Eshal Tariq",
  "Momal Khan",
  "Samar Fatima",
  "Sania Ali",
  "Minal Raza",
  "Neha Ahmed",
  "Anosha Khalid",

  "Faizan Ahmed",
  "Adnan Tariq",
  "Asad Rauf",
  "Babar Ali",
  "Basit Khan",
  "Dawood Malik",
  "Ehtisham Tariq",
  "Fahad Hassan",
  "Gohar Ali",
  "Haider Raza",

  "Ibrahim Ahmed",
  "Junaid Tariq",
  "Kamran Malik",
  "Luqman Rauf",
  "Moiz Hassan",
  "Nabeel Ali",
  "Owais Ahmed",
  "Parsa Tariq",
  "Qasim Raza",
  "Rafay Malik",

  "Sameer Hassan",
  "Taimoor Ali",
  "Usaid Ahmed",
  "Vaqas Tariq",
  "Waleed Hassan",
  "Xain Ali",
  "Yasir Ahmed",
  "Zubair Tariq",
  "Arham Malik",
  "Behzad Rauf",
];

// ================= DEGREE TITLES =================

const degreeTitles = {
  BS: [
    "Information Technology",
    "Computer Science",
    "Software Engineering",
    "Business Administration",
    "Electrical Engineering",
  ],

  MS: [
    "Data Science",
    "Cyber Security",
    "Artificial Intelligence",
    "Software Engineering",
  ],

  MPhil: ["Computer Science", "Information Technology", "Management Sciences"],

  PhD: ["Artificial Intelligence", "Computer Networks", "Software Engineering"],
};

// ================= GENERATE USERS =================

const generateStudents = async () => {
  const students = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];

    const department =
      departments[Math.floor(Math.random() * departments.length)];

    const degreeType =
      degreeTypes[Math.floor(Math.random() * degreeTypes.length)];

    const degreeTitle =
      degreeTitles[degreeType][
        Math.floor(Math.random() * degreeTitles[degreeType].length)
      ];

    const semester = Math.floor(Math.random() * 8) + 1;

    const program = programs[Math.floor(Math.random() * programs.length)];

    const sessionStart = 2020 + Math.floor(Math.random() * 6);

    const email =
      name.toLowerCase().replace(/\s+/g, ".") + `${i + 1}@gcuf.edu.pk`;

    const hashedPassword = await bcrypt.hash("student123", 10);

    students.push({
      name,

      email,

      password: hashedPassword,

      role: "student",

      department,

      registrationNumber: `${sessionStart}-GCUF-${String(10000 + i)}`,

      degreeType,

      degreeTitle,

      semester,

      program,

      session: `${sessionStart}-${sessionStart + 4}`,

      isVerified: true,
    });
  }

  return students;
};

// ================= SEED FUNCTION =================

const seedStudents = async () => {
  try {
    await connectDB();

    const students = await generateStudents();

    // ================= DELETE OLD SEEDED STUDENTS =================
    // Remove previously seeded student accounts
    await User.deleteMany({ role: "student" });

    // ================= INSERT NEW STUDENTS =================
    await User.insertMany(students);

    console.log("100 Dummy Students Inserted Successfully");

    process.exit();
  } catch (error) {
    console.error("Seed Error:", error);

    process.exit(1);
  }
};

seedStudents();
