export type TestState = 'pass' | 'fail' | 'in-progress' | 'not-attempted';

export interface TestResponse {
    input: string;
    output: string;
}

export interface QuestionResponse {
    languages?: string[];
    title: string;
    description?: string;
    tests: TestResponse[];
}
