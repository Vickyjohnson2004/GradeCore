import { Sidebar } from "../../../components/Sidebar";
import { Topbar } from "../../../components/Topbar";
import { StatCard } from "../../../components/StatCard";
export default function StudentDashboard() {
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
          <section className="bg-ink text-white rounded-2xl p-6 md:p-8">
            <p className="text-white/60 text-sm">Welcome back</p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              John Okoro
            </h1>
            <p className="text-white/60 mt-2">
              300 Level · Computer Science · 2025/2026
            </p>
          </section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            <StatCard label="Latest GPA" value="5.00" detail="First semester" />
            <StatCard label="CGPA" value="5.00" detail="Released records" />
            <StatCard label="Registered" value="1" detail="First semester" />
            <StatCard label="Results" value="1" detail="Released" />
          </div>
          <section className="bg-white border border-slate-200 rounded-xl mt-5 p-5">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Recent result</h2>
              <a className="text-sm text-brand" href="/student/results">
                View all
              </a>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4 flex justify-between">
              <div>
                <p className="font-medium">CSC301 · Data Structures</p>
                <p className="text-sm text-slate-500 mt-1">
                  3 credit units · First Semester
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                A · 5.00
              </span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
