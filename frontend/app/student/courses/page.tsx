"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { Topbar } from "../../../components/Topbar";
import { api } from "../../../lib/api";

type Course = {
  course: {
    code: string;
    title: string;
    creditUnit: number;
    level: number;
    semester: string;
  };
  session: { name: string };
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentName, setStudentName] = useState("Student");
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ data: { student: { fullName: string }; data: Course[] } }>(
      "/results/student/courses",
    )
      .then((response) => {
        setStudentName(response.data.student.fullName);
        setCourses(response.data.data);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

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
        <Topbar title="Registered Courses" />
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-slate-500">Current academic session</p>
              <h1 className="text-2xl font-semibold mt-1">{studentName}</h1>
            </div>
            <span className="bg-white border rounded-lg px-3 py-2 text-sm text-slate-600">
              {courses.length} courses
            </span>
          </div>
          {error ? <p className="text-red-600">{error}</p> : null}
          <div className="grid md:grid-cols-2 gap-4">
            {courses.map((item) => (
              <article
                key={`${item.course.code}-${item.course.semester}`}
                className="bg-white border border-slate-200 rounded-xl p-5"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-semibold text-brand">
                      {item.course.code}
                    </p>
                    <h2 className="font-medium mt-1">{item.course.title}</h2>
                  </div>
                  <span className="text-sm text-slate-500 whitespace-nowrap">
                    {item.course.creditUnit} CU
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-4">
                  {item.course.level} Level · {item.course.semester} Semester ·{" "}
                  {item.session.name}
                </p>
              </article>
            ))}
          </div>
          {!courses.length && !error ? (
            <p className="bg-white border rounded-xl p-8 text-center text-slate-500">
              No registered courses found.
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
