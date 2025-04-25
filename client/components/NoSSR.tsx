import { PropsWithChildren, useEffect, useState } from 'react';

export const NoSSR = ({ children }: PropsWithChildren) => {
    const [canRender, setCanRender] = useState(false);
    useEffect(() => setCanRender(true), [setCanRender]);
    return canRender ? children : <span />;
};
