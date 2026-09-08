"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type Item = {
  label: string;
  href: string;
  icon?: ReactNode;
};

export function Sidebar({ items }: { items: Item[] }) {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const nav = (mobile = false) => (
    <nav className="p-3 space-y-1">
      {items.map((item) => {
        const isActive =
          path === item.href ||
          (item.href !== "/" && path.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => mobile && setIsOpen(false)}
            className={`
              group relative flex items-center gap-3
              px-4 py-3 rounded-xl
              text-sm font-medium
              transition-all duration-300 ease-out
              ${
                isActive
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            {/* Active indicator */}
            <span
              className={`
                absolute left-0 top-1/2 -translate-y-1/2
                h-6 w-1 rounded-r-full
                transition-all duration-300
                ${
                  isActive ? "bg-white opacity-100" : "bg-transparent opacity-0"
                }
              `}
            />

            {/* Icon */}
            {item.icon && (
              <span
                className={`
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-lg
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/60 group-hover:bg-white/5 group-hover:text-white"
                  }
                `}
              >
                {item.icon}
              </span>
            )}

            {/* Label */}
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-ink text-white border-r border-white/10">
        {/* Logo / Header */}
        <div className="p-6 border-b border-white/10">
          <p className="text-xs tracking-[.2em] text-white/60">GradeCore</p>

          <h1 className="font-semibold mt-1">Academic Result Portal</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">{nav()}</div>

        {/* Footer */}
        <div className="p-4 text-xs text-white/50 border-t border-white/10">
          Grade Checking and Result Management System
        </div>
      </aside>

      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-ink text-white border-b border-white/10">
        <div className="h-16 px-4 flex items-center justify-between">
          {/* Brand */}
          <div>
            <p className="text-[10px] tracking-[.2em] text-white/50">
              GRADECORE
            </p>

            <h1 className="text-sm font-semibold">Academic Result Portal</h1>
          </div>

          {/* Animated Menu Button */}
          <button
            type="button"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="
              relative flex h-11 w-11 items-center justify-center
              rounded-xl border border-white/10
              bg-white/5
              transition-all duration-300
              hover:bg-white/10
              active:scale-90
            "
          >
            <span className="relative block h-5 w-5">
              {/* Top line */}
              <span
                className={`
                  absolute left-0 top-1
                  h-0.5 w-5 rounded-full bg-white
                  transition-all duration-300
                  ${isOpen ? "top-2.5 rotate-45" : ""}
                `}
              />

              {/* Middle line */}
              <span
                className={`
                  absolute left-0 top-2.5
                  h-0.5 w-5 rounded-full bg-white
                  transition-all duration-200
                  ${isOpen ? "scale-0 opacity-0" : ""}
                `}
              />

              {/* Bottom line */}
              <span
                className={`
                  absolute left-0 top-4
                  h-0.5 w-5 rounded-full bg-white
                  transition-all duration-300
                  ${isOpen ? "top-2.5 -rotate-45" : ""}
                `}
              />
            </span>
          </button>
        </div>
      </header>

      {/* =====================================================
          MOBILE BACKDROP
      ====================================================== */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
          md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]
          transition-all duration-300
          ${
            isOpen
              ? "visible opacity-100"
              : "invisible opacity-0 pointer-events-none"
          }
        `}
      />

      {/* =====================================================
          MOBILE SIDEBAR / DRAWER
      ====================================================== */}
      <aside
        className={`
          md:hidden fixed inset-y-0 left-0 z-50
          w-[280px] max-w-[85vw]
          flex flex-col
          bg-ink text-white
          border-r border-white/10
          shadow-2xl
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <p className="text-xs tracking-[.2em] text-white/50">GRADECORE</p>

            <h2 className="mt-1 font-semibold">Academic Result Portal</h2>
          </div>

          {/* Close Button */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
            className="
              flex h-9 w-9 items-center justify-center
              rounded-lg
              text-white/60
              transition-all duration-200
              hover:bg-white/10
              hover:text-white
              active:scale-90
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 overflow-y-auto">{nav(true)}</div>

        {/* Mobile Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs leading-5 text-white/40">
            Grade Checking and Result Management System
          </p>
        </div>
      </aside>

      {/* =====================================================
          MOBILE CONTENT SPACING
      ====================================================== */}
      <div className="md:hidden h-16" />
    </>
  );
}
