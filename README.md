# LectureSync - Online Lecture Scheduling Module

> A full-stack lecture scheduling module for managing courses, instructors, and conflict-free lecture assignments.

![React](https://img.shields.io/badge/React-19.2.7-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%205.2.1-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209.7.3-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)
![Status](https://img.shields.io/badge/status-active-brightgreen.svg)

## Table of Contents

- [Overview](#overview)
- [Demo / Screenshots](#demo--screenshots)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [API Routes / Endpoints](#api-routes--endpoints)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)

## Overview

LectureSync is a full-stack online lecture scheduling module built for institutes, academies, and training teams that need a clean way to manage courses, instructors, and lecture assignments from one dashboard. Admin users can create course listings, view instructors, schedule lectures, and monitor upcoming sessions through a dedicated admin panel.

The project solves a practical scheduling problem: keeping instructor calendars organized while preventing accidental double-booking. Its core differentiator is automatic clash detection on lecture assignment, which blocks an admin from assigning the same instructor to more than one lecture on the same date.

Instructor users get their own panel where they can view assigned lectures, track upcoming and completed sessions, and search their course schedule. The frontend and backend are separated cleanly, with the React app communicating with an Express REST API secured by JWT authentication.

## Demo / Screenshots

## Login Page

![Login Page](/screenshots/login_page.png)

## Admin Dashboard

### Dashboard Overview - 1

![Admin Dashboard - 1](/screenshots/admin_dashboard_1.png)

### Dashboard Overview - 2

![Admin Dashboard - 2](/screenshots/admin_dashboard_2.png)

### Course Page Overview - 1

![Course Page - 1](/screenshots/course_page_1.png)

### Course Page Overview - 2

![Course Page - 2](/screenshots/course_page_2.png)

### Course Page Overview - 3

![Course Page - 3](/screenshots/course_page_3.png)

### Lecture Page Overview

![Lecture Page - 1](/screenshots/lecture_page.png)

### Instructor Page Overview

![Instructor Page - 2](/screenshots/instructor_page.png)

## Instructor Dashboard

![Instructor Dashboard - 1](/screenshots/instructor_dashboard.png)


## Key Features

### Admin Panel

- Secure admin dashboard accessible only to administrators.
- Displays an overview of total courses, instructors, lectures, and upcoming lectures.
- Shows recently assigned lectures for quick monitoring.
- Manage courses by adding, editing, searching, and deleting course information.
- Upload and update course images while creating or editing a course.
- View and search the list of registered instructors.
- Assign lectures by selecting a course, instructor, and lecture date.

### Instructor Panel

- Secure dashboard accessible only to instructors.
- View all assigned lectures with course details, dates, and current status.
- Shows lecture statistics, including total, today's, upcoming, and completed lectures.
- Search assigned lectures by course name for quick access.

### Core Logic

- Secure user authentication using JWT.
- Role-based access control for Admin and Instructor accounts.
- Prevents instructors from being assigned multiple lectures on the same date.
- Validates user input on both the frontend and backend.
- Passwords are securely encrypted before being stored.
- Supports course image uploads with validation.
- Automatically includes authentication tokens in protected API requests.

## Tech Stack

| Category | Technology |
| --- | --- |
| Frontend | React 19.2.7, Vite 8.1.0, React Router DOM 7.18.0, Tailwind CSS 4.3.1, Lucide React 1.22.0, React Hook Form 7.80.0, Zod 4.4.3, Axios 1.18.1, React Hot Toast 2.6.0 |
| Backend | Node.js, Express 5.2.1, Mongoose 9.7.3, Express Validator 7.3.2, Multer 2.2.0, CORS 2.8.6, dotenv 17.4.2 |
| Database | MongoDB with Mongoose models |
| Authentication | JSON Web Tokens via jsonwebtoken 9.0.3, bcryptjs 3.0.3 password hashing, role-based middleware |
| Deployment | No deployment configuration is committed; frontend production API URL is configurable through Vite environment variables |

## Project Architecture

~~~text
LectureSync/
+-- backend/
|   +-- config/          # Database, Multer, Cloudinary config
|   +-- controllers/     # Request handlers
|   +-- middleware/      # Auth, role, upload, and error middleware
|   +-- models/          # Mongoose schemas
|   +-- routes/          # Express route definitions
|   +-- seed/            # Seed users script
|   +-- validators/      # Express Validator rules
|   `-- server.js        # Express app entrypoint
`-- frontend/
    `-- lecturesync/
        +-- src/
        |   +-- components/  # Admin, auth, common, and layout UI
        |   +-- context/     # Auth context provider
        |   +-- pages/       # Admin, auth, common, instructor pages
        |   +-- routes/      # React Router route map
        |   +-- services/    # API service wrappers
        |   `-- utils/       # API paths and Axios instance
        `-- vite.config.js
~~~

The project uses a split frontend/backend architecture. The React app owns the user interface, protected routes, form validation, and API service layer. The Express backend exposes REST endpoints for authentication, course management, instructor lookup, and lecture scheduling, with MongoDB storing users, courses, and lecture assignments.

## API Routes / Endpoints

Base API URL in development should point to the backend server, for example "http://localhost:5000".

### Auth

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | /api/auth/login | Login with email and password; returns JWT and user profile | No |
| GET | /api/auth/profile | Get the currently logged-in user's profile | Yes |

### Instructors

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| GET | /api/instructors | Get all users with the instructor role | No |
| GET | /api/instructors/:id | Get one instructor by ID | No |

### Courses

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | /api/courses | Create a new course with required image upload | Yes, Admin |
| GET | /api/courses | Get all courses sorted by newest first | Yes |
| GET | /api/courses/:id | Get a single course by ID | Yes |
| PUT | /api/courses/:id | Update course details and optionally replace image | Yes, Admin |
| DELETE | /api/courses/:id | Delete a course by ID | Yes, Admin |

### Lectures

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | /api/lectures | Assign a lecture to a course and instructor after validation and clash detection | Yes, Admin |
| GET | /api/lectures | Get all lectures across the application | Yes, Admin |
| GET | /api/lectures/my-lectures | Get lectures assigned to the logged-in instructor | Yes |
| DELETE | /api/lectures/:id | Delete a lecture assignment by ID | Yes, Admin |

## Database Schema

### User

| Field | Type | Description |
| --- | --- | --- |
| name | String | Required user name, trimmed |
| email | String | Required unique lowercase email, trimmed |
| password | String | Required hashed password, minimum 6 characters, excluded from default queries |
| role | String | Required role enum: "admin" or "instructor" |
| createdAt | Date | Automatically added by Mongoose timestamps |
| updatedAt | Date | Automatically added by Mongoose timestamps |

### Course

| Field | Type | Description |
| --- | --- | --- |
| name | String | Required course name, trimmed |
| level | String | Required level enum: "Beginner", "Intermediate", "Advanced" |
| description | String | Required course description, trimmed |
| image | String | Required course image URL |
| createdAt | Date | Automatically added by Mongoose timestamps |
| updatedAt | Date | Automatically added by Mongoose timestamps |

### Lecture

| Field | Type | Description |
| --- | --- | --- |
| course | ObjectId, ref Course | Required relationship to the scheduled course |
| instructor | ObjectId, ref User | Required relationship to the instructor user |
| lectureDate | Date | Required scheduled lecture date |
| createdAt | Date | Automatically added by Mongoose timestamps |
| updatedAt | Date | Automatically added by Mongoose timestamps |

### Relationships

- A Lecture belongs to one Course.
- A Lecture belongs to one instructor, represented by a User with role "instructor".
- Admin users are also stored in the User collection and are authorized through the role field.
- Lecture queries populate course and instructor data for admin views; instructor-specific lecture queries populate the course name.

## Getting Started

### Prerequisites

- Node.js 18 or newer recommended
- MongoDB running locally or a MongoDB Atlas connection string
- npm or yarn

### 1. Clone the repository

~~~bash
git clone <your-repository-url>
cd LectureSync
~~~

### 2. Backend setup

~~~bash
cd backend
npm install
~~~

Create "backend/.env" and add the required backend variables. This repository does not currently include a ".env.example", so use the variable table below as the guide.

~~~bash
npm run dev
~~~

Backend scripts verified from "backend/package.json":

~~~json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
~~~

The backend listens on PORT from ".env", or falls back to 5000.

### 3. Frontend setup

~~~bash
cd frontend/lecturesync
npm install
~~~

Create "frontend/lecturesync/.env" and point the frontend to your backend:

~~~bash
VITE_API_URL_DEV=http://localhost:5000
~~~

Then run the Vite dev server:

~~~bash
npm run dev
~~~

Frontend scripts verified from "frontend/lecturesync/package.json":

~~~json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
~~~

Open the frontend at the Vite URL printed in the terminal, usually:

~~~bash
http://localhost:5173
~~~

> Note: the frontend code defaults to "http://localhost:3000" in development when VITE_API_URL_DEV is not set. If your backend runs on the default 5000, set VITE_API_URL_DEV=http://localhost:5000.

## Environment Variables

No ".env.example" files were found. The backend has a local ".env" file; only variable names are documented here, not secret values.

### Backend .env

| Variable | Description | Example |
| --- | --- | --- |
| MONGODB_URI | MongoDB connection string used by Mongoose | mongodb://127.0.0.1:27017/lecturesync |
| PORT | Express server port | 5000 |
| NODE_ENV | Runtime environment | development |
| JWT_SECRET | Secret used to sign and verify JWTs | replace-with-a-long-random-secret |
| JWT_EXPIRE | Present in current .env; token utility currently reads JWT_EXPIRES_IN instead | 7d |
| JWT_EXPIRES_IN | Optional token expiry name used by utils/generateToken.js | 7d |
| MAX_FILE_SIZE | Present in current .env; Multer currently enforces 5 MB in code | 5242880 |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name used by config/cloudinary.js | your-cloud-name |
| CLOUDINARY_API_KEY | Cloudinary API key used by config/cloudinary.js | your-api-key |
| CLOUDINARY_API_SECRET | Cloudinary API secret used by config/cloudinary.js | your-api-secret |
| SERVER_URL | Optional base URL used when generating local uploaded image URLs | http://localhost:5000 |

### Frontend .env

| Variable | Description | Example |
| --- | --- | --- |
| VITE_API_URL_DEV | Development API base URL used by Axios | http://localhost:5000 |
| VITE_API_URL | Production API base URL used by Axios | https://your-backend-url.onrender.com |

## Folder Structure

~~~text
backend/
+-- .env
+-- config/
|   +-- cloudinary.js
|   +-- db.js
|   `-- multer.js
+-- controllers/
|   +-- auth.controller.js
|   +-- course.controller.js
|   +-- instructor.controller.js
|   `-- lecture.controller.js
+-- middleware/
|   +-- auth.middleware.js
|   +-- error.middleware.js
|   +-- role.middleware.js
|   `-- upload.middleware.js
+-- models/
|   +-- Course.js
|   +-- Lecture.js
|   `-- User.js
+-- routes/
|   +-- auth.routes.js
|   +-- course.routes.js
|   +-- instructor.routes.js
|   `-- lecture.routes.js
+-- seed/
|   `-- seedUsers.js
+-- utils/
|   `-- generateToken.js
+-- validators/
|   +-- course.validator.js
|   `-- lecture.validator.js
+-- package.json
`-- server.js
~~~

~~~text
frontend/lecturesync/
+-- src/
|   +-- App.jsx
|   +-- assets/
|   |   `-- hero.png
|   +-- components/
|   |   +-- admin/
|   |   |   +-- DashboardStats.jsx
|   |   |   +-- RecentLecturesTable.jsx
|   |   |   `-- UpcomingLecturesCard.jsx
|   |   +-- auth/
|   |   |   +-- LoginForm.jsx
|   |   |   `-- ProtectedRoute.jsx
|   |   +-- common/
|   |   |   +-- Badge.jsx
|   |   |   +-- Button.jsx
|   |   |   +-- Card.jsx
|   |   |   +-- ConfirmDeleteModal.jsx
|   |   |   +-- Modal.jsx
|   |   |   +-- Table.jsx
|   |   |   `-- form, loading, search, pagination, and display components
|   |   `-- layouts/
|   |       +-- AdminLayout.jsx
|   |       +-- Header.jsx
|   |       +-- InstructorLayout.jsx
|   |       `-- Sidebar.jsx
|   +-- context/
|   |   `-- AuthContext.jsx
|   +-- pages/
|   |   +-- admin/
|   |   |   +-- AddCourse.jsx
|   |   |   +-- AssignLecture.jsx
|   |   |   +-- Courses.jsx
|   |   |   +-- Dashboard.jsx
|   |   |   +-- EditCourse.jsx
|   |   |   `-- Instructors.jsx
|   |   +-- auth/
|   |   |   `-- LoginPage.jsx
|   |   +-- common/
|   |   |   +-- NotFound.jsx
|   |   |   `-- Unauthorized.jsx
|   |   `-- instructor/
|   |       `-- Dashboard.jsx
|   +-- routes/
|   |   `-- AppRoutes.jsx
|   +-- services/
|   |   +-- authService.js
|   |   +-- courseService.js
|   |   +-- instructorService.js
|   |   `-- lectureService.js
|   +-- utils/
|   |   +-- apiPath.js
|   |   `-- axiosInstance.js
|   +-- index.css
|   `-- main.jsx
+-- package.json
`-- vite.config.js
~~~

