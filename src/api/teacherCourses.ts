import type {Course, Syllabus} from "../@types/types"

import axios from "axios"

const COURSES_URL = "https://6a0818fefa9b27c848faa2b1.mockapi.io/courses/teachers"
const SYLLABUS_URL = "https://6a2ec8d2c9776ca6c0c4f04a.mockapi.io/lessons/v1/previews"

export async function createCourseWithSyllabus(
  course: Omit<Course, "id">,
  syllabus: Omit<Syllabus, "id">
): Promise<Course> {
  const {data: createdCourse} = await axios.post<Course>(COURSES_URL, course)
  
  await axios.post(SYLLABUS_URL, {
    ...syllabus,
    id: createdCourse.id,
  })

  return createdCourse
}
