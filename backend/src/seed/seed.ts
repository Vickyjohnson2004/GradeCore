import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { User } from "../models/User.js";
import { Department } from "../models/Department.js";
import { Student } from "../models/Student.js";
import { Lecturer } from "../models/Lecturer.js";
import { Course } from "../models/Course.js";
import { AcademicSession } from "../models/AcademicSession.js";
import { GradingConfiguration } from "../models/GradingConfiguration.js";
import { CourseAssignment } from "../models/CourseAssignment.js";
import { CourseRegistration } from "../models/CourseRegistration.js";
import { Result } from "../models/Result.js";

async function seed() {
  await connectDatabase();
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Student.deleteMany({}),
    Lecturer.deleteMany({}),
    Course.deleteMany({}),
    AcademicSession.deleteMany({}),
    GradingConfiguration.deleteMany({}),
    CourseAssignment.deleteMany({}),
    CourseRegistration.deleteMany({}),
    Result.deleteMany({}),
  ]);
  const hash = await bcrypt.hash("Password123!", 12);
  const [adminUser, lecturerUser, studentUser] = await User.create([
    { email: "admin@uniport.test", passwordHash: hash, role: "ADMIN" },
    { email: "lecturer@uniport.test", passwordHash: hash, role: "LECTURER" },
    { email: "student@uniport.test", passwordHash: hash, role: "STUDENT" },
  ]);
  const dept = await Department.create({
    name: "Computer Science",
    code: "CSC",
  });
  const session = await AcademicSession.create({
    name: "2025/2026",
    isActive: true,
    semesters: ["FIRST", "SECOND"],
  });
  const lecturer = await Lecturer.create({
    user: lecturerUser._id,
    staffNo: "UNI-LECT-001",
    fullName: "Dr. Ada Nwosu",
    email: lecturerUser.email,
    department: dept._id,
  });
  const student = await Student.create({
    user: studentUser._id,
    matricNo: "CSC/20/1234",
    fullName: "John Okoro",
    email: studentUser.email,
    department: dept._id,
    level: 300,
  });
  const course = await Course.create({
    code: "CSC301",
    title: "Data Structures",
    creditUnit: 3,
    department: dept._id,
    level: 300,
    semester: "FIRST",
  });
  await CourseAssignment.create({
    course: course._id,
    lecturer: lecturer._id,
    session: session._id,
  });
  await CourseRegistration.create({
    student: student._id,
    course: course._id,
    session: session._id,
    semester: "FIRST",
  });
  const config = await GradingConfiguration.create({
    name: "Uniport Standard",
    caMax: 30,
    examMax: 70,
    isActive: true,
    rules: [
      { min: 70, max: 100, grade: "A", point: 5 },
      { min: 60, max: 69.99, grade: "B", point: 4 },
      { min: 50, max: 59.99, grade: "C", point: 3 },
      { min: 45, max: 49.99, grade: "D", point: 2 },
      { min: 40, max: 44.99, grade: "E", point: 1 },
      { min: 0, max: 39.99, grade: "F", point: 0 },
    ],
  });
  await Result.create({
    student: student._id,
    course: course._id,
    lecturer: lecturer._id,
    session: session._id,
    semester: "FIRST",
    ca: 25,
    exam: 60,
    total: 85,
    grade: "A",
    gradePoint: 5,
    qualityPoint: 15,
    status: "RELEASED",
    releasedAt: new Date(),
  });
  console.log(
    `Seeded. Active grading config: ${config.name}; admin: ${adminUser.email}`,
  );
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
