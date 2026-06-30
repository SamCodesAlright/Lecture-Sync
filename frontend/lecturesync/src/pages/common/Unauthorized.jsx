import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4 py-16">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="flex items-center justify-center rounded-3xl bg-blue-50 p-5 text-blue-700">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">
            Unauthorized
          </h1>
          <p className="mt-3 text-slate-600">
            You do not have permission to view this page. Please contact your
            administrator or login with a different account.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
