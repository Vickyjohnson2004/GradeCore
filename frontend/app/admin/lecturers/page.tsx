"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { Topbar } from "../../../components/Topbar";
import { api } from "../../../lib/api";

type Lecturer = {
  _id: string;
  fullName: string;
  staffNo: string;
  email: string;
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

export default function Lecturers() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api<{ data: Lecturer[] }>("/admin/lecturers")
      .then((response) => setLecturers(response.data))
      .catch((requestError) => setError(requestError.message));
  }, []);
  return (
    <div>
      <Sidebar items={items} />
      <main className="md:ml-64 min-h-screen">
        <Topbar title="Lecturer Management" />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-brand font-semibold">
                PEOPLE DIRECTORY
              </p>
              <h1 className="text-2xl font-semibold mt-1">Lecturers</h1>
            </div>
            <span className="bg-white border rounded-lg px-3 py-2 text-sm">
              {lecturers.length} lecturers
            </span>
          </div>
          {error ? <p className="text-red-600">{error}</p> : null}
          <div className="overflow-x-auto bg-white border rounded-xl">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="p-4">Lecturer</th>
                  <th className="p-4">Staff No.</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Email</th>
                </tr>
              </thead>
              <tbody>
                {lecturers.map((lecturer) => (
                  <tr key={lecturer._id} className="border-t">
                    <td className="p-4 font-medium">{lecturer.fullName}</td>
                    <td className="p-4">{lecturer.staffNo}</td>
                    <td className="p-4">{lecturer.department.name}</td>
                    <td className="p-4 text-slate-600">{lecturer.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!lecturers.length && !error ? (
              <p className="p-8 text-center text-slate-500">
                No lecturers found.
              </p>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
