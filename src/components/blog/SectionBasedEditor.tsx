"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, Reorder } from 'framer-motion';
import RichTextEditor from './RichTextEditor';
import CodeBlockInserter from './CodeBlockInserter';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('./CodeEditor'), { ssr: false });

export type SectionType = 'text' | 'code';

export interface ContentSection {
  id: string;
  type: SectionType;
  content: string;
  language?: string; // For code sections
}

interface SectionBasedEditorProps {
  value: string; // HTML string
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Section-based editor that separates text and code sections
 * Converts between HTML string and section array
 */
export default function SectionBasedEditor({
  value,
  onChange,
  placeholder = 'Add sections to build your blog post...'
}: SectionBasedEditorProps) {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const quillRefs = useRef<{ [key: string]: any }>({});

  // Generate unique ID
  const generateId = () => {
    return `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Convert HTML string to sections array
  const parseHtmlToSections = (html: string): ContentSection[] => {
    if (!html || html.trim() === '') {
      return [{ id: generateId(), type: 'text', content: '' }];
    }

    const sections: ContentSection[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.body;

    // Find all code blocks
    const codeBlockRegex = /<pre[^>]*class="code-block"[^>]*data-language="([^"]*)"[^>]*><code>([\s\S]*?)<\/code><\/pre>/gi;
    const quillCodeBlockRegex = /<pre[^>]*class="ql-syntax"[^>]*>([\s\S]*?)<\/pre>/gi;
    
    const allMatches: Array<{ index: number; length: number; language: string; code: string }> = [];
    let match;

    // Find code blocks with data-language
    codeBlockRegex.lastIndex = 0;
    while ((match = codeBlockRegex.exec(html)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        language: match[1] || 'text',
        code: match[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
      });
    }

    // Find Quill code blocks
    quillCodeBlockRegex.lastIndex = 0;
    while ((match = quillCodeBlockRegex.exec(html)) !== null) {
      // Check if already matched
      const alreadyMatched = allMatches.some(m => 
        m.index === match.index && m.length === match[0].length
      );
      if (!alreadyMatched) {
        allMatches.push({
          index: match.index,
          length: match[0].length,
          language: 'text',
          code: match[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
        });
      }
    }

    // Sort matches by index
    allMatches.sort((a, b) => a.index - b.index);

    let lastIndex = 0;
    allMatches.forEach((codeMatch) => {
      // Add text section before code block
      if (codeMatch.index > lastIndex) {
        const textHtml = html.substring(lastIndex, codeMatch.index).trim();
        if (textHtml) {
          sections.push({
            id: generateId(),
            type: 'text',
            content: textHtml
          });
        }
      }

      // Add code section
      sections.push({
        id: generateId(),
        type: 'code',
        content: codeMatch.code,
        language: codeMatch.language
      });

      lastIndex = codeMatch.index + codeMatch.length;
    });

    // Add remaining text
    if (lastIndex < html.length) {
      const remainingText = html.substring(lastIndex).trim();
      if (remainingText) {
        sections.push({
          id: generateId(),
          type: 'text',
          content: remainingText
        });
      }
    }

    // If no sections found, create a default text section
    if (sections.length === 0) {
      sections.push({
        id: generateId(),
        type: 'text',
        content: html || ''
      });
    }

    return sections;
  };

  // Convert sections array to HTML string
  const sectionsToHtml = (sectionsArray: ContentSection[]): string => {
    return sectionsArray.map(section => {
      if (section.type === 'code') {
        const escapedCode = section.content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<pre class="code-block" data-language="${section.language || 'text'}"><code>${escapedCode}</code></pre>`;
      } else {
        return section.content;
      }
    }).join('\n');
  };

  // Initialize sections from value
  useEffect(() => {
    if (value) {
      const parsedSections = parseHtmlToSections(value);
      setSections(parsedSections);
    } else {
      setSections([{ id: generateId(), type: 'text', content: '' }]);
    }
  }, []); // Only run on mount

  // Update HTML when sections change
  useEffect(() => {
    if (sections.length > 0) {
      const html = sectionsToHtml(sections);
      onChange(html);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  // Add new section
  const addSection = (type: SectionType, afterIndex?: number) => {
    const newSection: ContentSection = {
      id: generateId(),
      type,
      content: type === 'code' ? '' : '',
      language: type === 'code' ? 'javascript' : undefined
    };

    if (afterIndex !== undefined) {
      const newSections = [...sections];
      newSections.splice(afterIndex + 1, 0, newSection);
      setSections(newSections);
    } else {
      setSections([...sections, newSection]);
    }
  };

  // Remove section
  const removeSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  // Update section content
  const updateSection = (id: string, updates: Partial<ContentSection>) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  // Handle code block insertion
  const handleCodeBlockInsert = (codeBlock: string, sectionId: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(codeBlock, 'text/html');
    const preElement = doc.querySelector('pre.code-block');
    
    if (preElement) {
      const code = preElement.textContent || '';
      const language = preElement.getAttribute('data-language') || 'text';
      
      updateSection(sectionId, {
        content: code,
        language
      });
    }
  };

  return (
    <div className="section-based-editor space-y-4">
      {sections.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{placeholder}</p>
          <div className="flex gap-2 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addSection('text')}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
            >
              Add Text Section
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addSection('code')}
              className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium"
            >
              Add Code Section
            </motion.button>
          </div>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={sections}
          onReorder={setSections}
          className="space-y-4"
        >
          {sections.map((section, index) => (
            <Reorder.Item
              key={section.id}
              value={section}
              className="relative group"
            >
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                {/* Section Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="cursor-move">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                      {section.type === 'text' ? 'Text Section' : 'Code Section'}
                    </span>
                    {section.type === 'code' && section.language && (
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        ({section.language})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addSection('text', index)}
                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                      title="Add text section after"
                    >
                      + Text
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addSection('code', index)}
                      className="text-xs px-2 py-1 bg-gray-700 dark:bg-gray-600 text-white rounded hover:bg-gray-800 dark:hover:bg-gray-500"
                      title="Add code section after"
                    >
                      + Code
                    </motion.button>
                    {sections.length > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeSection(section.id)}
                        className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
                        title="Remove section"
                      >
                        ×
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-4">
                  {section.type === 'text' ? (
                    <RichTextEditor
                      value={section.content}
                      onChange={(content) => updateSection(section.id, { content })}
                      placeholder="Write your text content here..."
                      height="300px"
                      editorRef={quillRefs.current[section.id] || (quillRefs.current[section.id] = { current: null })}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Language:
                        </label>
                        <select
                          value={section.language || 'text'}
                          onChange={(e) => updateSection(section.id, { language: e.target.value })}
                          className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                        >
                          <option value="text">Plain Text</option>
                          <option value="javascript">JavaScript</option>
                          <option value="typescript">TypeScript</option>
                          <option value="html">HTML</option>
                          <option value="css">CSS</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="csharp">C#</option>
                          <option value="cpp">C++</option>
                          <option value="php">PHP</option>
                          <option value="go">Go</option>
                          <option value="ruby">Ruby</option>
                          <option value="rust">Rust</option>
                          <option value="swift">Swift</option>
                          <option value="bash">Bash/Shell</option>
                          <option value="sql">SQL</option>
                        </select>
                        <CodeBlockInserter
                          onInsert={(codeBlock) => handleCodeBlockInsert(codeBlock, section.id)}
                        />
                      </div>
                      <CodeEditor
                        code={section.content}
                        language={section.language || 'text'}
                        onChange={(code) => updateSection(section.id, { content: code })}
                        height="400px"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Add Section Buttons */}
      {sections.length > 0 && (
        <div className="flex gap-2 justify-center pt-4 border-t border-gray-300 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addSection('text')}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Text Section
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addSection('code')}
            className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Code Section
          </motion.button>
        </div>
      )}
    </div>
  );
}

