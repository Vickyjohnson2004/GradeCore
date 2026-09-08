"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { Topbar } from "../../../components/Topbar";
import { api } from "../../../lib/api";

type Student = {
  _id: string;
  fullName: string;
  matricNo: string;
  email: string;
  level: number;
  isActive: boolean;
  department: { name: string };
};

const items = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Students", href: "/admin/students" },
  { label: "Lecturers", href: "/admin/lecturers" },
  { label: "Courses", href: "/admin/courses" },
  { label: "Results", href: "/admin/results" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Audit Logs", href: "/admin/audit-logs" },
  { label: "Settings", href: "/admin/settings" },
];

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api<{ data: Student[] }>("/admin/students")
      .then((response) => setStudents(response.data))
      .catch((requestError) => setError(requestError.message));
  }, []);
  return (
    <div>
      <Sidebar items={items} />
      <main className="md:ml-64 min-h-screen">
        <Topbar title="Student Management" />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-brand font-semibold">
                PEOPLE DIRECTORY
              </p>
              <h1 className="text-2xl font-semibold mt-1">Students</h1>
            </div>
            <span className="bg-white border rounded-lg px-3 py-2 text-sm">
              {students.length} students
            </span>
          </div>
          {error ? <p className="text-red-600">{error}</p> : null}
          <div className="overflow-x-auto bg-white border rounded-xl">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Matric No.</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-t">
                    <td className="p-4">
                      <p className="font-medium">{student.fullName}</p>
                      <p className="text-slate-500">{student.email}</p>
                    </td>
                    <td className="p-4 font-medium">{student.matricNo}</td>
                    <td className="p-4">{student.department.name}</td>
                    <td className="p-4">{student.level} Level</td>
                    <td className="p-4">
                      <span className="rounded-full bg-emerald-50 text-emerald-700 px-2 py-1 text-xs">
                        {student.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!students.length && !error ? (
              <p className="p-8 text-center text-slate-500">
                No students found.
              </p>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
