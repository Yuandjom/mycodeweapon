export type Problem = {
    id: number; // primary key
    title: string;
    difficulty: string;
    question: string;
    constraints: string[]
    source: string | null;
}

export type TestCase = {
    id: number; // primary key -> foreign key to TestCases table
    testcases: Record<string, any>;
  };