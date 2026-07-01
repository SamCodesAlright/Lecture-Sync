import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
import LoadingSkeleton from "../../components/common/LoadingSkeleton.jsx";

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

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingCourse, setLoadingCourse] = useState(true);
  const [existingImage, setExistingImage] = useState(null); // Cloudinary URL
  const [newImageFile, setNewImageFile] = useState(null); // File obj if replacing
  const [imagePreview, setImagePreview] = useState(null); // blob URL for new file
  const [imageError, setImageError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const watchedName = watch("name") || "";
  const watchedLevel = watch("level") || "";
  const watchedDescription = watch("description") || "";

  // Fetching course data
  useEffect(() => {
    const load = async () => {
      setLoadingCourse(true);
      try {
        const res = await courseService.getCourseById(id);
        const course = res?.data;
        if (!course) throw new Error("Course not found.");

        reset({
          name: course.name,
          level: course.level,
          description: course.description,
        });
        setExistingImage(course.image || null);
      } catch (err) {
        toast.error(err?.message || "Failed to load course.");
        navigate("/admin/courses");
      } finally {
        setLoadingCourse(false);
      }
    };
    load();
  }, [id, reset, navigate]);

  // Image handlers
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
    setNewImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeNewImage = () => {
    setNewImageFile(null);
    setImagePreview(null);
    setImageError("");
  };

  // Submit handler
  const onSubmit = async (data) => {
    // If there's no existing image AND no new one provided, block
    if (!existingImage && !newImageFile) {
      setImageError("A course image is required.");
      return;
    }

    setSubmitting(true);
    try {
      // Only include image in payload when a new file was selected
      const payload = newImageFile
        ? { ...data, image: newImageFile }
        : { ...data };

      await courseService.updateCourse(id, payload);
      toast.success("Course updated successfully!");
      navigate("/admin/courses");
    } catch (err) {
      toast.error(err?.message || "Failed to update course. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Determining which image to show in preview
  const previewSrc = imagePreview || existingImage;

  if (loadingCourse) {
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
        title="Edit Course"
        subtitle="Update the details for this course."
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
          {/* Left: form fields */}
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
              placeholder="Describe what students will learn…"
              rows={5}
              required
              maxLength={1000}
              error={errors.description?.message}
              {...register("description")}
            />

            {/* Image section*/}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Course Image
                </label>
                <span className="text-xs text-slate-500">
                  Leave unchanged to keep the current image
                </span>
              </div>

              {/* Current / new preview */}
              {previewSrc && (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                  <img
                    src={previewSrc}
                    alt="Course"
                    className="h-48 w-full object-cover"
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={removeNewImage}
                      className="absolute right-3 top-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm hover:bg-slate-900/90 transition"
                    >
                      Revert
                    </button>
                  )}
                </div>
              )}

              {/* Upload zone */}
              <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Upload className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  {existingImage
                    ? "Upload a replacement image"
                    : "Upload an image"}
                </p>
                <p className="text-xs text-slate-500">
                  JPEG, PNG, WEBP · max 5 MB
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>

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
                Save Changes
              </Button>
            </div>
          </div>

          {/* Right: live preview */}
          <div className="space-y-4">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Live Preview
                </p>

                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                  {previewSrc ? (
                    <img
                      src={previewSrc}
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
                      {watchedDescription ||
                        "Course description will appear here."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 text-sm">
                <p className="font-semibold text-amber-900 mb-1">
                  Editing mode
                </p>
                <p className="text-xs text-amber-700">
                  Leave the image field blank to keep the existing image. Upload
                  a new file only if you want to replace it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCoursePage;
