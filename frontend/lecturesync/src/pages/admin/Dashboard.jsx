import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader.jsx";
import LoadingSkeleton from "../../components/common/LoadingSkeleton.jsx";
import courseService from "../../services/courseService.js";
import instructorService from "../../services/instructorService.js";
import lectureService from "../../services/lectureService.js";
import DashboardStats from "../../components/admin/DashboardStats.jsx";
import UpcomingLecturesCard from "../../components/admin/UpcomingLecturesCard.jsx";
import RecentLecturesTable from "../../components/admin/RecentLecturesTable.jsx";

const formatDateLabel = (value) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [coursesResponse, instructorsResponse, lecturesResponse] =
          await Promise.all([
            courseService.getAllCourses(),
            instructorService.getAllInstructors(),
            lectureService.getAllLectures(),
          ]);

        setCourses(coursesResponse?.data ?? []);
        setInstructors(instructorsResponse?.data ?? []);
        setLectures(lecturesResponse?.data ?? []);
      } catch (error) {
        toast.error(
          error?.message || "Unable to load dashboard data. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totals = useMemo(
    () => ({
      courses: courses.length,
      instructors: instructors.length,
      lectures: lectures.length,
      upcoming: lectures.filter((lecture) => {
        const lectureDate = new Date(lecture.lectureDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return lectureDate >= today;
      }).length,
    }),
    [courses.length, instructors.length, lectures],
  );

  const upcomingLectures = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...lectures]
      .filter((lecture) => new Date(lecture.lectureDate) >= today)
      .sort(
        (left, right) =>
          new Date(left.lectureDate) - new Date(right.lectureDate),
      )
      .slice(0, 5);
  }, [lectures]);

  const recentLectures = useMemo(
    () =>
      [...lectures]
        .sort(
          (left, right) =>
            new Date(right.lectureDate) - new Date(left.lectureDate),
        )
        .slice(0, 10),
    [lectures],
  );

  const currentDateLabel = useMemo(
    () => formatDateLabel(new Date()),
    [],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <LoadingSkeleton
            variant="card"
            count={3}
            className="rounded-3xl p-6"
          />
          <LoadingSkeleton
            variant="table"
            count={5}
            className="rounded-3xl p-6"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <PageHeader
          title="Dashboard"
          subtitle="Welcome back! Here's an overview of your lecture scheduling system."
          action={
            <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
              {currentDateLabel}
            </div>
          }
        />

        <section aria-labelledby="dashboard-stats">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-600">
                Overview
              </p>
              <h2 id="dashboard-stats" className="mt-2 text-xl font-semibold text-slate-900">
                Key performance metrics
              </h2>
            </div>
          </div>

          <div className="pt-4">
            <DashboardStats totals={totals} />
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <UpcomingLecturesCard lectures={upcomingLectures} />
          <RecentLecturesTable lectures={recentLectures} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
