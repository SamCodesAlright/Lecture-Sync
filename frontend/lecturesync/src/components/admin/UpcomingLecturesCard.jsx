import React from "react";
import { CalendarDays, BookOpen, User } from "lucide-react";
import Card from "../common/Card.jsx";
import EmptyState from "../common/EmptyState.jsx";

const formatLectureDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const UpcomingLecturesCard = ({ lectures }) => {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Upcoming Lectures</p>
            <p className="mt-1 text-sm text-slate-500">Next scheduled sessions at a glance.</p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        {lectures.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No upcoming lectures scheduled."
              description="Create new lecture assignments to keep your calendar full."
            />
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {lectures.map((lecture) => (
              <li
                key={lecture._id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white p-2 text-blue-600 shadow-sm">
                      <BookOpen className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {lecture.course?.name || "Untitled course"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {lecture.instructor?.name || "Unassigned instructor"}
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
                    <User className="h-4 w-4" aria-hidden="true" />
                    {formatLectureDate(lecture.lectureDate)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default UpcomingLecturesCard;
