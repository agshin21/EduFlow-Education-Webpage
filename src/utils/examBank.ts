import type { Exam } from "../@types/types";

export function buildExamForTopic(topicTitle: string, topicIndex: number, courseId?: string): Exam {
  return {
    id: `${courseId ?? "c"}-topic-${topicIndex}-exam`,
    title: `${topicTitle} — Assessment`,
    passScore: 60,
    questions: [
      {
        id: `q${topicIndex}-1`,
        question: `What is the main focus of the "${topicTitle}" section?`,
        options: [
          "It has no practical application",
          "It builds a core skill covered across these lessons",
          "It is only about styling",
          "It replaces the need for testing",
        ],
        correctIndex: 1,
        explanation: "This topic focuses on a core, applicable skill built across its lessons.",
      },
      {
        id: `q${topicIndex}-2`,
        question: "After finishing this topic you should be able to:",
        options: [
          "Skip the fundamentals",
          "Apply the concepts in a real project",
          "Ignore best practices",
          "Avoid using the tools shown",
        ],
        correctIndex: 1,
        explanation: "The lessons are designed to be immediately applicable.",
      },
      {
        id: `q${topicIndex}-3`,
        question: "Which is a good practice reinforced throughout this topic?",
        options: [
          "Writing unclear code",
          "Following the demonstrated patterns and conventions",
          "Avoiding documentation",
          "Never reviewing your work",
        ],
        correctIndex: 1,
      },
    ],
  };
}
