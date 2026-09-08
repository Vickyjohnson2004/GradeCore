"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { Topbar } from "../../../components/Topbar";
import { api } from "../../../lib/api";
type Course = {
  _id: string;
  code: string;
  title: string;
  creditUnit: number;
  level: number;
  semester: string;
  isActive: boolean;
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
export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api<{ data: Course[] }>("/admin/courses")
      .then((r) => setCourses(r.data))
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div>
      <Sidebar items={items} />
      <main className="md:ml-64 min-h-screen">
        <Topbar title="Course Management" />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand">
                ACADEMIC CATALOG
              </p>
              <h1 className="text-2xl font-semibold mt-1">Courses</h1>
              <p className="text-slate-500 mt-2">
                Manage course offerings by level, semester and credit load.
              </p>
            </div>
            <span className="bg-white border px-3 py-2 rounded-lg text-sm">
              {courses.length} active records
            </span>
          </div>
          {error && <p className="mt-5 text-red-600">{error}</p>}
          <div className="mt-6 overflow-x-auto bg-white border rounded-xl">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Semester</th>
                  <th className="p-4">Units</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} className="border-t">
                    <td className="p-4 font-semibold text-brand">
                      {course.code}
                    </td>
                    <td className="p-4">{course.title}</td>
                    <td className="p-4">{course.level} level</td>
                    <td className="p-4">{course.semester}</td>
                    <td className="p-4">{course.creditUnit}</td>
                    <td className="p-4">
                      <span className="text-xs rounded-full bg-emerald-50 text-emerald-700 px-2 py-1">
                        {course.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!courses.length && !error && (
              <p className="p-8 text-center text-slate-500">
                No courses found.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
