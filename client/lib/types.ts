export type TestState = 'pass' | 'fail' | 'in-progress' | 'not-attempted';

export interface TestResponse {
    input: string;
    output: string;
    visible: boolean;
}

export interface QuestionResponse {
    languages?: Languages[];
    title: string;
    points: number;
    description?: string;
    tests: TestResponse[];
}

export interface Languages {
    name: string;
    syntax: string;
}
