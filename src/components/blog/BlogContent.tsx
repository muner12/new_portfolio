"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import CodeEditor to reduce initial page load
const CodeEditor = dynamic(() => import('./CodeEditor'), { ssr: false });

interface BlogContentProps {
  content: string;
}

/**
 * BlogContent component that renders blog content with code blocks
 * Parses content for both markdown-style code blocks and HTML pre tags
 */
const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  const [parsedContent, setParsedContent] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!content) {
      setParsedContent([]);
      return;
    }

    const contentParts: React.ReactNode[] = [];
    
    // Regex for markdown-style code blocks: ```language\ncode\n```
    const markdownCodeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    
    // Regex for HTML pre tags with data-language: <pre class="code-block" data-language="language"><code>code</code></pre>
    const htmlPreTagWithLangRegex = /<pre[^>]*class="code-block"[^>]*data-language="([^"]*)"[^>]*><code>([\s\S]*?)<\/code><\/pre>/gi;
    
    // Regex for Quill code blocks: <pre class="ql-syntax">code</pre>
    const quillCodeBlockRegex = /<pre[^>]*class="ql-syntax"[^>]*>([\s\S]*?)<\/pre>/gi;
    
    // Regex for plain HTML pre tags: <pre><code>code</code></pre> or <pre>code</pre>
    const htmlPreTagRegex = /<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/gi;
    const htmlPreOnlyRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/gi;
    
    // Combined regex to find all code blocks (markdown or HTML)
    const allCodeBlocks: Array<{ index: number; length: number; language: string; code: string; type: 'markdown' | 'html' }> = [];
    
    // Find markdown code blocks
    let match: RegExpExecArray | null;
    markdownCodeBlockRegex.lastIndex = 0;
    while ((match = markdownCodeBlockRegex.exec(content)) !== null) {
      allCodeBlocks.push({
        index: match.index,
        length: match[0].length,
        language: match[1] || 'text',
        code: match[2],
        type: 'markdown'
      });
    }
    
    // Find HTML pre tag code blocks with data-language attribute
    htmlPreTagWithLangRegex.lastIndex = 0;
    while ((match = htmlPreTagWithLangRegex.exec(content)) !== null) {
      allCodeBlocks.push({
        index: match.index,
        length: match[0].length,
        language: match[1] || 'text',
        code: match[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'),
        type: 'html'
      });
    }
    
    // Find Quill code blocks (pre.ql-syntax)
    quillCodeBlockRegex.lastIndex = 0;
    while ((match = quillCodeBlockRegex.exec(content)) !== null) {
      const currentMatch = match;
      // Skip if already matched by htmlPreTagWithLangRegex
      const alreadyMatched = allCodeBlocks.some(cb => 
        cb.index === currentMatch.index && cb.length === currentMatch[0].length
      );
      if (!alreadyMatched) {
        allCodeBlocks.push({
          index: currentMatch.index,
          length: currentMatch[0].length,
          language: 'text', // Quill doesn't store language, default to text
          code: currentMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'),
          type: 'html'
        });
      }
    }
    
    // Find plain HTML pre tags with code element
    htmlPreTagRegex.lastIndex = 0;
    while ((match = htmlPreTagRegex.exec(content)) !== null) {
      const currentMatch = match;
      // Skip if already matched by htmlPreTagWithLangRegex
      const alreadyMatched = allCodeBlocks.some(cb => 
        cb.index === currentMatch.index && cb.length === currentMatch[0].length
      );
      if (!alreadyMatched) {
        allCodeBlocks.push({
          index: currentMatch.index,
          length: currentMatch[0].length,
          language: 'text',
          code: currentMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'),
          type: 'html'
        });
      }
    }
    
    // Find plain HTML pre tags without code element
    htmlPreOnlyRegex.lastIndex = 0;
    while ((match = htmlPreOnlyRegex.exec(content)) !== null) {
      const currentMatch = match;
      // Skip if already matched
      const alreadyMatched = allCodeBlocks.some(cb => 
        cb.index === currentMatch.index && cb.length === currentMatch[0].length
      );
      if (!alreadyMatched) {
        allCodeBlocks.push({
          index: currentMatch.index,
          length: currentMatch[0].length,
          language: 'text',
          code: currentMatch[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'),
          type: 'html'
        });
      }
    }
    
    // Sort by index
    allCodeBlocks.sort((a, b) => a.index - b.index);
    
    // Build content parts
    let lastIndex = 0;
    
    allCodeBlocks.forEach((codeBlock, idx) => {
      // Add text before code block
      if (codeBlock.index > lastIndex) {
        const textBefore = content.substring(lastIndex, codeBlock.index);
        // Check if this text contains HTML that should be rendered
        if (textBefore.trim()) {
        contentParts.push(
            <div 
              key={`text-${lastIndex}`} 
              className="prose dark:prose-invert max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: textBefore }}
            />
        );
      }
      }

      // Add code block
      contentParts.push(
        <div key={`code-${codeBlock.index}`} className="mb-6">
          <CodeEditor
            code={codeBlock.code}
            language={codeBlock.language}
            readOnly={true}
          />
        </div>
      );

      lastIndex = codeBlock.index + codeBlock.length;
    });

    // Add remaining text after last code block
    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      if (remainingText.trim()) {
        contentParts.push(
          <div 
            key={`text-${lastIndex}`} 
            className="prose dark:prose-invert max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: remainingText }}
          />
        );
      }
    }
    
    // If no code blocks found, render content as HTML
    if (contentParts.length === 0) {
      contentParts.push(
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    setParsedContent(contentParts);
  }, [content]);

  return (
    <div className="blog-content">
      {parsedContent.length > 0 ? parsedContent : (
        <div className="prose dark:prose-invert max-w-none">
          {content}
        </div>
      )}
    </div>
  );
};

export default BlogContent;
