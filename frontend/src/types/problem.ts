export enum ProblemStatus {
  InProgress = "In Progress",
  Completed = "Completed",
  ToDo = "To Do",
}

export interface ProblemState {
  problemId: string;
  userId: string;
  title: string;
  status: ProblemStatus;
  code: string;
  languageId: string;
  questionImage: File | null;
  imageUrl: string | null;
  imagePreview: string;
}

export interface ProblemActions {
  setTitle: (title: string) => void;
  setQuestionImage: (file: File | null) => void;

  setCode: (code: string) => void;
  setLanguageId: (id: string) => void;

  saveProblem: () => Promise<void>;
  resetProblem: () => void;

  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
}
