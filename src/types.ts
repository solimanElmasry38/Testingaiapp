export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string; // Tailwind color class suffix like "blue", "indigo", "yellow", "teal"
  questions: Question[];
}

export interface AnswerState {
  questionId: string;
  selectedIdx: number;
  isCorrect: boolean;
  timestamp: string;
}

export interface QuizSession {
  categoryId: string;
  currentQuestionIdx: number;
  answers: Record<string, number>; // questionId -> selectedIndex
  score: number;
  isCompleted: boolean;
  timeSpentSeconds: number;
  streakCount: number;
}
