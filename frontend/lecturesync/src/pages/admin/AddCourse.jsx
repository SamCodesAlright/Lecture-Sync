import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ArrowLeft, Upload, BookOpen } from "lucide-react";
import courseService from "../../services/courseService.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Select from "../../components/common/Select.jsx";
import TextArea from "../../components/common/TextArea.jsx";

const LEVEL_OPTIONS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const schema = z.object({
  name: z
    .string()
    .min(2, "Course name must be at least 2 characters.")
    .max(100, "Course name cannot exceed 100 characters."),
  level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    errorMap: () => ({ message: "Please select a course level." }),
  }),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description cannot exceed 1000 characters."),
});

const AddCoursePage = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", level: "", description: "" },
  });

  const watchedName = watch("name");
  const watchedLevel = watch("level");
  const watchedDescription = watch("description");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setImageError("Only JPEG, PNG, JPG, and WEBP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be smaller than 5 MB.");
      return;
    }

    setImageError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
  };

  const onSubmit = async (data) => {
    if (!imageFile) {
      setImageError("A course image is required.");
      return;
    }

    setSubmitting(true);
    try {
      await courseService.createCourse({ ...data, image: imageFile });
      toast.success("Course created successfully!");
      navigate("/admin/courses");
    } catch (err) {
      toast.error(err?.message || "Failed to create course. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Course"
        subtitle="Create a new course by filling out the form below."
        action={
          <Link to="/admin/courses">
            <Button variant="outline" icon={ArrowLeft}>
              Back to Courses
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* ── Left: form fields ── */}
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Course details
            </h2>

            <Input
              label="Course Name"
              name="name"
              placeholder="e.g. Introduction to Machine Learning"
              required
              error={errors.name?.message}
              {...register("name")}
            />

            <Select
              label="Level"
              name="level"
              options={LEVEL_OPTIONS}
              placeholder="Select a level"
              required
              error={errors.level?.message}
              {...register("level")}
            />

            <TextArea
              label="Description"
              name="description"
              placeholder="Describe what students will learn in this course…"
              rows={5}
              required
              maxLength={1000}
              error={errors.description?.message}
              {...register("description")}
            />

            {/* ── Image upload ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Course Image <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-slate-500">
                  JPEG, PNG, WEBP · max 5 MB
                </span>
              </div>

              {imagePreview ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-48 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm hover:bg-slate-900/90 transition"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-slate-500">
                      or drag &amp; drop here
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              )}

              {imageError && (
                <p className="text-sm text-rose-600">{imageError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
              <Link to="/admin/courses">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" loading={submitting}>
                Create Course
              </Button>
            </div>
          </div>

          {/* ── Right: live preview ── */}
          <div className="space-y-4">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Live Preview
                </p>

                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                      <BookOpen className="h-10 w-10 text-slate-300" />
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900 truncate">
                        {watchedName || "Course name"}
                      </p>
                      {watchedLevel && (
                        <span
                          className={`flex-shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            watchedLevel === "Beginner"
                              ? "bg-emerald-100 text-emerald-700"
                              : watchedLevel === "Intermediate"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {watchedLevel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-3">
                      {watchedDescription || "Course description will appear here."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-800">
                <p className="font-semibold mb-1">Tips</p>
                <ul className="space-y-1 text-xs list-disc list-inside text-blue-700">
                  <li>Use a descriptive, specific course name</li>
                  <li>Choose a level that matches your target audience</li>
                  <li>Upload a clear, high-quality image (16:9 ratio works best)</li>
                  <li>Write a description that explains what students will gain</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCoursePage;
