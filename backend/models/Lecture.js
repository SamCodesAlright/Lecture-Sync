import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lectureDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
