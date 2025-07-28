'use client'

import ReactMarkdown from "react-markdown"

export default function ReactMarkdownPortfolio({children}: {children: string}) {
    return (
        <div className="markdown">
            <ReactMarkdown>{children}</ReactMarkdown>
        </div>
    )
}