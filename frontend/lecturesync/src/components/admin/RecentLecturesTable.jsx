import React from "react";
import Table from "../common/Table.jsx";
import Card from "../common/Card.jsx";

const formatLectureDate = (value) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const RecentLecturesTable = ({ lectures }) => {
  const columns = [
    {
      header: "Course",
      accessor: "course",
      render: (lecture) => lecture.course?.name || "—",
    },
    {
      header: "Instructor",
      accessor: "instructor",
      render: (lecture) => lecture.instructor?.name || "—",
    },
    {
      header: "Lecture Date",
      accessor: "lectureDate",
      render: (lecture) => formatLectureDate(lecture.lectureDate),
    },
  ];

  return (
    <Card padded={false} className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="px-6 py-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent Lectures</h2>
            <p className="mt-1 text-sm text-slate-500">
              The latest lecture assignments sorted by newest date.
            </p>
          </div>
        </div>

        <Table
          columns={columns}
          data={lectures}
          rowKey="_id"
          emptyMessage="No lectures available."
          className="overflow-x-auto"
          tableClassName="min-w-full"
        />
      </div>
    </Card>
  );
};

export default RecentLecturesTable;
