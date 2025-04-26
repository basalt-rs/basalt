export type TestState = 'pass' | 'fail' | 'in-progress' | 'not-attempted';

export interface TestResponse {
    input: string;
    output: string;
    visible: boolean;
}

export interface QuestionResponse {
    languages?: string[];
    title: string;
    points: number;
    description?: string;
    tests: TestResponse[];
}

export interface Announcement {
    message: string;
    id: string;
    time: string;
    sender: string;
}
