"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeEditorProps {
  code: string;
  language?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
}

/**
 * A code editor component that simulates a code IDE for blog posts
 */
export default function CodeEditor({
  code,
  language = 'javascript',
  onChange,
  readOnly = false,
  height = '300px',
  placeholder = '// Write your code here...'
}: CodeEditorProps) {
  const [value, setValue] = useState(code);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Update internal state when prop changes
  useEffect(() => {
    setValue(code);
  }, [code]);

  // Handle escape key to collapse expanded editor
  useEffect(() => {
    if (!readOnly || !isExpanded) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isExpanded, readOnly]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange && onChange(newValue);
  };
  
  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };
  
  // Get line numbers based on the content
  const lineNumbers = value.split('\n').map((_, i) => i + 1).join('\n');
  
  // Determine height for readOnly mode
  const readOnlyHeight = isExpanded ? '90vh' : '50vh';
  const editorHeight = readOnly ? readOnlyHeight : height;
  
  return (
    <>
      {/* Backdrop overlay when expanded */}
      {isExpanded && readOnly && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
      
      <motion.div 
        className={`rounded-lg overflow-hidden shadow-md mb-6 bg-gray-900 text-white font-mono relative group ${isExpanded && readOnly ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}
        initial={false}
        animate={{ 
          height: readOnly && isExpanded ? '90vh' : 'auto',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
      {/* Header with language and action buttons */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
          <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
          <span className="text-xs text-gray-400 ml-2 uppercase">{language}</span>
        </div>
        
        <div className="flex items-center gap-2">
        {!readOnly && (
          <div className="text-xs text-gray-400">
            {value.split('\n').length} lines
          </div>
        )}
        
        {readOnly && (
            <>
              {isExpanded && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  title="Close (Esc)"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors flex items-center gap-1"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {isExpanded ? 'Collapse' : 'Expand'}
              </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </motion.button>
            </>
        )}
        </div>
      </div>
      
      {/* Code editor */}
      <div 
        className="relative overflow-auto"
        style={{ 
          height: readOnly ? editorHeight : height,
          maxHeight: readOnly && isExpanded ? '90vh' : readOnly ? '50vh' : undefined
        }}
      >
        {readOnly ? (
          /* Syntax highlighted code with built-in line numbers */
          <div className="syntax-highlighter-wrapper" style={{ height: '100%' }}>
            <SyntaxHighlighter
              language={language || 'text'}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '12px 16px',
                background: '#1e1e1e',
                fontSize: '14px',
                lineHeight: '1.5',
                borderRadius: 0,
                height: '100%',
                overflow: 'auto',
              }}
              showLineNumbers={true}
              lineNumberStyle={{
                minWidth: '3em',
                paddingRight: '1em',
                color: '#858585',
                userSelect: 'none',
              }}
              wrapLines={false}
              wrapLongLines={false}
            >
              {value || placeholder}
            </SyntaxHighlighter>
          </div>
        ) : (
          /* Editable textarea with custom line numbers */
          <>
        <div
          className="absolute left-0 top-0 bottom-0 px-2 py-3 text-right bg-gray-800 text-gray-500 select-none"
          style={{ width: '2.5rem' }}
        >
          <pre className="text-xs leading-5">{lineNumbers}</pre>
        </div>
            <div className="ml-10 overflow-auto" style={{ height: '100%' }}>
            <textarea
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full h-full bg-gray-900 text-white text-sm border-0 px-4 py-3 resize-none leading-5 focus:outline-none focus:ring-0"
              style={{ fontFamily: 'monospace' }}
              spellCheck="false"
            />
            </div>
          </>
          )}
      </div>
    </motion.div>
    </>
  );
}
