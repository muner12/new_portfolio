"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const experiences = [
  {
    id: 1,
    year: "2023 - Present",
    title: "Senior Full Stack Developer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Leading the development of enterprise-level web applications. Architecting scalable solutions and mentoring junior developers.",
    achievements: [
      "Led team of 5 developers",
      "Improved performance by 60%",
      "Implemented CI/CD pipeline"
    ],
    technologies: ["React", "Node.js", "AWS", "Docker"],
    color: "blue",
  },
  {
    id: 2,
    year: "2021 - 2023",
    title: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    location: "New York, NY",
    type: "Full-time",
    description: "Developed and maintained multiple client projects using React, Node.js, and MongoDB. Collaborated with designers and stakeholders.",
    achievements: [
      "Delivered 20+ projects",
      "Achieved 98% client satisfaction",
      "Reduced bug reports by 40%"
    ],
    technologies: ["React", "MongoDB", "GraphQL", "Next.js"],
    color: "purple",
  },
  {
    id: 3,
    year: "2020 - 2021",
    title: "Frontend Developer",
    company: "Creative Agency Co.",
    location: "Austin, TX",
    type: "Contract",
    description: "Built responsive web interfaces and interactive user experiences. Worked with modern frontend frameworks and libraries.",
    achievements: [
      "Created 15+ responsive websites",
      "Implemented design system",
      "Optimized loading speed"
    ],
    technologies: ["React", "TypeScript", "Tailwind", "Figma"],
    color: "green",
  },
  {
    id: 4,
    year: "2019 - 2020",
    title: "Junior Developer",
    company: "StartupHub",
    location: "Remote",
    type: "Full-time",
    description: "Started my professional journey. Learned modern development practices and contributed to various projects.",
    achievements: [
      "Completed 10+ features",
      "Fixed 100+ bugs",
      "Earned Developer of the Month"
    ],
    technologies: ["JavaScript", "HTML/CSS", "Git", "REST APIs"],
    color: "orange",
  }
];

const colorClasses = {
  blue: {
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500",
    line: "bg-blue-500",
  },
  purple: {
    badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    dot: "bg-purple-500",
    line: "bg-purple-500",
  },
  green: {
    badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    dot: "bg-green-500",
    line: "bg-green-500",
  },
  orange: {
    badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    dot: "bg-orange-500",
    line: "bg-orange-500",
  },
};

export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section 
      ref={containerRef} 
      className="py-24 bg-white dark:bg-gray-900 relative"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Experience Journey
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            My professional path and key milestones
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 md:transform md:-translate-x-1/2">
            <motion.div
              className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Experience Items */}
          <div className="space-y-16">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;
              const colors = colorClasses[exp.color as keyof typeof colorClasses];

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={`flex flex-col md:flex-row items-start md:items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content Card */}
                    <div className="w-full md:w-[calc(50%-3rem)] ml-20 md:ml-0">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        {/* Header */}
                        <div className="mb-6">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors.badge}`}>
                              {exp.year}
                            </span>
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {exp.type}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {exp.title}
                          </h3>
                          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            {exp.company}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {exp.location}
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Achievements */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Key Achievements
                          </h4>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-1.5 flex-shrink-0`} />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Technologies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 flex items-center justify-center">
                      <motion.div
                        className={`w-4 h-4 rounded-full ${colors.dot} border-4 border-white dark:border-gray-900 shadow-lg z-10`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 300, delay: index * 0.1 }}
                      />
                    </div>

                    {/* Empty Space */}
                    <div className="hidden md:block w-[calc(50%-3rem)]" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
