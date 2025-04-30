## Blog System Implementation

### Blog Post Management

#### Blog Content Structure
- **Blog Post Schema Extensions**:
  ```javascript
  // Extended blog schema with advanced features
  const blogSchema = new mongoose.Schema({
    // Basic information
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    
    // Media and appearance
    coverImage: { type: String },
    featuredImage: { type: String },
    embedVideo: { type: String },
    
    // Organization and discovery
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    
    // Publishing details
    status: { 
      type: String, 
      enum: ['draft', 'published', 'archived'], 
      default: 'draft' 
    },
    publishedAt: { type: Date },
    scheduledFor: { type: Date },
    
    // SEO and sharing
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    ogImage: { type: String },
    canonicalUrl: { type: String, trim: true },
    
    // Statistics and tracking
    viewCount: { type: Number, default: 0 },
    uniqueViewCount: { type: Number, default: 0 },
    readingTime: { type: Number }, // in minutes
    
    // Content structure
    tableOfContents: [{
      title: String,
      id: String,
      level: Number
    }],
    
    // Revision tracking
    revisionHistory: [{
      content: String,
      updatedAt: { type: Date, default: Date.now },
      changeDescription: String
    }],
    
    // Relationships
    relatedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    
    // Standard metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  // Pre-save hook for generating slug and reading time
  blogSchema.pre('save', function(next) {
    // Only update slug if title changed or new document
    if (this.isModified('title') || this.isNew) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    // Calculate reading time
    if (this.isModified('content')) {
      const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      this.readingTime = Math.ceil(wordCount / 200); // Assuming 200 wpm reading speed
      
      // Generate table of contents
      const headingRegex = /<h([2-4])[^>]*id="([^"]+)"[^>]*>([^<]+)<\/h\1>/g;
      const headings = [];
      let match;
      
      while ((match = headingRegex.exec(this.content)) !== null) {
        headings.push({
          level: parseInt(match[1]),
          id: match[2],
          title: match[3]
        });
      }
      
      this.tableOfContents = headings;
      
      // Add to revision history if not a new document
      if (!this.isNew) {
        if (!this.revisionHistory) {
          this.revisionHistory = [];
        }
        
        this.revisionHistory.push({
          content: this.content,
          updatedAt: Date.now(),
          changeDescription: 'Content updated'
        });
      }
    }
    
    // Set published date if status changed to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
      this.publishedAt = Date.now();
    }
    
    next();
  });
  ```

#### Content Editor Implementation
- **Rich Text Editor Setup**:
  ```jsx
  // Blog post editor component with advanced features
  function BlogPostEditor({ post, onSave }) {
    const [title, setTitle] = useState(post?.title || '');
    const [summary, setSummary] = useState(post?.summary || '');
    const [content, setContent] = useState(post?.content || '');
    const [coverImage, setCoverImage] = useState(post?.coverImage || '');
    const [categories, setCategories] = useState(post?.categories || []);
    const [tags, setTags] = useState(post?.tags || []);
    const [status, setStatus] = useState(post?.status || 'draft');
    const [seoFields, setSeoFields] = useState({
      title: post?.seoTitle || '',
      description: post?.seoDescription || '',
      image: post?.ogImage || ''
    });
    
    // Autosave functionality
    const autoSaveInterval = useRef(null);
    const lastSavedRef = useRef(Date.now());
    const isDirtyRef = useRef(false);
    
    useEffect(() => {
      // Set up autosave every 30 seconds if content changes
      autoSaveInterval.current = setInterval(() => {
        if (isDirtyRef.current) {
          handleAutosave();
          isDirtyRef.current = false;
        }
      }, 30000);
      
      return () => clearInterval(autoSaveInterval.current);
    }, []);
    
    // Mark as dirty when content changes
    useEffect(() => {
      isDirtyRef.current = true;
    }, [title, summary, content, categories, tags, status]);
    
    const handleAutosave = async () => {
      try {
        const now = Date.now();
        
        // Only autosave if it's been more than 5 seconds since last save
        if (now - lastSavedRef.current < 5000) {
          return;
        }
        
        // Prepare post data
        const postData = {
          id: post?._id,
          title,
          summary,
          content,
          coverImage,
          categories,
          tags,
          status,
          seoTitle: seoFields.title,
          seoDescription: seoFields.description,
          ogImage: seoFields.image
        };
        
        // Call API to save draft
        const response = await fetch('/api/blogs/autosave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        });
        
        if (response.ok) {
          lastSavedRef.current = now;
          toast.success('Draft saved automatically');
        }
      } catch (error)# Dynamic Portfolio Website Technical Documentation

## Project Overview

This document outlines the technical specifications for a full-stack dynamic portfolio website built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Next.js. The portfolio will feature both a public client-side interface and a secure admin panel for content management.

## Technology Stack

### Frontend
- **Next.js 14+**: For server-side rendering, routing, and API endpoints
- **React.js 18+**: Component-based UI development
- **Tailwind CSS 3+**: For responsive and utility-first styling
- **Framer Motion**: For interactive animations and transitions
- **TypeScript**: For type safety and better development experience
- **Next-Auth**: For authentication and session management
- **SWR/React Query**: For data fetching, caching, and state management
- **React Hook Form**: For form handling with validation

### Backend
- **Next.js API Routes**: For serverless API endpoints
- **MongoDB**: For database storage
- **Mongoose**: For MongoDB object modeling
- **Node.js**: Runtime environment
- **Nodemailer**: For email services and notifications
- **NextAuth.js**: For authentication flows
- **bcryptjs**: For password hashing
- **jsonwebtoken**: For token-based authentication
- **Multer/next-connect**: For file uploads

### DevOps/Deployment
- **Vercel/Netlify**: For frontend deployment
- **MongoDB Atlas**: For cloud database hosting
- **GitHub Actions**: For CI/CD pipeline
- **ESLint/Prettier**: For code quality and formatting
- **Jest/React Testing Library**: For testing

## System Architecture

### Overview
The application follows a modern full-stack architecture with Next.js handling both frontend and backend functionality:

1. **Client-side rendering** for dynamic content using Next.js
2. **Server-side rendering** for SEO-friendly static content
3. **API routes** for backend functionality
4. **MongoDB** for data persistence
5. **Secure authentication** with multi-factor authentication

### Data Flow
1. Client browser requests route
2. Next.js server handles the request
3. Data is fetched from MongoDB through API routes
4. Rendered page is returned to the client
5. Client-side JavaScript hydrates the page for interactivity

### Database Schema

#### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // Hashed
  role: String, // "admin"
  twoFactorEnabled: Boolean,
  twoFactorSecret: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Profile Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  name: String,
  title: String,
  description: String,
  photo: String, // URL to the image
  resume: String, // URL to the resume file
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    // other social media links
  },
  contact: {
    email: String,
    phone: String,
    address: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Experience Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  title: String,
  company: String,
  location: String,
  from: Date,
  to: Date,
  current: Boolean,
  description: String,
  technologies: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### Education Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  institution: String,
  degree: String,
  field: String,
  location: String,
  from: Date,
  to: Date,
  current: Boolean,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Project Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  title: String,
  description: String,
  image: String, // URL to the project image
  technologies: [String],
  githubLink: String,
  demoLink: String,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Certificate Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  title: String,
  organization: String,
  issueDate: Date,
  expiryDate: Date,
  credentialID: String,
  credentialURL: String,
  description: String,
  image: String, // URL to the certificate image
  createdAt: Date,
  updatedAt: Date
}
```

#### Blog Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to User
  title: String,
  slug: String,
  summary: String,
  content: String, // Rich text content
  coverImage: String, // URL to the blog cover image
  tags: [String],
  categories: [String],
  status: String, // "draft", "published"
  publishedAt: Date,
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Comment Collection
```javascript
{
  _id: ObjectId,
  blogId: ObjectId, // Reference to Blog
  name: String,
  email: String,
  content: String,
  isApproved: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Analytics Collection
```javascript
{
  _id: ObjectId,
  blogId: ObjectId, // Reference to Blog
  pageViews: Number,
  uniqueVisitors: Number,
  referrers: [String],
  countries: [String],
  devices: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## Application Features

### Client-Side Portfolio

#### Landing Page
- Hero section with personal photo
- Animated title and tagline using Framer Motion
- Brief personal introduction
- Call-to-action buttons
- Social media links
- Responsive design for all devices

#### About Section
- Detailed personal information
- Skills and expertise visualization
- Downloadable resume

#### Experience Section
- Timeline view of professional experiences
- Company details
- Role responsibilities
- Technologies used
- Start and end dates

#### Education Section
- Timeline view of educational background
- Institution details
- Degree information
- Academic achievements

#### Projects Section
- Interactive project cards with:
  - Project image/screenshot
  - Title and description
  - Technologies used
  - GitHub repository link
  - Live demo link
- Filterable by technology/category

#### Certificates Section
- Certificate cards with:
  - Certificate title
  - Issuing organization
  - Issue/expiry dates
  - Credential verification link
  - Certificate image

#### Blog Section
- List of published blog posts
- Featured/recent blogs
- Blog categories and tags
- Search functionality
- Pagination for blog listings
- Individual blog post pages with:
  - Rich text content
  - Author information
  - Published date
  - Reading time estimate
  - View count
  - Comments section
  - Social sharing options

#### Contact Section
- Contact form with validation
- Email notification integration
- Google Maps integration (optional)
- Contact information

### Admin Panel

#### Authentication System
- Secure login page
- Two-factor authentication using email
- Password reset functionality
- Session management

#### Dashboard
- Overview statistics:
  - Total blog posts
  - Total projects
  - Blog views
  - Recent comments
- Quick action buttons

#### Profile Management
- Edit personal information
- Update profile picture
- Manage social media links
- Update contact information

#### Experience Management
- Add/Edit/Delete work experiences
- Drag-and-drop reordering

#### Education Management
- Add/Edit/Delete educational qualifications
- Drag-and-drop reordering

#### Project Management
- Add/Edit/Delete projects
- Upload project images
- Manage project details
- Set featured projects

#### Certificate Management
- Add/Edit/Delete certificates
- Upload certificate images
- Manage certificate details

#### Blog Management
- Rich text editor for blog content
- Media library for blog images
- Draft/Publish workflow
- Categories and tags management
- SEO metadata configuration
- Schedule publishing

#### Comment Management
- Approve/Reject comments
- Reply to comments
- Delete comments
- Spam filtering

#### Analytics Dashboard
- Blog post performance metrics
- Visitor statistics
- Geographic distribution
- Referral sources
- Device statistics

#### Settings
- Two-factor authentication settings
- Password change
- Notification preferences
- General site settings

## Security Measures

### Authentication Security
- **JWT-based Authentication**: Secure token-based authentication
- **Two-Factor Authentication**: Email verification using Nodemailer
- **Password Hashing**: Using bcrypt for password security
- **CSRF Protection**: Cross-Site Request Forgery protection
- **Rate Limiting**: Prevent brute force attacks

### Data Security
- **Input Validation**: Server-side validation of all inputs
- **XSS Prevention**: Protection against cross-site scripting
- **MongoDB Security**: Secure connection using environment variables
- **HTTPS**: Secure data transmission

### Admin Panel Security
- **Role-Based Access Control**: Admin-only routes and features
- **Protected API Routes**: Middleware authentication for API routes
- **Session Management**: Secure session handling and timeouts
- **Audit Logging**: Track admin actions for security monitoring

## Design System and UI Strategy

### Design System Foundation
- **Color Palette**:
  - Primary: `#0070f3` (Brand blue)
  - Secondary: `#6b21a8` (Deep purple)
  - Accent: `#f59e0b` (Amber)
  - Background: `#ffffff` (Light) / `#111827` (Dark)
  - Text: `#111827` (Dark) / `#f3f4f6` (Light)
  - Gray scale: `#f9fafb`, `#f3f4f6`, `#e5e7eb`, `#d1d5db`, `#9ca3af`, `#6b7280`, `#4b5563`, `#374151`, `#1f2937`, `#111827`
  - Success: `#10b981` (Green)
  - Warning: `#f59e0b` (Amber)
  - Danger: `#ef4444` (Red)
  - Info: `#3b82f6` (Blue)

- **Typography**:
  - Headings: Inter (Sans-serif)
  - Body: Inter (Sans-serif)
  - Code: JetBrains Mono (Monospace)
  - Font sizes:
    - Headings: 2rem to 4rem (32px - 64px)
    - Subheadings: 1.5rem to 1.875rem (24px - 30px)
    - Body: 1rem to 1.125rem (16px - 18px)
    - Small text: 0.875rem (14px)
  - Line heights:
    - Headings: 1.1 to 1.2
    - Body: 1.5 to 1.7
    - Tight: 1.25

- **Spacing System**:
  - Base unit: 0.25rem (4px)
  - Scale: 0, 0.25rem, 0.5rem, 0.75rem, 1rem, 1.25rem, 1.5rem, 2rem, 2.5rem, 3rem, 4rem, 5rem, 6rem, 8rem, 10rem, 12rem, 14rem, 16rem
  - Section padding: 4rem to 8rem (64px - 128px)
  - Component padding: 1rem to 2rem (16px - 32px)
  - Gap spacing: 1rem to 2rem (16px - 32px)

- **Shadows**:
  - Small: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
  - Medium: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
  - Large: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
  - Extra large: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

- **Border Radius**:
  - None: `0`
  - Small: `0.125rem` (2px)
  - Default: `0.25rem` (4px)
  - Medium: `0.375rem` (6px)
  - Large: `0.5rem` (8px)
  - Extra large: `0.75rem` (12px)
  - Full: `9999px`

- **Common UI Components**:
  - Buttons (Primary, Secondary, Outline, Text)
  - Input fields
  - Cards
  - Avatars
  - Badges
  - Alerts
  - Modals
  - Dropdowns
  - Tabs
  - Accordions

### UI Design Patterns

#### Landing Page Design
- **Hero Section**:
  - Full-viewport height
  - Animated background with subtle patterns/particles
  - Centered or left-aligned personal photo
  - H1 heading with animated text reveal
  - Short tagline with fade-in animation
  - Call-to-action buttons with hover effects
  - Social media links with icon animations
  - Scroll indicator with pulse animation

- **About Section**:
  - Two-column layout (photo + text on desktop)
  - Single-column stacked layout on mobile
  - Animated skill bars or skill clouds
  - Background with subtle geometric patterns
  - Pull quotes with larger typography
  - Downloadable resume button with hover animation

- **Experience/Education Timeline**:
  - Vertical timeline with connected nodes
  - Alternating left/right layout on desktop
  - Single-column layout on mobile
  - Animated reveal of timeline items on scroll
  - Hover states with elevated cards
  - Indicator for current position/education

- **Projects Grid**:
  - Masonry or grid layout
  - Consistent card heights with varied content
  - Thumbnail images with aspect ratio 16:9
  - Hover states with scale transform and info overlay
  - Filter tabs with animated transitions
  - Featured projects with larger cards or special styling
  - "View all" button or pagination

- **Blog Section**:
  - Featured post in hero position
  - Card-based grid for remaining posts
  - Category tags with distinct colors
  - Reading time and date indicators
  - Pagination with numbered pages
  - Search bar with animated transitions

- **Contact Section**:
  - Split layout with contact form and information
  - Floating labels for form inputs
  - Animated submit button
  - Success/error messages with motion
  - Social media links with branded colors
  - Map integration with custom marker

### Responsive Implementation

#### Responsive Approach
- **Mobile-First Design**: Starting with mobile layouts and scaling up
- **Tailwind CSS Breakpoints**:
  - `sm`: Small screens (640px and up)
  - `md`: Medium screens (768px and up)
  - `lg`: Large screens (1024px and up)
  - `xl`: Extra large screens (1280px and up)
  - `2xl`: Extra extra large screens (1536px and up)

#### Core Responsive Techniques
- **Fluid Typography System**:
  ```css
  /* Example of fluid typography with clamp */
  h1 {
    font-size: clamp(2rem, 5vw, 4rem);
    line-height: 1.1;
  }
  
  p {
    font-size: clamp(1rem, 3vw, 1.125rem);
    line-height: 1.6;
  }
  ```

- **Responsive Grid Implementation**:
  ```html
  <!-- Example of responsive grid with Tailwind -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    <!-- Grid items -->
  </div>
  ```

- **Responsive Navigation**:
  - Mobile: Hamburger menu with slide-out drawer
  - Tablet: Condensed navigation
  - Desktop: Full horizontal navigation
  - Scroll behavior: Sticky header with size reduction on scroll

- **Responsive Images**:
  ```jsx
  // Example of responsive image with Next.js
  <Image
    src="/profile.jpg"
    alt="Profile Photo"
    width={600}
    height={800}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    priority
    className="rounded-lg object-cover"
  />
  ```

- **Component-Specific Responsiveness**:
  - Cards: Full-width on mobile, grid on larger screens
  - Blog posts: Single column on mobile, multi-column layout on desktop
  - Project details: Stacked on mobile, side-by-side on desktop
  - Modals: Full-screen on mobile, centered with padding on desktop

#### Adaptive UI Patterns
- **Conditional Rendering**:
  ```jsx
  // Example of conditional rendering based on screen size
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  return (
    <div>
      {isDesktop ? (
        <DesktopComponent />
      ) : (
        <MobileComponent />
      )}
    </div>
  );
  ```

- **Touch-Optimized Interfaces**:
  - Larger tap targets on mobile (min 44x44px)
  - Swipe gestures for carousels and pagination
  - Pull-to-refresh functionality for dynamic content
  - Bottom navigation bar on mobile
  - Floating action buttons for primary actions

### Theme Implementation

#### Light/Dark Mode
- System preference detection
- Manual toggle with animated transitions
- Persistent user preference storage
- Color palette adaptation for both modes
- SVG and image adaptation between modes

#### Theme Toggling Implementation
```jsx
// Example of theme toggle component
function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  
  return (
    <motion.button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
      whileTap={{ scale: 0.95 }}
    >
      {theme === 'dark' ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </motion.button>
  );
}

## Animation Strategy with Framer Motion

### Animation Types
- **Entrance Animations**: Fade-in, slide-in effects for page elements
- **Scroll Animations**: Reveal elements as they enter the viewport
- **Hover Animations**: Interactive animations for cards and buttons
- **Page Transitions**: Smooth transitions between pages
- **Micro-interactions**: Small animations for UI feedback
- **Text Animations**: Character-by-character or word-by-word animations
- **SVG Path Animations**: Animated drawing of SVG paths for logos or illustrations
- **3D Animations**: Using perspective and rotations for depth effects

### Core Animation Configurations

#### Hero Section Animations
```javascript
// Example animation variants for hero section
const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Staggered text animation for title
const titleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};
```

#### Scroll-Triggered Animations
```javascript
// Scroll-triggered animation for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 75 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Implementation with useInView hook
function AnimatedSection({ children }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  return (
    <motion.div
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}
```

#### Project Card Animations
```javascript
// Hover animations for project cards
const projectCardVariants = {
  rest: { 
    scale: 1,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
  },
  hover: { 
    scale: 1.05,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Image reveal animation
const imageVariants = {
  rest: { opacity: 0.8 },
  hover: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};
```

#### Page Transition Effects
```javascript
// Page transition wrapper component
const pageVariants = {
  initial: { opacity: 0 },
  enter: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Layout component with page transitions
export default function Layout({ children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

#### Parallax Scroll Effects
```javascript
function ParallaxSection() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const parallaxY = useTransform(
    scrollY,
    [0, 500],
    [0, -150]
  );
  
  return (
    <motion.div style={{ y: parallaxY }}>
      {/* Content with parallax effect */}
    </motion.div>
  );
}
```

#### Interactive UI Element Animations
```javascript
// Button animation
const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// Toggle animation
const toggleVariants = {
  off: { x: 0, backgroundColor: "#ccc" },
  on: { x: 30, backgroundColor: "#0070f3" }
};
```

### Animation Implementation Strategy

#### Performance Considerations
- Use `will-change` property strategically for hardware acceleration
- Implement `useReducedMotion` hook for accessibility
- Batch animations to minimize layout thrashing
- Use `shouldReduceMotion` to provide alternative animations
- Implement lazy loading for animation components

#### Mobile Animation Optimizations
- Simpler animations for mobile devices
- Reduced motion complexity on lower-powered devices
- Touch-specific animations for mobile interactions
- Gesture-based animations optimized for touch interfaces

#### Animation Sequence Management
- Define sequence order and timing for complex animations
- Use Framer Motion's `AnimateSharedLayout` for connected element animations
- Implement orchestration of complex multi-element animations
- Use `AnimatePresence` for exit animations when elements are removed

## File Structure

```
/
├── public/              # Static files
│   ├── images/          # Image assets
│   ├── fonts/           # Font files
│   └── favicon.ico      # Favicon
│
├── src/                 # Application source code
│   ├── app/             # Next.js app directory
│   │   ├── api/         # API routes
│   │   │   ├── auth/    # Authentication endpoints
│   │   │   ├── blog/    # Blog endpoints
│   │   │   └── ...      # Other API endpoints
│   │   │
│   │   ├── admin/       # Admin panel routes
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── projects/
│   │   │   └── ...      # Other admin pages
│   │   │
│   │   ├── blog/        # Blog pages
│   │   │   ├── [slug]/  # Dynamic blog post page
│   │   │   └── page.js  # Blog listing page
│   │   │
│   │   └── page.js      # Landing page
│   │
│   ├── components/      # Reusable components
│   │   ├── common/      # Common UI components
│   │   ├── layout/      # Layout components
│   │   ├── admin/       # Admin-specific components
│   │   └── animations/  # Animation components
│   │
│   ├── lib/             # Utility functions
│   │   ├── auth.js      # Authentication utilities
│   │   ├── db.js        # Database connection
│   │   └── utils.js     # Helper functions
│   │
│   ├── models/          # Mongoose models
│   │   ├── User.js
│   │   ├── Profile.js
│   │   └── ...          # Other models
│   │
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.js
│   │   └── ...          # Other hooks
│   │
│   ├── context/         # React context providers
│   │   ├── AuthContext.js
│   │   └── ...          # Other contexts
│   │
│   └── styles/          # Global styles
│       └── globals.css  # Tailwind imports
│
├── middleware.js        # Next.js middleware
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── .env.local           # Environment variables
└── package.json         # Dependencies and scripts
```

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: User login
- `POST /api/auth/verify-2fa`: Verify two-factor authentication
- `POST /api/auth/logout`: User logout
- `POST /api/auth/reset-password`: Reset password

### Profile Endpoints
- `GET /api/profile`: Get profile information
- `PUT /api/profile`: Update profile information
- `POST /api/profile/upload`: Upload profile picture

### Experience Endpoints
- `GET /api/experiences`: Get all experiences
- `GET /api/experiences/:id`: Get single experience
- `POST /api/experiences`: Add new experience
- `PUT /api/experiences/:id`: Update experience
- `DELETE /api/experiences/:id`: Delete experience
- `PUT /api/experiences/reorder`: Reorder experiences

### Education Endpoints
- `GET /api/education`: Get all education entries
- `GET /api/education/:id`: Get single education entry
- `POST /api/education`: Add new education
- `PUT /api/education/:id`: Update education
- `DELETE /api/education/:id`: Delete education
- `PUT /api/education/reorder`: Reorder education entries

### Project Endpoints
- `GET /api/projects`: Get all projects
- `GET /api/projects/:id`: Get single project
- `POST /api/projects`: Add new project
- `PUT /api/projects/:id`: Update project
- `DELETE /api/projects/:id`: Delete project
- `POST /api/projects/upload`: Upload project image

### Certificate Endpoints
- `GET /api/certificates`: Get all certificates
- `GET /api/certificates/:id`: Get single certificate
- `POST /api/certificates`: Add new certificate
- `PUT /api/certificates/:id`: Update certificate
- `DELETE /api/certificates/:id`: Delete certificate
- `POST /api/certificates/upload`: Upload certificate image

### Blog Endpoints
- `GET /api/blogs`: Get all blogs
- `GET /api/blogs/:slug`: Get single blog
- `POST /api/blogs`: Create new blog
- `PUT /api/blogs/:id`: Update blog
- `DELETE /api/blogs/:id`: Delete blog
- `POST /api/blogs/upload`: Upload blog image
- `GET /api/blogs/categories`: Get all categories
- `GET /api/blogs/tags`: Get all tags

### Comment Endpoints
- `GET /api/comments/:blogId`: Get comments for a blog
- `POST /api/comments`: Add new comment
- `PUT /api/comments/:id`: Update comment status
- `DELETE /api/comments/:id`: Delete comment

### Analytics Endpoints
- `GET /api/analytics/blogs`: Get blog analytics
- `GET /api/analytics/blogs/:id`: Get specific blog analytics
- `POST /api/analytics/page-view`: Record page view

## Authentication Flow

### Login Process
1. User enters email and password on login page
2. Server validates credentials
3. If valid, a 2FA code is sent to the user's email
4. User enters the 2FA code
5. Server validates the code
6. If valid, JWT token is generated and sent to client
7. User is redirected to the admin dashboard

### Two-Factor Authentication Implementation
- Generate a unique code using crypto library
- Send code to user's email using Nodemailer
- Store code hash in the database with expiration
- Validate code entered by user against stored hash
- Implement rate limiting for verification attempts

### Session Management
- JWT token stored in HTTP-only cookies
- Refresh token rotation for extended sessions
- Automatic logout after period of inactivity
- Ability to manually log out from all devices

## Blog System Architecture

### Content Management
- Rich text editor (TinyMCE or CKEditor)
- Draft saving and autosave functionality
- Image upload and management
- Categorization and tagging
- SEO metadata configuration

### Comments System
- Threaded comments
- Moderation workflow
- Spam protection
- Email notifications
- GDPR compliance

### Analytics Tracking
- Page view counting
- Unique visitor tracking
- Reading time calculation
- Geographic and device statistics
- Referral source tracking

## Data Fetching Strategy

### Server-Side Rendering (SSR)
- For SEO-critical pages (landing page, blog posts)
- Initial data fetching during page generation
- Dynamic rendering of content

### Client-Side Fetching
- For admin panel
- For dynamic updates after page load
- Using SWR or React Query for efficient data fetching and caching

### Static Site Generation (SSG)
- For stable content
- Incremental Static Regeneration for updates
- Pre-rendering of common pages

## Performance Optimization

### Frontend Performance
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- Lazy loading of off-screen content
- Optimized fonts and icons (using Font Display API)
- Minimized JavaScript bundle size

### Backend Performance
- Database indexing for frequent queries
- API response caching
- Rate limiting for API endpoints
- Connection pooling
- Pagination for large datasets

### Network Performance
- Compression of response data
- CDN integration for static assets
- HTTP/2 implementation
- Browser caching headers

## Testing Strategy

### Unit Testing
- Components testing with React Testing Library
- Utility functions testing with Jest
- Models and database operations testing

### Integration Testing
- API endpoint testing
- Authentication flow testing
- Form submission and validation testing

### End-to-End Testing
- Critical user journeys testing
- Admin panel functionality testing
- Blog publishing and commenting flow testing

## Deployment Strategy

### Development Environment
- Local development server
- MongoDB local instance or Atlas dev cluster
- Environment variable management with .env.local

### Staging Environment
- Vercel preview deployments
- MongoDB Atlas staging cluster
- Automated deployment from staging branch

### Production Environment
- Vercel production deployment
- MongoDB Atlas production cluster
- HTTPS and custom domain configuration
- Automated deployment from main branch

## Additional Features and Advanced Functionality

### Advanced Animation Concepts

#### Scroll-Based Animation Sequences
- **ScrollTrigger Integration**:
  ```jsx
  // Example of scroll-based animation sequence
  function ScrollSequence() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ 
      target: containerRef,
      offset: ["start end", "end start"]
    });
    
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
    
    return (
      <div ref={containerRef} className="h-screen flex items-center justify-center">
        <motion.div
          style={{ opacity, scale, y }}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold">Scroll-Triggered Content</h2>
          <p>This content animates based on the scroll position.</p>
        </motion.div>
      </div>
    );
  }
  ```

#### Path Animation for SVG
- Animated logo reveals
- Drawing effect for illustrations
- SVG morphing between shapes
- Logo animation on page load
- Interactive SVG elements

#### WebGL and 3D Effects
- 3D card components with depth
- Particle backgrounds
- WebGL-powered backgrounds
- Three.js integration for 3D elements
- Canvas-based animations

### Advanced UI Features

#### Custom Form Controls
- Animated toggle switches
- Range sliders with tooltip values
- Multi-select dropdowns with chip display
- Date pickers with calendar animations
- Color pickers with spectrum display

#### Advanced Blog Features
- Estimated reading time calculator
- Text-to-speech article reader
- Social sharing with preview generation
- Related articles recommendation engine
- Post series/collections management
- Content revision history

#### Advanced Project Showcase
- Interactive case studies with step-by-step navigation
- Before/after image sliders
- Technical stack visualization
- GitHub integration for contribution graphs
- Live demos embedded in iframes
- Video demonstrations with chapter markers

### SEO and Performance Optimization

#### SEO Implementation
- **Meta Tag Management**:
  ```jsx
  // Example of dynamic meta tags with Next.js
  export function Metadata({ title, description, ogImage }) {
    return (
      <Head>
        <title>{title} | Portfolio Name</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={`https://yourportfolio.com${router.asPath}`} />
      </Head>
    );
  }
  ```

- **Structured Data Implementation**:
  ```jsx
  // Example of JSON-LD structured data
  export function BlogPostSchema({ post }) {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt,
      "author": {
        "@type": "Person",
        "name": "Your Name"
      },
      "image": post.coverImage,
      "description": post.summary,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://yourportfolio.com/blog/${post.slug}`
      }
    };
    
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    );
  }
  ```

#### Performance Features
- **Image Optimization Pipeline**:
  - Next.js Image optimization
  - WebP/AVIF format delivery
  - Responsive image sizing
  - Lazy loading implementation
  - Blur-up image placeholders

- **Core Web Vitals Optimization**:
  - First Contentful Paint (FCP) optimization
  - Largest Contentful Paint (LCP) optimization
  - Cumulative Layout Shift (CLS) prevention
  - First Input Delay (FID) improvement
  - Time to Interactive (TTI) optimization

### Accessibility Implementation

#### Accessible Design Patterns
- **Focus Management**:
  ```jsx
  // Example of focus trap for modals
  function Modal({ isOpen, onClose, children }) {
    const modalRef = useRef(null);
    
    useEffect(() => {
      if (isOpen) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        firstElement.focus();
        
        function handleTabKey(e) {
          if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
        
        modalRef.current.addEventListener('keydown', handleTabKey);
        return () => modalRef.current?.removeEventListener('keydown', handleTabKey);
      }
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    return (
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h2 id="modal-title" className="text-xl font-bold mb-4">Modal Title</h2>
          {children}
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  ```

- **Color Contrast Checker**:
  ```jsx
  // Example of utility function for checking color contrast
  function hasGoodContrast(foreground, background) {
    // Convert hex to RGB
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    
    // Calculate relative luminance
    const calculateLuminance = (rgb) => {
      const [r, g, b] = rgb.map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    
    const rgb1 = hexToRgb(foreground);
    const rgb2 = hexToRgb(background);
    
    const luminance1 = calculateLuminance(rgb1);
    const luminance2 = calculateLuminance(rgb2);
    
    const ratio = (Math.max(luminance1, luminance2) + 0.05) / 
                  (Math.min(luminance1, luminance2) + 0.05);
    
    return ratio >= 4.5; // WCAG AA standard
  }
  ```

#### Screen Reader Optimization
- Semantic HTML structure
- ARIA landmarks and roles
- Alt text for all images
- Skip-to-content links
- Keyboard navigation testing
- Screen reader announcements for dynamic content

### Additional Technical Enhancements

#### Data Caching Strategy
- **SWR Implementation**:
  ```jsx
  // Example of data fetching with SWR
  function ProjectList() {
    const { data, error, isLoading } = useSWR('/api/projects', fetcher, {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      refreshInterval: 60000 // Revalidate every minute
    });
    
    if (isLoading) return <ProjectListSkeleton />;
    if (error) return <ErrorMessage message="Failed to

## Interactive Features and User Experience

### Dynamic Content Loading
- **Infinite Scroll** for blog posts and project listings
- **Skeleton Loaders** for content during data fetching
- **Lazy Loading** for images and heavy components
- **Load-on-Demand** for content sections

### Interactive UI Components

#### Custom Cursor Effects
```jsx
// Example of custom cursor implementation
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <motion.div
      className="custom-cursor"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    />
  );
}
```

#### Advanced Project Showcase
- Interactive project previews with:
  - 3D card tilting effect on mouse move
  - Image carousels with swipe/drag functionality
  - Live demo iframe embeddings
  - Project video showcases
  - Interactive code snippets
  - Before/after image comparisons

#### Interactive Timeline Navigation
- Scrollable/draggable timeline with snap points
- Year/period quick jump navigation
- Animation between timeline events
- Highlighted current/selected event
- Auto-scrolling timeline with play/pause controls

### User Feedback Mechanisms

#### Form Interaction
- Real-time form validation
- Animated input focus states
- Success/error animations for form submissions
- Progress indicators for multi-step forms
- Auto-saving drafts for blog comments

#### Notification System
- Toast notifications for user actions
- Status indicators for async operations
- Confetti animations for achievements
- Feedback collection modals
- Undo functionality for critical actions

### Interactive Blog Features

#### Reading Experience
- Reading progress indicator
- Estimated reading time calculation
- Sticky table of contents with active section highlighting
- Code snippet syntax highlighting with copy button
- Image lightbox for full-screen viewing
- Text highlighting and sharing

#### Interactive Comments
- Comment threading with collapsible replies
- Comment reactions/likes
- Edit history for comments
- Rich text formatting in comments
- @mentions functionality
- Real-time comment updates

### Admin Panel Interactive Features

#### Dashboard Analytics
- Interactive charts and graphs
- Data filtering with animated transitions
- Draggable dashboard widgets
- Date range selection with animations
- Exportable reports with loading indicators

#### Content Management
- Drag-and-drop content ordering
- Rich text editor with live preview
- Media library with grid/list toggle views
- Bulk selection and actions
- Tag/category management with color coding

### Gamification Elements (Optional)
- Reading streaks for blog visitors
- Achievement badges for engagement
- Interactive easter eggs in UI
- "Kudos" or clap system for blog posts
- Share milestones on social media

## Conclusion

This technical document outlines the architecture, features, and implementation strategy for a dynamic portfolio website with an admin panel. The application uses modern web technologies including Next.js, Tailwind CSS, Framer Motion, and MongoDB to create a responsive, animated, and fully-featured portfolio website with a secure admin panel.

The system includes comprehensive content management features, blog functionality with analytics, and a secure authentication system with two-factor verification. The architecture is designed for scalability, performance, and security, while maintaining a focus on user experience and design aesthetics.

By following this technical documentation, you will be able to develop a professional, feature-rich portfolio website that showcases your work and skills while providing a secure and efficient way to manage your content.
