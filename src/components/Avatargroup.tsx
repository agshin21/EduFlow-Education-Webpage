import { Avatar, AvatarGroup } from "@mui/material"
import { useEffect, useState } from "react"

import type { Course } from "../@types/types"
import TextRating from "./Rating"
import axios from "axios"

function Avatargroup() {
 const [courses, setCourses] = useState<Course[]>([])   
 useEffect(() => {
    axios
    .get("https://6a0818fefa9b27c848faa2b1.mockapi.io/courses/teachers")
    .then((res: any) => setCourses(res.data))
    .catch((err: any) => console.error(err))
 }, [])
  return (
    <div className="flex flex-col sm:flex-row gap-3">
    <AvatarGroup max={5} sx={{display: "flex", flexDirection: "row"}}>
      {
         courses.slice(0, 5).map((c) => {
            return (
              <Avatar alt={c.instructorName} src={c.avatar} sx={{width: {xs: 35, sm: 50}, height: {xs: 35, sm: 50}}}/>
            )
         })
      }
    </AvatarGroup>
    <div>
      <span className="text-[15px] sm:text-xl font-semibold">500+ Certificated Teachers</span>
      <div className="flex">
         <p className="text-[13px] sm:text-xl">{courses[13]?.rating}</p>
         <TextRating />
      </div>
     
    </div>
    </div>
  )
}

export default Avatargroup