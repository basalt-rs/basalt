import { humanTime, relativeTime } from './util';
import { useEffect, useState } from 'react';
import { Tooltip } from './util';

export const Elapsed = ({ time }: { time: Date | string }) => {
    const [text, setText] = useState(relativeTime(time));

    useEffect(() => {
        setText(relativeTime(time));
    }, [time]);

    return <Tooltip tooltip={humanTime(time)}>{text}</Tooltip>;
};
