'use client'

import ReactMarkdown from "react-markdown"

export default function ReactMarkdownPortfolio({children}: {children: string}) {
    return (
        <ReactMarkdown className="markdown">{children}</ReactMarkdown>
    )
}