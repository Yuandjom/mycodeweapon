export enum ProblemStatus {
  InProgress = "In Progress",
  Completed = "Completed",
  ToDo = "To Do",
}

export interface ProblemState {
  id: string;
  userId: string;
  title: string;
  status: ProblemStatus;
  code: string;
  languageId: string;
  questionImage: File | null;
  imageUrl: string | null;
  imagePreview: string;
  updated_at: string; // supabase `timestampz` serialised to string in ISO 8601 eg "2025-02-14T10:00:00.000Z"
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
