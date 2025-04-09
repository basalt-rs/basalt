export type TestState = 'pass' | 'fail' | 'in-progress' | 'not-attempted';

export interface Test {
    input: string;
    output: string;
    visible: boolean;
}

export interface QuestionResponse {
    languages?: Language[];
    title: string;
    points: number;
    description?: string;
    tests: Test[];
}

export interface Language {
    language: string;
    syntax: string;
}

export interface SimpleOutput {
    stdout: string;
    stderr: string;
    status: number;
}
export type TestOutput = 'Pass' | { Fail: 'Timeout' | { IncorrectOutput: SimpleOutput } | { Crash: SimpleOutput }; };
export type TestResults =
    | { kind: 'internal-error'; }
    | ({ kind: 'compile-fail'; } & SimpleOutput)
    | { kind: 'individual'; tests: [TestOutput, Test][]; };
