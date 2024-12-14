export type CodeSubmissionREQ = {
    source_code: string;
    language_id: string;
    stdin?: string;
    expected_output?: string;
    memory_limit: number;
    time_limit: number;
}

export type CodeSubmissionRES = {
    stdout: string;
    time: string;
    memory: number;
    stderr: string | null;
    token: string;
    compile_output: string | null;
    message: string | null;
    status: {
        id: number;
        description: string;
    }
}

export type AvailLanguage = {
    id: string;
    name: string; // "Go (1.13.5)"
}
