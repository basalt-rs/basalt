import { LanguageSyntax } from './editor/lang';
import { User } from './services/auth';

export type TestState = 'pass' | 'fail' | 'in-progress' | 'not-attempted';

export interface Test {
    input: string;
    output: string;
    visible: boolean;
}

export interface QuestionResponse {
    languages: Language[];
    title: string;
    points: number;
    description?: string;
    tests: Test[];
}

export interface SimpleOutput {
    stdout: string;
    stderr: string;
    status: number;
}
export type TestOutput =
    | { kind: 'pass' }
    | ({ kind: 'fail' } & (
          | { reason: 'timeout' }
          | ({ reason: 'incorrect-output' } & SimpleOutput)
          | ({ reason: 'crash' } & SimpleOutput)
      ));

export type TestResults =
    | { kind: 'other-error'; message: string }
    | { kind: 'internal-error' }
    | ({ kind: 'compile-fail' } & SimpleOutput)
    | { kind: 'individual'; tests: [TestOutput, Test][] };

export interface QuestionSubmissionState {
    state: TestState;
    remainingAttempts: number | null;
}

export interface SubmissionHistory {
    id: string;
    submitter: string;
    time: string;
    compile_fail: boolean;
    code: string;
    question_index: number;
    score: number;
    success: boolean;
}

export interface LeaderboardEntry {
    user: User;
    score: number;
    submissionStates: TestState[];
}

export interface Language {
    name: string;
    syntax: LanguageSyntax;
}

export interface Announcement {
    message: string;
    id: string;
    time: string;
    sender: string;
}
