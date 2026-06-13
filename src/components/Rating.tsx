import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import type { Course } from '../@types/types';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';

export default function TextRating() {
  const value = 4.5;
  const [ courses, setCourses ] = useState<Course[]>([])
  useEffect(() => {
    axios
    .get("https://6a0818fefa9b27c848faa2b1.mockapi.io/courses/teachers")
    .then((res) => setCourses(res.data))
    .catch((err) => console.error(err))
  }, [])
  return (
    <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
      <Rating
        name="text-feedback"
        value={value}
        readOnly
        precision={0.5}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit"/>}
        sx={{fontSize: {xs: 15, sm: 25}}}/>
    </Box>
  );
}
