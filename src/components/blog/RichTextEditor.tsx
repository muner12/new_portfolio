"use client";

import { useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  editorRef?: React.RefObject<any>;
}

/**
 * Rich text editor component using Quill
 * Supports formatting, code blocks, images, links, and more
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your blog post content here...',
  height = '500px',
  editorRef
}: RichTextEditorProps) {
  const internalQuillRef = useRef<any>(null);
  const quillRef = editorRef || internalQuillRef;

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'align': [] }],
        ['link', 'image', 'video', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
      handlers: {
        'code-block': function() {
          const quill = quillRef.current?.getEditor();
          if (!quill) return;
          
          const range = quill.getSelection(true);
          if (range) {
            // Insert code block
            quill.insertText(range.index, '\n', 'user');
            quill.insertText(range.index + 1, '// Enter your code here\n', 'user');
            quill.formatText(range.index + 1, 25, 'code-block', true);
            quill.setSelection(range.index + 26);
          }
        }
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  // Quill formats
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'script', 'align',
    'link', 'image', 'video', 'code-block',
    'color', 'background',
    'code'
  ];

  return (
    <div className="rich-text-editor-wrapper">
      <style jsx global>{`
        .rich-text-editor-wrapper .ql-container {
          font-family: inherit;
          font-size: 16px;
          height: ${height};
          background: white;
        }
        
        .dark .rich-text-editor-wrapper .ql-container {
          background: #111827;
          color: #f9fafb;
        }
        
        .rich-text-editor-wrapper .ql-editor {
          min-height: ${height};
          color: inherit;
        }
        
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .dark .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #6b7280;
        }
        
        .rich-text-editor-wrapper .ql-toolbar {
          background: #f9fafb;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .dark .rich-text-editor-wrapper .ql-toolbar {
          background: #1f2937;
          border-bottom-color: #374151;
        }
        
        .rich-text-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: #374151;
        }
        
        .dark .rich-text-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: #9ca3af;
        }
        
        .rich-text-editor-wrapper .ql-toolbar .ql-fill {
          fill: #374151;
        }
        
        .dark .rich-text-editor-wrapper .ql-toolbar .ql-fill {
          fill: #9ca3af;
        }
        
        .rich-text-editor-wrapper .ql-toolbar button:hover,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active {
          color: #3b82f6;
        }
        
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: #3b82f6;
        }
        
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: #3b82f6;
        }
        
        /* Code block styling */
        .rich-text-editor-wrapper .ql-editor pre.ql-syntax {
          background-color: #1e1e1e;
          color: #d4d4d4;
          border-radius: 0.375rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .rich-text-editor-wrapper .ql-editor code,
        .rich-text-editor-wrapper .ql-editor pre {
          background-color: #f3f4f6;
          border-radius: 0.25rem;
          padding: 0.125rem 0.375rem;
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace;
          font-size: 0.875em;
        }
        
        .dark .rich-text-editor-wrapper .ql-editor code,
        .dark .rich-text-editor-wrapper .ql-editor pre {
          background-color: #374151;
          color: #f9fafb;
        }
        
        .rich-text-editor-wrapper .ql-editor pre {
          padding: 0.75rem;
          margin: 0.5rem 0;
        }
        
        .rich-text-editor-wrapper .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 1rem 0;
        }
        
        .rich-text-editor-wrapper .ql-editor video {
          max-width: 100%;
          border-radius: 0.375rem;
          margin: 1rem 0;
        }
        
        .rich-text-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .dark .rich-text-editor-wrapper .ql-editor blockquote {
          border-left-color: #60a5fa;
          color: #9ca3af;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
}

