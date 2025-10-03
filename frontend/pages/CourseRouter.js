import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CourseEditor from "./CourseEditor";
import CourseParticipant from "./CourseParticipant";

export default function CourseRouter() {
  const { courseName } = useParams();
  const decodedName = decodeURIComponent(courseName);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        // 🔹 First fetch courses to get metadata (including editing flag)
        const coursesRes = await fetch("http://127.0.0.1:5000/get_courses");
        const courses = await coursesRes.json();

        // Find the course by its display name
        const courseMeta = courses.find(c => c.name === decodedName);
        if (!courseMeta) {
          setCourse(null);
          setLoading(false);
          return;
        }

        // 🔹 Then fetch chapters for that course
        const chaptersRes = await fetch(
          `http://127.0.0.1:5000/get_chapters?course=${encodeURIComponent(decodedName)}`
        );
        const chapters = await chaptersRes.json();

        // Merge metadata + chapters
        setCourse({
          ...courseMeta,
          chapters
        });
      } catch (err) {
        console.error("Error fetching course:", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [decodedName]);

  if (loading) return <p className="text-center my-5">Loading...</p>;
  if (!course) return <p className="text-center my-5">Course not found</p>;

  console.log("Course data:", course);

  // 🔹 Render editor or participant based on editing flag
  return course.editing === "true" ? (
    <CourseEditor course={course} />
  ) : (
    <CourseParticipant course={course} />
  );
}
