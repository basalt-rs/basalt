import { humanTime, relativeTime } from './util';
import { useEffect, useState } from 'react';
import { Tooltip } from './util';

export const Elapsed = ({ time }: { time: Date | string }) => {
    const [text, setText] = useState(relativeTime(time));

    useEffect(() => {
        setText(relativeTime(time));
        const timer = setInterval(() => {
            setText(relativeTime(time));
        }, 1000);
        return () => clearTimeout(timer);
    }, [time]);

    return <Tooltip tooltip={humanTime(time)}>{text}</Tooltip>;
};
