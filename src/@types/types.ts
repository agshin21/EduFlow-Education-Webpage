export interface DiscountPrice {
  id: number | string,
  discountPrice: number | string;
}

export interface Course {
   id: string | number,
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
   endDate: string
}

export interface Review {
    id: number | string,
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
    id: string | number;
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
    removeCart: (id: number | string) => void;
    clearCart: () => void;
};

