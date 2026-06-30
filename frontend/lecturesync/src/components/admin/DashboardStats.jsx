import React from "react";
import { BookOpen, Users, CalendarDays, Presentation } from "lucide-react";
import StatCard from "../common/StatCard.jsx";

const DashboardStats = ({ totals }) => {
  const cards = [
    {
      title: "Total Courses",
      value: totals.courses,
      description: "Active course listings in the system.",
      icon: <BookOpen className="h-6 w-6" aria-hidden="true" />,
    },
    {
      title: "Total Instructors",
      value: totals.instructors,
      description: "Instructors available for lecture assignments.",
      icon: <Users className="h-6 w-6" aria-hidden="true" />,
    },
    {
      title: "Total Lectures",
      value: totals.lectures,
      description: "Lectures scheduled across all courses.",
      icon: <Presentation className="h-6 w-6" aria-hidden="true" />,
    },
    {
      title: "Upcoming Lectures",
      value: totals.upcoming,
      description: "Lectures scheduled for today and the future.",
      icon: <CalendarDays className="h-6 w-6" aria-hidden="true" />,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          description={card.description}
          icon={card.icon}
          className="hover:-translate-y-0.5 hover:shadow-md transition"
        />
      ))}
    </div>
  );
};

export default DashboardStats;
