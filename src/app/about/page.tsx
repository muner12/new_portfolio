import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Portfolio',
  description: 'Learn more about my background, skills, and experience',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About Me</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. 
            Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus 
            rhoncus ut eleifend nibh porttitor. Ut in nulla enim.
          </p>
          
          <p>
            Phasellus molestie magna non est bibendum non venenatis nisl tempor. 
            Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. 
            Praesent id metus massa, ut blandit odio.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Skills</h2>
          
          <ul>
            <li>JavaScript/TypeScript</li>
            <li>React.js & Next.js</li>
            <li>Node.js & Express</li>
            <li>MongoDB & SQL</li>
            <li>HTML5, CSS3, Tailwind CSS</li>
            <li>UI/UX Design</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Experience</h2>
          
          <p>
            I have over 5 years of experience building web applications and digital 
            experiences for clients across various industries. My focus is on creating 
            clean, performant, and accessible websites that provide excellent user experiences.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Education</h2>
          
          <p>
            Bachelor of Science in Computer Science<br />
            University of Technology<br />
            2015 - 2019
          </p>
        </div>
      </div>
    </div>
  );
} 