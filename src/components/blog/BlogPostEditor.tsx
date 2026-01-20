"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { IBlog } from '@/models/Blog';
import { motion } from 'framer-motion';
import SectionBasedEditor from './SectionBasedEditor';
import BlogContent from './BlogContent';

interface Category {
  _id: string;
  name: string;
}

interface BlogPostEditorProps {
  post?: Partial<IBlog>;
  onSave: (data: any) => Promise<void>;
  categories?: Category[];
}

/**
 * Blog post editor component with advanced features including autosave
 */
export default function BlogPostEditor({ post, onSave, categories = [] }: BlogPostEditorProps) {
  // Form state
  const [title, setTitle] = useState(post?.title || '');
  const [summary, setSummary] = useState(post?.summary || '');
  const [content, setContent] = useState(post?.content || '');
  const [coverImage, setCoverImage] = useState(post?.coverImage || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '');
  const [embedVideo, setEmbedVideo] = useState(post?.embedVideo || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories?.map(cat => typeof cat === 'string' ? cat : cat.toString()) || []
  );
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [featured, setFeatured] = useState(post?.featured || false);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(
    (post?.status as 'draft' | 'published' | 'archived') || 'draft'
  );
  const [scheduledFor, setScheduledFor] = useState<string>(
    post?.scheduledFor ? new Date(post.scheduledFor).toISOString().slice(0, 16) : ''
  );
  
  // SEO fields
  const [seoFields, setSeoFields] = useState({
    title: post?.seoTitle || '',
    description: post?.seoDescription || '',
    image: post?.ogImage || '',
    canonicalUrl: post?.canonicalUrl || ''
  });
  
  // Save status
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Editor mode: 'edit' or 'preview'
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  
  // Autosave functionality
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<number>(Date.now());
  const isDirtyRef = useRef<boolean>(false);
  
  // Set up autosave
  useEffect(() => {
    autoSaveInterval.current = setInterval(() => {
      if (isDirtyRef.current) {
        handleAutosave();
        isDirtyRef.current = false;
      }
    }, 30000); // Autosave every 30 seconds
    
    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, []);
  
  // Mark content as dirty when changes occur
  useEffect(() => {
    isDirtyRef.current = true;
  }, [title, summary, content, coverImage, featuredImage, embedVideo, 
      selectedCategories, tags, featured, status, scheduledFor, seoFields]);
  
  // Handle autosave
  const handleAutosave = async () => {
    try {
      const now = Date.now();
      
      // Only autosave if it's been more than 5 seconds since last save
      if (now - lastSavedRef.current < 5000) {
        return;
      }
      
      if (!title || !summary || !content) {
        return; // Don't autosave if required fields are empty
      }
      
      setIsSaving(true);
      setSaveError(null);
      
      // Prepare post data
      const postData = preparePostData();
      
      // Call the save function
      await onSave(postData);
      
      lastSavedRef.current = now;
      setLastSaved(new Date());
      setIsSaving(false);
    } catch (error) {
      console.error("Autosave failed:", error);
      setSaveError("Autosave failed. Please save manually.");
      setIsSaving(false);
    }
  };
  
  // Prepare post data for saving
  const preparePostData = () => {
    return {
      _id: post?._id,
      title,
      summary,
      content,
      coverImage,
      featuredImage,
      embedVideo,
      categories: selectedCategories,
      tags,
      featured,
      status,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      seoTitle: seoFields.title,
      seoDescription: seoFields.description,
      ogImage: seoFields.image,
      canonicalUrl: seoFields.canonicalUrl
    };
  };
  
  // Handle manual save
  const handleSave = async () => {
    if (!title || !summary || !content) {
      setSaveError("Please fill in all required fields");
      return;
    }
    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      // Prepare post data
      const postData = preparePostData();
      
      // Call save function
      await onSave(postData);
      
      lastSavedRef.current = Date.now();
      setLastSaved(new Date());
      setIsSaving(false);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveError("Failed to save. Please try again.");
      setIsSaving(false);
    }
  };
  
  // Handle tag addition
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle tag input keypress
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Handle category selection
  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  // Handle SEO field changes
  const handleSeoChange = (field: string, value: string) => {
    setSeoFields(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Format the last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return '';
    return `Last saved: ${lastSaved.toLocaleTimeString()}`;
  };
  
  return (
    <div className="space-y-8">
      {/* Status bar */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatLastSaved()}
          </span>
          {isSaving && (
            <span className="text-sm text-primary animate-pulse">
              Saving...
            </span>
          )}
          {saveError && (
            <span className="text-sm text-red-500">
              {saveError}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'archived')}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70"
          >
            Save
          </motion.button>
        </div>
      </div>
      
      {/* Main form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter post title"
              required
            />
          </div>
          
          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Brief summary of the post"
              required
            />
          </div>
          
          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content <span className="text-red-500">*</span>
            </label>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setEditorMode(editorMode === 'edit' ? 'preview' : 'edit')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    editorMode === 'edit'
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {editorMode === 'edit' ? 'Preview' : 'Edit'}
                </motion.button>
              </div>
            </div>
            
            {editorMode === 'edit' ? (
              <div className="border border-gray-300 dark:border-gray-700 rounded-md mb-2 p-4 bg-white dark:bg-gray-900">
                <SectionBasedEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Add text and code sections to build your blog post"
                />
              </div>
            ) : (
              <div className="border border-gray-300 dark:border-gray-700 rounded-md p-6 bg-white dark:bg-gray-900 min-h-[600px]">
                <BlogContent content={content || '<p>Start writing to see preview...</p>'} />
            </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {editorMode === 'edit' 
                ? 'Add separate text and code sections. Drag sections to reorder them. Each section can be edited independently.'
                : 'Preview mode shows how your content will appear to readers.'}
            </p>
          </div>
        </div>
        
        {/* Right column - Metadata */}
        <div className="space-y-6">
          {/* Media */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Media</h3>
            
            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover Image URL
              </label>
              <input
                id="coverImage"
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="URL to cover image"
              />
            </div>
            
            {/* Featured Image */}
            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Featured Image URL
              </label>
              <input
                id="featuredImage"
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="URL to featured image"
              />
            </div>
            
            {/* Embed Video */}
            <div>
              <label htmlFor="embedVideo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Embed Video URL
              </label>
              <input
                id="embedVideo"
                type="text"
                value={embedVideo}
                onChange={(e) => setEmbedVideo(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="YouTube, Vimeo, etc. URL"
              />
            </div>
          </div>
          
          {/* Categories & Tags */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Categories & Tags</h3>
            
            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categories
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category._id}`}
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCategoryToggle(category._id)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`category-${category._id}`}
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No categories available</p>
                )}
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex items-center">
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyPress}
                  className="flex-1 px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add tag and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md border border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-primary/20"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            {/* Featured Post */}
            <div className="flex items-center">
              <input
                id="featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Featured post
              </label>
            </div>
          </div>
          
          {/* Publishing */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Publishing</h3>
            
            {/* Schedule Publication */}
            <div>
              <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Schedule Publication
              </label>
              <input
                id="scheduledFor"
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for immediate publication when published
              </p>
            </div>
          </div>
          
          {/* SEO */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">SEO Settings</h3>
            
            {/* SEO Title */}
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SEO Title
              </label>
              <input
                id="seoTitle"
                type="text"
                value={seoFields.title}
                onChange={(e) => handleSeoChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="SEO optimized title (optional)"
              />
            </div>
            
            {/* SEO Description */}
            <div>
              <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SEO Description
              </label>
              <textarea
                id="seoDescription"
                value={seoFields.description}
                onChange={(e) => handleSeoChange('description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Meta description for search engines"
              />
            </div>
            
            {/* OG Image */}
            <div>
              <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Social Media Image URL
              </label>
              <input
                id="ogImage"
                type="text"
                value={seoFields.image}
                onChange={(e) => handleSeoChange('image', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="OpenGraph image URL"
              />
            </div>
            
            {/* Canonical URL */}
            <div>
              <label htmlFor="canonicalUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Canonical URL
              </label>
              <input
                id="canonicalUrl"
                type="text"
                value={seoFields.canonicalUrl}
                onChange={(e) => handleSeoChange('canonicalUrl', e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Canonical URL (if different)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 