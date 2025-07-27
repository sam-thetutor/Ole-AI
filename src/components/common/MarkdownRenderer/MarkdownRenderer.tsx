import React from 'react';
import ReactMarkdown from 'react-markdown';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          // Customize heading styles
          h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
          h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
          h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
          
          // Customize paragraph styles
          p: ({ children }) => <p className="markdown-p">{children}</p>,
          
          // Customize code blocks
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return <code className="markdown-inline-code">{children}</code>;
            }
            return <code className="markdown-code-block">{children}</code>;
          },
          
          // Customize pre blocks
          pre: ({ children }) => <pre className="markdown-pre">{children}</pre>,
          
          // Customize strong/bold text
          strong: ({ children }) => <strong className="markdown-strong">{children}</strong>,
          
          // Customize emphasis/italic text
          em: ({ children }) => <em className="markdown-em">{children}</em>,
          
          // Customize lists
          ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
          ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
          li: ({ children }) => <li className="markdown-li">{children}</li>,
          
          // Customize links
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="markdown-link">
              {children}
            </a>
          ),
          
          // Customize blockquotes
          blockquote: ({ children }) => (
            <blockquote className="markdown-blockquote">{children}</blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 