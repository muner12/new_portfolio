import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Portfolio',
  description: 'Explore my projects and case studies',
};

// This would normally fetch from an API but we're using dummy data for now
const projects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A modern e-commerce solution built with React, Node.js, and MongoDB. Features include product catalog, cart functionality, user authentication, payment processing, and order management.',
    image: '/images/project1.jpg',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
    githubLink: 'https://github.com/',
    demoLink: 'https://example.com/',
    slug: 'e-commerce-platform',
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A productivity tool for teams with real-time collaboration features. Includes task assignment, due dates, comments, file attachments, and progress tracking.',
    image: '/images/project2.jpg',
    technologies: ['Next.js', 'Firebase', 'Tailwind CSS', 'React Query'],
    githubLink: 'https://github.com/',
    demoLink: 'https://example.com/',
    slug: 'task-management-app',
  },
  {
    id: '3',
    title: 'Health Monitoring System',
    description: 'A health tracking application with data visualization and insights. Users can log health metrics, track progress, and receive personalized recommendations.',
    image: '/images/project3.jpg',
    technologies: ['React', 'GraphQL', 'D3.js', 'MongoDB', 'Express'],
    githubLink: 'https://github.com/',
    demoLink: 'https://example.com/',
    slug: 'health-monitoring-system',
  },
  {
    id: '4',
    title: 'Personal Finance Dashboard',
    description: 'A comprehensive finance tracking application that helps users manage expenses, income, investments, and savings goals with interactive charts and reports.',
    image: '/images/project-placeholder.jpg',
    technologies: ['Vue.js', 'Node.js', 'PostgreSQL', 'Chart.js'],
    githubLink: 'https://github.com/',
    demoLink: 'https://example.com/',
    slug: 'personal-finance-dashboard',
  },
  {
    id: '5',
    title: 'Social Media Analytics Tool',
    description: 'A marketing tool that aggregates and analyzes social media performance across platforms, providing actionable insights to improve engagement and reach.',
    image: '/images/project-placeholder.jpg',
    technologies: ['React', 'Python', 'Django', 'TensorFlow', 'Redis'],
    githubLink: 'https://github.com/',
    slug: 'social-media-analytics-tool',
  },
  {
    id: '6',
    title: 'AI-Powered Image Editor',
    description: 'A web-based image editing application with AI features like style transfer, object removal, and automatic enhancement.',
    image: '/images/project-placeholder.jpg',
    technologies: ['JavaScript', 'TensorFlow.js', 'WebGL', 'Canvas API'],
    githubLink: 'https://github.com/',
    demoLink: 'https://example.com/',
    slug: 'ai-powered-image-editor',
  },
];

export default function ProjectsPage() {
  // This would normally use dynamic imports for the ProjectCard component
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Projects</h1>
        
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl">
          Explore a selection of my recent projects. Each project reflects my passion
          for creating clean, user-friendly applications with modern technologies.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div key={project.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-48">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full dark:bg-gray-800 dark:text-gray-200">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <a 
                    href={`/projects/${project.slug}`}
                    className="text-primary hover:text-blue-700 font-medium transition-colors"
                  >
                    View Details
                  </a>
                  <div className="flex gap-3">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        aria-label={`GitHub repository for ${project.title}`}
                      >
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    )}
                    {project.demoLink && (
                      <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        aria-label={`Live demo for ${project.title}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 