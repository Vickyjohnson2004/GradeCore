"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { Topbar } from "../../../components/Topbar";
import { StatCard } from "../../../components/StatCard";
import { api } from "../../../lib/api";

type Result = {
  course: { code: string; title: string; creditUnit: number; level: number };
  session: { name: string };
  semester: string;
  grade: string;
  gradePoint: number;
};

type StudentResults = {
  student: {
    fullName: string;
    level: number;
    department: { name: string };
  };
  data: Result[];
};

const levelLabel = (level: number) => `${level / 100} Year`;

export default function StudentDashboard() {
  const [results, setResults] = useState<StudentResults | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ data: StudentResults }>("/results/student/me")
      .then((response) => setResults(response.data))
      .catch((requestError) => setError(requestError.message));
  }, []);

  const levels = useMemo(() => {
    if (!results) return [];
    return Array.from(
      { length: Math.floor(results.student.level / 100) },
      (_, index) => (index + 1) * 100,
    );
  }, [results]);

  const resultsByLevel = useMemo(() => {
    const grouped = new Map<number, Result[]>();
    results?.data.forEach((result) => {
      const level = result.course.level;
      grouped.set(level, [...(grouped.get(level) || []), result]);
    });
    return grouped;
  }, [results]);

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
        <Topbar title="Student Dashboard" />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {error ? <p className="text-red-600">{error}</p> : null}
          <section className="bg-ink text-white rounded-2xl p-6 md:p-8">
            <p className="text-white/60 text-sm">Welcome back</p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              {results?.student.fullName || "Student"}
            </h1>
            <p className="text-white/60 mt-2">
              {results ? `${results.student.level} Level` : "Loading level"} ·{" "}
              {results?.student.department.name || ""}
            </p>
          </section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            <StatCard label="Latest GPA" value="-" detail="Released records" />
            <StatCard label="CGPA" value="-" detail="Released records" />
            <StatCard
              label="Results"
              value={String(results?.data.length || 0)}
              detail="Released"
            />
            <StatCard
              label="Years available"
              value={String(levels.length)}
              detail="From Year 1"
            />
          </div>
          <section className="bg-white border border-slate-200 rounded-xl mt-5 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Results by year</h2>
              <a className="text-sm text-brand" href="/student/results">
                View all
              </a>
            </div>
            <div className="space-y-3">
              {levels.map((level) => {
                const yearResults = resultsByLevel.get(level) || [];
                return (
                  <a
                    key={level}
                    href={`/student/results?level=${level}`}
                    className="block border border-slate-100 rounded-lg p-4 hover:border-brand"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{levelLabel(level)}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          {level} Level
                        </p>
                      </div>
                      <span className="text-sm text-slate-500">
                        {yearResults.length} released result
                        {yearResults.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    {yearResults.length > 0 ? (
                      <p className="text-sm text-slate-600 mt-3">
                        {yearResults
                          .slice(0, 3)
                          .map((result) => result.course.code)
                          .join(" · ")}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 mt-3">
                        No released results yet
                      </p>
                    )}
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
