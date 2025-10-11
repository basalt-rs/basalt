import { User } from './services/auth';

export type TestState = 'pass' | 'fail' | 'in-progress' | 'not-attempted';

export interface Test {
    input: string;
    output: string;
    visible: boolean;
}

export interface QuestionResponse {
    languages?: Languages[];
    title: string;
    points: number;
    description?: string;
    tests: Test[];
}

export type TestResultState = 'pass' | 'runtime-fail' | 'timed-out' | 'incorrect-output';
export type SubmissionState = 'started' | 'finished' | 'cancelled' | 'failed';
export type CompileResultState = 'no-compile' | 'success' | 'runtime-fail' | 'timed-out';

export interface TestResults {
    index: number;
    state: TestResultState;
    stdout: string;
    stderr: string;
    exitStatus: number;
    // milliseconds
    timeTaken: number;
}

export interface QuestionSubmissionState {
    state: TestState;
    remainingAttempts: number | null;
}

export interface SubmissionHistory {
    id: string;
    submitter: string;
    time: string;
    code: string;
    questionIndex: number;
    language: string;
    compileResult: CompileResultState;
    compileStdout: string;
    compileStderr: string;
    compileExitStatus: number;
    test_only: boolean;
    state: SubmissionState;
    score: number;
    passed: number;
    failed: number;
    success: boolean;
    // milliseconds
    timeTaken: number;
}

export interface LeaderboardEntry {
    user: User;
    score: number;
    submissionStates: TestState[];
}

export interface Languages {
    name: string;
    syntax: string;
}

export interface Announcement {
    message: string;
    id: string;
    time: string;
    sender: string;
}
