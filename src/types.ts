export type ExerciseType = 'tap' | 'arrange' | 'fill' | 'listen' | 'speak';

export interface Answer {
  text: string;
  emoji?: string;
  correct: boolean;
}

export interface Exercise {
  id?: string;
  type: ExerciseType;
  q?: string; // Question or instruction
  char?: string; // Character / emoji icon representation
  answers?: Answer[]; // For 'tap' type
  words?: string[]; // For 'arrange' type
  correct?: string; // For 'arrange' correct sentence
  mn?: string; // Mongolian translation hint
  before?: string; // For 'fill' type
  blank?: string; // For 'fill' correct token
  after?: string; // For 'fill' type suffix
  hint?: string; // Hint string
  options?: string[]; // Options for 'fill' choice
}

export interface Lesson {
  id: string;
  icon: string;
  label: string;
  done: boolean;
  locked: boolean;
  exercises: Exercise[];
}

export interface Unit {
  id: number;
  color: string;
  colorDark: string;
  colorPale: string;
  icon: string;
  label: string;
  name: string;
  lessons: Lesson[];
}

export interface LeaderboardItem {
  name: string;
  avatar: string;
  xp: number;
  me: boolean;
}

export interface FeedbackState {
  ok: boolean;
  hint: string;
}
