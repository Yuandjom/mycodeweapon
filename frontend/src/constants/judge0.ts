export const DEFAULT_MEMORY_LIMIT = 128000;
export const DEFAULT_TIME_LIMIT = 5;

// map of Judge0 language_id -> monaco editor language
export const judge0ToMonacoMap : {[key: string]: string}= {
    "75" : "c",
    "48" : "c",
    "49" : "c",
    "50" : "c",

    "76" : "cpp",
    "52" : "cpp",
    "53" : "cpp",
    "54" : "cpp",

    "51" : "csharp",

    "60" : "go",

    "62" : "java",

    "63" : "javascript",
    "74" : "typescript",

    "78" : "kotlin",

    "64" : "lua",

    "85" : "perl",

    "70" : "python",
    "71" : "python",

    "72" : "ruby",

    "73" : "rust",

    "82" : "sql",

    "83" : "swift",

}