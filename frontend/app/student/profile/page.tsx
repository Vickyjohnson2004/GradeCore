"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { Topbar } from "../../../components/Topbar";
import { api } from "../../../lib/api";

type Profile = {
  fullName: string;
  matricNo: string;
  level: number;
  department: { name: string };
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ data: { student: Profile } }>("/results/student/me")
      .then((response) => setProfile(response.data.student))
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
        <Topbar title="Student Profile" />
        <div className="p-4 md:p-8">
          {error ? <p className="text-red-600">{error}</p> : null}
          <div className="bg-white border rounded-xl p-6 max-w-2xl">
            <p className="text-sm text-brand font-semibold">STUDENT PROFILE</p>
            <h1 className="font-semibold text-xl mt-2">
              {profile?.fullName || "Loading profile..."}
            </h1>
            {profile ? (
              <div className="grid sm:grid-cols-2 gap-5 mt-6 text-sm">
                <div>
                  <p className="text-slate-500">Matriculation Number</p>
                  <p className="font-medium mt-1">{profile.matricNo}</p>
                </div>
                <div>
                  <p className="text-slate-500">Department</p>
                  <p className="font-medium mt-1">{profile.department.name}</p>
                </div>
                <div>
                  <p className="text-slate-500">Level</p>
                  <p className="font-medium mt-1">{profile.level} Level</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
