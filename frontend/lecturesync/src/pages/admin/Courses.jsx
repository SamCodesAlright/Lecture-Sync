import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import courseService from "../../services/courseService.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import Table from "../../components/common/Table.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import LoadingSkeleton from "../../components/common/LoadingSkeleton.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal.jsx";

const LEVEL_VARIANT = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // course to delete
  const [deleting, setDeleting] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await courseService.getAllCourses();
      setCourses(res?.data ?? []);
    } catch (err) {
      toast.error(err?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filtered = useMemo(
    () =>
      courses.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [courses, search],
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await courseService.deleteCourse(deleteTarget._id);
      toast.success(`"${deleteTarget.name}" deleted successfully.`);
      setCourses((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.message || "Failed to delete course.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: "Course",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="h-10 w-16 rounded-xl object-cover shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="h-10 w-16 flex-shrink-0 rounded-xl bg-slate-100 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-slate-400" />
            </div>
          )}
          <span className="font-medium text-slate-900 leading-tight">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      header: "Level",
      accessor: "level",
      render: (row) => (
        <Badge
          label={row.level}
          variant={LEVEL_VARIANT[row.level] ?? "default"}
        />
      ),
    },
    {
      header: "Description",
      accessor: "description",
      render: (row) => (
        <p className="max-w-xs truncate text-slate-600">{row.description}</p>
      ),
    },
    {
      header: "Actions",
      accessor: "_id",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/courses/edit/${row._id}`}>
            <Button
              variant="outline"
              size="sm"
              icon={Pencil}
              aria-label={`Edit ${row.name}`}
            >
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => setDeleteTarget(row)}
            aria-label={`Delete ${row.name}`}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        subtitle="Browse, create, and manage all course listings."
        action={
          <Link to="/admin/courses/add">
            <Button icon={Plus}>Add Course</Button>
          </Link>
        }
      />

      {loading ? (
        <LoadingSkeleton variant="table" count={5} />
      ) : courses.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
          <EmptyState
            title="No courses yet"
            description="Get started by adding your first course."
            action={
              <Link to="/admin/courses/add">
                <Button icon={Plus}>Add Course</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <Table
          columns={columns}
          data={filtered}
          rowKey="_id"
          emptyMessage="No courses match your search."
          search={{
            value: search,
            onChange: (val) => setSearch(val),
            placeholder: "Search courses…",
            onClear: () => setSearch(""),
          }}
        />
      )}

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Course"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmText={deleting ? "Deleting…" : "Delete"}
      />
    </div>
  );
};

export default CoursesPage;
