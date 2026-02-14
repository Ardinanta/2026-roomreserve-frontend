import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-300 py-6 mt-12 border-t border-slate-800">
      <div className="w-full px-4 flex flex-row items-center justify-center">
        <div className="text-sm font-semibold tracking-wide text-center">
          &copy; {new Date().getFullYear()} RoomReserve
        </div>
      </div>
    </footer>
  );
}
