export interface DiscountPrice {
  id?: number | string,
  discountPrice: number | string;
}

export interface Course {
   id?: string | number,
   avatar: string,
   title: string,
   description: string,
   price: number,
   level: string,
   thumbnail: string,
   instructorName: string,
   aboutInstructor: string,
   rating: string | number,
   previewVideoProvider: string,
   previewVideoId: string,
   businessCategory: string,
   headline: string,
   testimonial: string,
   studentsCount: string | number,
   status: string,
   totalTime: string | number,
   startDate: string,
   endDate: string,
   topic_1?: Topic;
   topic_2?: Topic;
   topic_3?: Topic;
   previewCourse?: string;
}

export interface Review {
    id?: number | string,
    totalReviews: string
    studentsFullName: {
        student_1: string,
        student_2: string,
        student_3: string,
        student_4: string
    },
    studentsReview: {
        student_1: string,
        student_2: string,
        student_3: string,
        student_4: string
    }, 
    lessonRatings: {
        student_1: number | string,
        student_2: number | string,
        student_3: number | string,
        student_4: number | string
    },
    studentsProfileUrl: {
        student_1: string,
        student_2: string,
        student_3: string,
        student_4: string
    },
}

export type CartItem = {
    id?: string | number;
    title: string;
    price: number;
    discountPrice?: number | string;
    quantity: number;
    thumbnail: string;
    instructorName: string;
    description: string;
    startDate: string;
    endDate: string;
    totalTime: string | number;
    status: string;
};

export type CartState = {
    cart: CartItem[];
    count: number;
    addCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeCart: (id?: number | string) => void;
    clearCart: () => void;
};

export interface LessonGroup {
  lesson_1: string;
  lesson_2: string;
  lesson_3: string;
}

export interface Topic {
  title: string;
  lesson_syllabus: LessonGroup;
  lessonsTime: LessonGroup;
}

export interface Syllabus {
  id?: number | string;
  previewCourse: string;
  topic_1: Topic;
  topic_2: Topic;
  topic_3: Topic;
}

export type StatusInput = {
  id?: string | number,
  startDate: string,
  endDate: string
}

export interface CodePractice {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode: string;
  expectedOutput: string;
  language: 'javascript';
  difficulty: 'easy' | 'medium' | 'hard';
}

export type FlatLessonKind = 'lesson' | 'practice';

export interface FlatLesson {
  id: string;
  topicTitle: string;
  title: string;
  time: string;
  kind?: FlatLessonKind;
  practice?: CodePractice;
}

export type Description = {
    id?: number | string;
    courseDescription: string;
}
