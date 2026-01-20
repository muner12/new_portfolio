"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

const skills = [
  {
    category: "Frontend",
    items: [
      { name: "React", level: 95, icon: "⚛️", color: "from-cyan-500 to-blue-500" },
      { name: "Next.js", level: 90, icon: "▲", color: "from-gray-700 to-gray-900" },
      { name: "TypeScript", level: 88, icon: "TS", color: "from-blue-600 to-blue-700" },
      { name: "Tailwind CSS", level: 92, icon: "🎨", color: "from-teal-400 to-cyan-500" },
    ]
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", level: 90, icon: "🟢", color: "from-green-600 to-green-700" },
      { name: "MongoDB", level: 85, icon: "🍃", color: "from-green-500 to-green-600" },
      { name: "PostgreSQL", level: 82, icon: "🐘", color: "from-blue-500 to-indigo-600" },
      { name: "GraphQL", level: 80, icon: "◈", color: "from-pink-500 to-purple-600" },
    ]
  },
  {
    category: "Tools & Others",
    items: [
      { name: "Git", level: 90, icon: "📊", color: "from-orange-500 to-red-500" },
      { name: "Docker", level: 75, icon: "🐳", color: "from-blue-400 to-blue-600" },
      { name: "AWS", level: 70, icon: "☁️", color: "from-yellow-500 to-orange-500" },
      { name: "Figma", level: 85, icon: "🎭", color: "from-purple-500 to-pink-500" },
    ]
  }
];

export default function SkillsSection() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated background circles */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0]
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
            Skills & Expertise
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.2 }}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
                {category.category}
              </h3>

              <div className="space-y-6">
                {category.items.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: categoryIndex * 0.2 + skillIndex * 0.1 }}
                    onHoverStart={() => setHoveredSkill(skill.name)}
                    onHoverEnd={() => setHoveredSkill(null)}
                    className="relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <motion.span 
                          className="text-2xl"
                          animate={hoveredSkill === skill.name ? { 
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.2, 1]
                          } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {skill.icon}
                        </motion.span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {skill.name}
                        </span>
                      </div>
                      <motion.span 
                        className="text-sm font-semibold text-gray-600 dark:text-gray-400"
                        animate={hoveredSkill === skill.name ? { scale: 1.2 } : { scale: 1 }}
                      >
                        {skill.level}%
                      </motion.span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.3 }}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={hoveredSkill === skill.name ? {
                            x: ['-100%', '200%']
                          } : {}}
                          transition={{ duration: 1, repeat: hoveredSkill === skill.name ? Infinity : 0 }}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
