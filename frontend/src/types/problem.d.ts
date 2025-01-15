export interface ProblemState {
    problemId: int;
    userId: string;
    title: string;
    code: string;
    languageId: string;
    questionImage: File | null;
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