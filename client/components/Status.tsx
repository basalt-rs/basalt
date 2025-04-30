import { TestState } from '@/lib/types';
import { Circle } from 'lucide-react';
import { Tooltip } from './util';

const color = (state: TestState) => {
    const map: Record<TestState, string> = {
        pass: 'text-pass',
        fail: 'text-fail',
        'in-progress': 'text-in-progress',
        'not-attempted': 'text-not-attempted',
    };

    return map[state];
};

const name = (state: TestState) => {
    const map: Record<TestState, string> = {
        pass: 'Pass',
        fail: 'Fail',
        'in-progress': 'In Progress',
        'not-attempted': 'Not Attempted',
    };

    return map[state];
};

export const Status = ({
    status,
    showLabel = false,
    size = 18,
}: {
    status: TestState | undefined;
    showLabel?: boolean;
    size?: number;
}) => {
    if (showLabel) {
        return (
            <span className="flex flex-row items-center gap-2">
                <Circle
                    className={status ? color(status) : ''}
                    strokeWidth={0}
                    size={size}
                    color="currentColor"
                    fill="currentColor"
                />
                {status ? name(status) : 'Loading...'}
            </span>
        );
    } else {
        return (
            <Tooltip tooltip={status ? name(status) : 'Loading...'} delayDuration={100}>
                <Circle
                    className={status ? color(status) : ''}
                    strokeWidth={0}
                    size={size}
                    color="currentColor"
                    fill="currentColor"
                />
            </Tooltip>
        );
    }
};
