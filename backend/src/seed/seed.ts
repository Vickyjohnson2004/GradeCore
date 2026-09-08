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
  const users = await User.create([
    { email: "admin@uniport.test", passwordHash: hash, role: "ADMIN" },
    { email: "lecturer@uniport.test", passwordHash: hash, role: "LECTURER" },
    { email: "lecturer2@uniport.test", passwordHash: hash, role: "LECTURER" },
    { email: "lecturer3@uniport.test", passwordHash: hash, role: "LECTURER" },
    { email: "lecturer4@uniport.test", passwordHash: hash, role: "LECTURER" },
    { email: "student@uniport.test", passwordHash: hash, role: "STUDENT" },
    { email: "student100@uniport.test", passwordHash: hash, role: "STUDENT" },
    { email: "student200@uniport.test", passwordHash: hash, role: "STUDENT" },
    { email: "student400@uniport.test", passwordHash: hash, role: "STUDENT" },
    { email: "student2@uniport.test", passwordHash: hash, role: "STUDENT" },
    { email: "student3@uniport.test", passwordHash: hash, role: "STUDENT" },
    { email: "student4@uniport.test", passwordHash: hash, role: "STUDENT" },
    { email: "student5@uniport.test", passwordHash: hash, role: "STUDENT" },
  ]);
  const adminUser = users[0];
  const lecturerUsers = users.slice(1, 5);
  const studentUsers = users.slice(5);
  const dept = await Department.create({
    name: "Computer Science",
    code: "CSC",
  });
  const session = await AcademicSession.create({
    name: "2025/2026",
    isActive: true,
    semesters: ["FIRST", "SECOND"],
  });
  const lecturers = await Lecturer.create([
    {
      user: lecturerUsers[0]._id,
      staffNo: "UNI-LECT-001",
      fullName: "Dr. Ada Nwosu",
      email: lecturerUsers[0].email,
      department: dept._id,
    },
    {
      user: lecturerUsers[1]._id,
      staffNo: "UNI-LECT-002",
      fullName: "Dr. Chidi Okafor",
      email: lecturerUsers[1].email,
      department: dept._id,
    },
    {
      user: lecturerUsers[2]._id,
      staffNo: "UNI-LECT-003",
      fullName: "Mrs. Bisi Adebayo",
      email: lecturerUsers[2].email,
      department: dept._id,
    },
    {
      user: lecturerUsers[3]._id,
      staffNo: "UNI-LECT-004",
      fullName: "Mr. Emeka Obi",
      email: lecturerUsers[3].email,
      department: dept._id,
    },
  ]);
  const students = await Student.create([
    {
      user: studentUsers[0]._id,
      matricNo: "CSC/20/1234",
      fullName: "John Okoro",
      email: studentUsers[0].email,
      department: dept._id,
      level: 300,
    },
    {
      user: studentUsers[1]._id,
      matricNo: "CSC/24/1001",
      fullName: "Amaka Eze",
      email: studentUsers[1].email,
      department: dept._id,
      level: 100,
    },
    {
      user: studentUsers[2]._id,
      matricNo: "CSC/23/2002",
      fullName: "Ifeanyi Obi",
      email: studentUsers[2].email,
      department: dept._id,
      level: 200,
    },
    {
      user: studentUsers[3]._id,
      matricNo: "CSC/21/4003",
      fullName: "Zainab Bello",
      email: studentUsers[3].email,
      department: dept._id,
      level: 400,
    },
    {
      user: studentUsers[4]._id,
      matricNo: "CSC/22/3012",
      fullName: "David Mark",
      email: studentUsers[4].email,
      department: dept._id,
      level: 300,
    },
    {
      user: studentUsers[5]._id,
      matricNo: "CSC/23/2018",
      fullName: "Grace Nnamani",
      email: studentUsers[5].email,
      department: dept._id,
      level: 200,
    },
    {
      user: studentUsers[6]._id,
      matricNo: "CSC/24/1021",
      fullName: "Tomi Williams",
      email: studentUsers[6].email,
      department: dept._id,
      level: 100,
    },
    {
      user: studentUsers[7]._id,
      matricNo: "CSC/21/4027",
      fullName: "Emeka Nwankwo",
      email: studentUsers[7].email,
      department: dept._id,
      level: 400,
    },
  ]);
  const courses = await Course.create([
    {
      code: "CSC101",
      title: "Introduction to Computing",
      creditUnit: 3,
      department: dept._id,
      level: 100,
      semester: "FIRST",
    },
    {
      code: "CSC102",
      title: "Computer Programming I",
      creditUnit: 3,
      department: dept._id,
      level: 100,
      semester: "SECOND",
    },
    {
      code: "CSC103",
      title: "Discrete Mathematics",
      creditUnit: 3,
      department: dept._id,
      level: 100,
      semester: "SECOND",
    },
    {
      code: "CSC201",
      title: "Object Oriented Programming",
      creditUnit: 3,
      department: dept._id,
      level: 200,
      semester: "FIRST",
    },
    {
      code: "CSC202",
      title: "Computer Architecture",
      creditUnit: 3,
      department: dept._id,
      level: 200,
      semester: "FIRST",
    },
    {
      code: "CSC203",
      title: "Data Communication",
      creditUnit: 3,
      department: dept._id,
      level: 200,
      semester: "SECOND",
    },
    {
      code: "CSC301",
      title: "Data Structures",
      creditUnit: 3,
      department: dept._id,
      level: 300,
      semester: "FIRST",
    },
    {
      code: "CSC302",
      title: "Operating Systems",
      creditUnit: 3,
      department: dept._id,
      level: 300,
      semester: "FIRST",
    },
    {
      code: "CSC303",
      title: "Web Application Development",
      creditUnit: 3,
      department: dept._id,
      level: 300,
      semester: "SECOND",
    },
    {
      code: "CSC401",
      title: "Software Engineering",
      creditUnit: 3,
      department: dept._id,
      level: 400,
      semester: "FIRST",
    },
    {
      code: "CSC402",
      title: "Database Administration",
      creditUnit: 3,
      department: dept._id,
      level: 400,
      semester: "SECOND",
    },
    {
      code: "CSC403",
      title: "Artificial Intelligence",
      creditUnit: 3,
      department: dept._id,
      level: 400,
      semester: "SECOND",
    },
  ]);
  await CourseAssignment.create(
    courses.map((item, index) => ({
      course: item._id,
      lecturer: lecturers[index % lecturers.length]._id,
      session: session._id,
    })),
  );
  const registrations = students.flatMap((student) =>
    courses
      .filter((course) => course.level <= student.level)
      .map((course) => ({
        student: student._id,
        course: course._id,
        session: session._id,
        semester: course.semester,
      })),
  );
  await CourseRegistration.insertMany(registrations);
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
  const resultRows = registrations.map((registration, index) => {
    const ca = 18 + (index % 11);
    const exam = 45 + (index % 26);
    const total = ca + exam;
    const grade =
      total >= 70
        ? "A"
        : total >= 60
          ? "B"
          : total >= 50
            ? "C"
            : total >= 45
              ? "D"
              : total >= 40
                ? "E"
                : "F";
    const gradePoint = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 }[grade];
    const courseIndex = courses.findIndex(
      (course) => course._id.toString() === registration.course.toString(),
    );
    return {
      ...registration,
      lecturer: lecturers[courseIndex % lecturers.length]._id,
      ca,
      exam,
      total,
      grade,
      gradePoint,
      qualityPoint:
        registration.course && courses[courseIndex].creditUnit * gradePoint,
      status: "RELEASED" as const,
      releasedAt: new Date(),
    };
  });
  await Result.insertMany(resultRows);
  process.stdout.write(
    `Seeded. Active grading config: ${config.name}; admin: ${adminUser.email}\n`,
  );
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
