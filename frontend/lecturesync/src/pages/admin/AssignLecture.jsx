import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { CalendarCheck, AlertTriangle } from "lucide-react";
import courseService from "../../services/courseService.js";
import instructorService from "../../services/instructorService.js";
import lectureService from "../../services/lectureService.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import Button from "../../components/common/Button.jsx";
import Select from "../../components/common/Select.jsx";
import Input from "../../components/common/Input.jsx";
import LoadingSkeleton from "../../components/common/LoadingSkeleton.jsx";

// Zod schema
const today = new Date();
today.setHours(0, 0, 0, 0);

const schema = z.object({
  course: z.string().min(1, "Please select a course."),
  instructor: z.string().min(1, "Please select an instructor."),
  lectureDate: z
    .string()
    .min(1, "Please pick a date.")
    .refine((val) => {
      const picked = new Date(val);
      picked.setHours(0, 0, 0, 0);
      return picked >= today;
    }, "Lecture date cannot be in the past."),
});

const AssignLecturePage = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { course: "", instructor: "", lectureDate: "" },
  });

  const watchedCourse = watch("course");
  const watchedInstructor = watch("instructor");
  const watchedDate = watch("lectureDate");

  // Fetching dropdown data
  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      try {
        const [coursesRes, instructorsRes] = await Promise.all([
          courseService.getAllCourses(),
          instructorService.getAllInstructors(),
        ]);
        setCourses(coursesRes?.data ?? []);
        setInstructors(instructorsRes?.data ?? []);
      } catch (err) {
        toast.error(err?.message || "Failed to load data for form.");
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  // Form submission handler
  const onSubmit = async (data) => {
    setConflictError("");
    setSubmitting(true);
    try {
      await lectureService.assignLecture({
        course: data.course,
        instructor: data.instructor,
        lectureDate: data.lectureDate,
      });
      toast.success("Lecture assigned successfully!");
      reset();
    } catch (err) {
      const msg = err?.message || "Failed to assign lecture.";
      if (
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("conflict")
      ) {
        setConflictError(msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Derived data for summary card
  const selectedCourse = courses.find((c) => c._id === watchedCourse);
  const selectedInstructor = instructors.find(
    (i) => i._id === watchedInstructor,
  );
  const formattedDate = watchedDate
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(watchedDate + "T00:00:00"))
    : null;

  // Today in yyyy-MM-dd for min attribute
  const todayStr = today.toISOString().split("T")[0];

  const courseOptions = courses.map((c) => ({ value: c._id, label: c.name }));
  const instructorOptions = instructors.map((i) => ({
    value: i._id,
    label: `${i.name} — ${i.email}`,
  }));

  if (loadingData) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" count={1} className="rounded-3xl p-8" />
        <LoadingSkeleton variant="card" count={1} className="rounded-3xl p-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assign Lecture"
        subtitle="Schedule a lecture by selecting a course, instructor, and date."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: form  */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Lecture details
          </h2>

          {/* Conflict alert */}
          {conflictError && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" />
              <div>
                <p className="text-sm font-semibold">Scheduling conflict</p>
                <p className="text-sm">{conflictError}</p>
              </div>
            </div>
          )}

          <Select
            label="Course"
            name="course"
            options={courseOptions}
            placeholder="Select a course"
            required
            error={errors.course?.message}
            {...register("course")}
          />

          <Select
            label="Instructor"
            name="instructor"
            options={instructorOptions}
            placeholder="Select an instructor"
            required
            error={errors.instructor?.message}
            {...register("instructor")}
          />

          <Input
            label="Lecture Date"
            name="lectureDate"
            type="date"
            required
            min={todayStr}
            error={errors.lectureDate?.message}
            {...register("lectureDate")}
          />

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setConflictError("");
              }}
            >
              Reset
            </Button>
            <Button type="submit" loading={submitting} icon={CalendarCheck}>
              Assign Lecture
            </Button>
          </div>
        </form>

        {/* Right: summary card */}
        <div className="sticky top-6 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Assignment Summary
            </p>

            {/* Course */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Course
              </p>
              {selectedCourse ? (
                <div className="flex items-center gap-3">
                  {selectedCourse.image && (
                    <img
                      src={selectedCourse.image}
                      alt={selectedCourse.name}
                      className="h-10 w-14 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-medium text-slate-900">
                      {selectedCourse.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedCourse.level}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">Not selected</p>
              )}
            </div>

            <div className="border-t border-slate-100" />

            {/* Instructor */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Instructor
              </p>
              {selectedInstructor ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                    {selectedInstructor.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {selectedInstructor.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedInstructor.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">Not selected</p>
              )}
            </div>

            <div className="border-t border-slate-100" />

            {/* Date */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Date
              </p>
              {formattedDate ? (
                <p className="font-medium text-slate-900">{formattedDate}</p>
              ) : (
                <p className="text-sm text-slate-400 italic">Not selected</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Conflict detection
            </p>
            <p className="text-xs text-blue-700">
              The system will automatically block the assignment if the selected
              instructor already has a lecture scheduled on the same day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignLecturePage;
