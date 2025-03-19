import '../app/syntax.css';

export function Markdown({ markdown }: { markdown: string }) {
    return (
        <article
            className="prose prose-slate dark:prose-invert
                prose-code:before:content-[''] prose-code:after:content-['']
            "
            dangerouslySetInnerHTML={{ __html: markdown }}
        />
    );
}
