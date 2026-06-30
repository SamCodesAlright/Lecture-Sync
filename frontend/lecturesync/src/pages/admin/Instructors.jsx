import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import instructorService from "../../services/instructorService.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import Table from "../../components/common/Table.jsx";
import Badge from "../../components/common/Badge.jsx";
import LoadingSkeleton from "../../components/common/LoadingSkeleton.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchInstructors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await instructorService.getAllInstructors();
      setInstructors(res?.data ?? []);
    } catch (err) {
      toast.error(err?.message || "Failed to load instructors.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const filtered = useMemo(
    () =>
      instructors.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [instructors, search],
  );

  const columns = [
    {
      header: "Instructor",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          {/* Avatar with initials */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
            {row.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">Instructor</p>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      render: (row) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          <a
            href={`mailto:${row.email}`}
            className="hover:text-blue-600 hover:underline transition"
          >
            {row.email}
          </a>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      render: () => <Badge label="Instructor" variant="info" />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Instructors"
        subtitle={`${instructors.length} instructor${instructors.length !== 1 ? "s" : ""} registered in the system.`}
      />

      {loading ? (
        <LoadingSkeleton variant="table" count={5} />
      ) : instructors.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
          <EmptyState
            title="No instructors found"
            description="Instructor accounts will appear here once they are created."
          />
        </div>
      ) : (
        <Table
          columns={columns}
          data={filtered}
          rowKey="_id"
          emptyMessage="No instructors match your search."
          search={{
            value: search,
            onChange: (val) => setSearch(val),
            placeholder: "Search by name or email…",
            onClear: () => setSearch(""),
          }}
        />
      )}
    </div>
  );
};

export default InstructorsPage;
