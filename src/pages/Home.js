import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-xl w-full text-center relative pb-20">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-4">Welcome to <span className="text-indigo-600">e-Billing</span></h1>
        <p className="text-lg text-gray-600 mb-8">
          Create, manage, and download your bills with a modern, user-friendly interface.
        </p>
        <div className="flex flex-col justify-center gap-6">
          <Link to="/new-bill" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow transition">
            Create New Bill
          </Link>
          <Link to="/bills" className="bg-white border border-blue-700 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold shadow transition">
            View All Bills
          </Link>
        </div>
        <p className="text-xs text-blue-800 mb-8 absolute bottom-0 right-6 font-bold">
          By - Bhavik Pahuja
        </p>
      </div>
    </div>
  );
}