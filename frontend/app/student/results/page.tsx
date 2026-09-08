"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { Topbar } from "../../../components/Topbar";
import { api } from "../../../lib/api";
type R = {
  course: { code: string; title: string; creditUnit: number; level: number };
  session: { name: string };
  semester: string;
  ca: number;
  exam: number;
  total: number;
  grade: string;
  gradePoint: number;
  qualityPoint: number;
};
export default function Results() {
  const [data, setData] = useState<R[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [studentLevel, setStudentLevel] = useState(100);
  const [error, setError] = useState("");
  useEffect(() => {
    const level = Number(
      new URLSearchParams(window.location.search).get("level"),
    );
    if (level) setSelectedLevel(level);
    api<{ data: { student: { level: number }; data: R[] } }>(
      "/results/student/me",
    )
      .then((r) => {
        setStudentLevel(r.data.student.level);
        setData(r.data.data);
      })
      .catch((e) => setError(e.message));
  }, []);
  const levels = Array.from(
    { length: Math.floor(studentLevel / 100) },
    (_, index) => (index + 1) * 100,
  );
  const visibleData = data.filter(
    (result) => selectedLevel === null || result.course.level === selectedLevel,
  );
  return (
    <div>
      <Sidebar
        items={[
          { label: "Dashboard", href: "/student/dashboard" },
          { label: "Profile", href: "/student/profile" },
          { label: "Courses", href: "/student/courses" },
          { label: "Results", href: "/student/results" },
        ]}
      />
      <main className="md:ml-64 min-h-screen">
        <Topbar title="My Results" />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b">
              <h1 className="font-semibold">Released Results</h1>
              <p className="text-sm text-slate-500 mt-1">
                Only approved and released academic results are visible.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setSelectedLevel(null)}
                  className={`px-3 py-2 rounded-lg text-sm ${selectedLevel === null ? "bg-ink text-white" : "bg-slate-100"}`}
                >
                  All years
                </button>
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-2 rounded-lg text-sm ${selectedLevel === level ? "bg-ink text-white" : "bg-slate-100"}`}
                  >
                    {level / 100} Year
                  </button>
                ))}
              </div>
            </div>
            {error ? (
              <div className="p-6 text-red-600">{error}</div>
            ) : visibleData.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No results available for this year.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      {[
                        "Course",
                        "Session",
                        "CA",
                        "Exam",
                        "Total",
                        "Grade",
                        "GP",
                        "QP",
                      ].map((h) => (
                        <th key={h} className="text-left px-5 py-3 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleData.map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-5 py-4">
                          <b>{r.course.code}</b>
                          <div className="text-slate-500">{r.course.title}</div>
                        </td>
                        <td className="px-5 py-4">
                          {r.session.name}
                          <div>{r.semester}</div>
                        </td>
                        <td className="px-5 py-4">{r.ca}</td>
                        <td className="px-5 py-4">{r.exam}</td>
                        <td className="px-5 py-4">{r.total}</td>
                        <td className="px-5 py-4 font-semibold">{r.grade}</td>
                        <td className="px-5 py-4">{r.gradePoint}</td>
                        <td className="px-5 py-4">{r.qualityPoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
