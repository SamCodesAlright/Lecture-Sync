import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BookOpen,
  CalendarDays,
  Clock,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";
import lectureService from "../../services/lectureService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import Table from "../../components/common/Table.jsx";
import Badge from "../../components/common/Badge.jsx";
import LoadingSkeleton from "../../components/common/LoadingSkeleton.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

// Helpers
const formatDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const getLectureStatus = (lectureDateStr) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(lectureDateStr);
  d.setHours(0, 0, 0, 0);

  if (d.getTime() === now.getTime()) return "today";
  if (d > now) return "upcoming";
  return "past";
};

const STATUS_CONFIG = {
  today: { label: "Today", variant: "warning" },
  upcoming: { label: "Upcoming", variant: "success" },
  past: { label: "Past", variant: "default" },
};

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLectures = useCallback(async () => {
    setLoading(true);
    try {
      const res = await lectureService.getMyLectures();
      setLectures(res?.data ?? []);
    } catch (err) {
      toast.error(err?.message || "Failed to load your lectures.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  // Derived stats
  const stats = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let upcoming = 0;
    let today = 0;
    let past = 0;

    for (const lec of lectures) {
      const status = getLectureStatus(lec.lectureDate);
      if (status === "today") today++;
      else if (status === "upcoming") upcoming++;
      else past++;
    }

    return { total: lectures.length, upcoming, today, past };
  }, [lectures]);

  // Sorted & filtered
  const sortedAndFiltered = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Upcoming + today first, then past — all sorted by date
    return [...lectures]
      .filter(
        (l) =>
          search === "" ||
          l.course?.name?.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        const aDate = new Date(a.lectureDate);
        const bDate = new Date(b.lectureDate);
        const aFuture = aDate >= now;
        const bFuture = bDate >= now;
        if (aFuture && !bFuture) return -1;
        if (!aFuture && bFuture) return 1;
        return aFuture
          ? aDate - bDate // upcoming: ascending (soonest first)
          : bDate - aDate; // past: descending (most recent first)
      });
  }, [lectures, search]);

  // Table columns
  const columns = [
    {
      header: "Course",
      accessor: "course",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[180px]">
          {row.course?.image ? (
            <img
              src={row.course.image}
              alt={row.course.name}
              className="h-9 w-14 flex-shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-9 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <BookOpen className="h-4 w-4 text-slate-400" />
            </div>
          )}
          <span className="font-medium text-slate-900">
            {row.course?.name ?? "—"}
          </span>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "lectureDate",
      render: (row) => (
        <span className="text-slate-700">{formatDate(row.lectureDate)}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const status = getLectureStatus(row.lectureDate);
        const { label, variant } = STATUS_CONFIG[status];
        return <Badge label={label} variant={variant} />;
      },
    },
  ];

  // Greeting and date label
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const currentDateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" count={3} className="rounded-3xl p-6" />
        <LoadingSkeleton
          variant="table"
          count={5}
          className="rounded-3xl p-6"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={`${greeting}, ${user?.name?.split(" ")[0] ?? "Instructor"} 👋`}
        subtitle="Here's your personal lecture schedule and overview."
        action={
          <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            {currentDateLabel}
          </div>
        }
      />

      {/* Stat cards */}
      <section aria-label="Lecture statistics">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Lectures"
            value={stats.total}
            description="All lectures assigned to you."
            icon={<CalendarDays className="h-6 w-6" />}
            className="hover:-translate-y-0.5 transition"
          />
          <StatCard
            title="Today"
            value={stats.today}
            description="Lectures happening today."
            icon={<Clock className="h-6 w-6" />}
            className="hover:-translate-y-0.5 transition"
          />
          <StatCard
            title="Upcoming"
            value={stats.upcoming}
            description="Scheduled for the future."
            icon={<CalendarCheck className="h-6 w-6" />}
            className="hover:-translate-y-0.5 transition"
          />
          <StatCard
            title="Completed"
            value={stats.past}
            description="Lectures already delivered."
            icon={<CheckCircle2 className="h-6 w-6" />}
            className="hover:-translate-y-0.5 transition"
          />
        </div>
      </section>

      {/* Lecture table */}
      <section aria-label="My lectures">
        <div className="mb-4">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
            Schedule
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            My Lectures
          </h2>
        </div>

        {lectures.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
            <EmptyState
              title="No lectures assigned yet"
              description="Your admin will assign lectures to you. Check back soon!"
            />
          </div>
        ) : (
          <Table
            columns={columns}
            data={sortedAndFiltered}
            rowKey="_id"
            emptyMessage="No lectures match your search."
            search={{
              value: search,
              onChange: (val) => setSearch(val),
              placeholder: "Search by course name…",
              onClear: () => setSearch(""),
            }}
          />
        )}
      </section>
    </div>
  );
};

export default InstructorDashboard;
