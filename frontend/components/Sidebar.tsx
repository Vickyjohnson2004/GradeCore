"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
type Item = { label: string; href: string };
export function Sidebar({ items }: { items: Item[] }) {
  const path = usePathname();
  const nav = (
    <nav className="p-3 space-y-1">
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={`block px-4 py-3 rounded-lg text-sm transition-colors ${path === i.href ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
  return (
    <>
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col bg-ink text-white">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs tracking-[.2em] text-white/60">UNIPORT</p>
          <h1 className="font-semibold mt-1">Academic Portal</h1>
        </div>
        <div className="flex-1">{nav}</div>
        <div className="p-4 text-xs text-white/50 border-t border-white/10">
          University of Port Harcourt
        </div>
      </aside>
      <div className="md:hidden bg-ink text-white px-4 py-3 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max">
          <strong className="mr-2">GradeCore</strong>
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`px-3 py-2 rounded-lg text-sm ${path === i.href ? "bg-white/15 text-white" : "text-white/65"}`}
            >
              {i.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
