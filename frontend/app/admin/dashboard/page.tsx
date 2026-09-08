"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { Topbar } from "../../../components/Topbar";
import { StatCard } from "../../../components/StatCard";
import { api } from "../../../lib/api";
type D = {
  students: number;
  lecturers: number;
  courses: number;
  pending: number;
  approved: number;
  released: number;
  activeSession: { name: string } | null;
};
export default function AdminDashboard() {
  const [d, setD] = useState<D | null>(null);
  const [e, setE] = useState("");
  useEffect(() => {
    api<{ data: D }>("/admin/dashboard")
      .then((r) => setD(r.data))
      .catch((x) => setE(x.message));
  }, []);
  return (
    <div>
      <Sidebar
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Students", href: "/admin/students" },
          { label: "Lecturers", href: "/admin/lecturers" },
          { label: "Courses", href: "/admin/courses" },
          { label: "Results", href: "/admin/results" },
          { label: "Reports", href: "/admin/reports" },
          { label: "Audit Logs", href: "/admin/audit-logs" },
          { label: "Settings", href: "/admin/settings" },
        ]}
      />
      <main className="md:ml-64 min-h-screen">
        <Topbar title="Administrator Dashboard" />
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-semibold">Academic Operations</h1>
              <p className="text-slate-500 mt-1">
                Result processing overview and institutional activity.
              </p>
            </div>
            {d?.activeSession && (
              <span className="text-sm bg-white border px-3 py-2 rounded-lg">
                {d.activeSession.name} · Active
              </span>
            )}
          </div>
          {e && <div className="mt-4 text-red-600">{e}</div>}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <StatCard label="Students" value={d?.students ?? "—"} />
            <StatCard label="Lecturers" value={d?.lecturers ?? "—"} />
            <StatCard label="Courses" value={d?.courses ?? "—"} />
            <StatCard label="Pending Review" value={d?.pending ?? "—"} />
            <StatCard label="Approved" value={d?.approved ?? "—"} />
            <StatCard label="Released" value={d?.released ?? "—"} />
          </div>
          <div className="grid lg:grid-cols-2 gap-5 mt-5">
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-semibold">Result processing</h2>
              <p className="text-sm text-slate-500 mt-1">
                Move submitted results through review, approval and release.
              </p>
              <div className="mt-5 space-y-3">
                {[
                  ["Pending review", d?.pending],
                  ["Approved", d?.approved],
                  ["Released", d?.released],
                ].map(([x, v]) => (
                  <div
                    key={String(x)}
                    className="flex justify-between border-b pb-3"
                  >
                    <span>{x}</span>
                    <b>{v ?? "—"}</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-ink text-white rounded-xl p-6">
              <p className="text-white/60 text-sm">Quick action</p>
              <h2 className="text-xl font-semibold mt-2">
                Review submitted results
              </h2>
              <p className="text-white/60 text-sm mt-2">
                Validate scores before approval and release.
              </p>
              <a
                href="/admin/results"
                className="inline-block mt-5 px-4 py-2 bg-white text-ink rounded-lg text-sm font-medium"
              >
                Open results
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
