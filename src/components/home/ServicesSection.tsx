"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const services = [
  {
    id: 1,
    title: "Web Development",
    shortDesc: "Modern, scalable web solutions",
    description: "Building responsive, high-performance web applications with cutting-edge technologies. From concept to deployment, I create digital experiences that drive results.",
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    features: [
      { name: "React & Next.js", desc: "Modern frameworks" },
      { name: "Full-Stack Solutions", desc: "End-to-end development" },
      { name: "API Development", desc: "RESTful & GraphQL" },
      { name: "Performance", desc: "Optimized & fast" }
    ],
    color: "blue",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "UI/UX Design",
    shortDesc: "Beautiful, intuitive interfaces",
    description: "Crafting user experiences that delight and engage. I blend aesthetics with functionality to create designs that not only look great but work seamlessly.",
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    features: [
      { name: "User Research", desc: "Data-driven insights" },
      { name: "Wireframing", desc: "Clear structure" },
      { name: "Prototyping", desc: "Interactive mockups" },
      { name: "Design Systems", desc: "Scalable components" }
    ],
    color: "purple",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Mobile Development",
    shortDesc: "Native-quality mobile apps",
    description: "Developing cross-platform mobile applications that deliver native performance. Your app will work flawlessly on both iOS and Android devices.",
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    features: [
      { name: "React Native", desc: "Cross-platform" },
      { name: "iOS & Android", desc: "Dual deployment" },
      { name: "App Store", desc: "Full publishing" },
      { name: "Push Notifications", desc: "User engagement" }
    ],
    color: "green",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    title: "Consulting",
    shortDesc: "Expert technical guidance",
    description: "Providing strategic technical consulting to help you make informed decisions. From architecture to optimization, I guide teams to success.",
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    features: [
      { name: "Architecture", desc: "Scalable design" },
      { name: "Code Review", desc: "Quality assurance" },
      { name: "Optimization", desc: "Peak performance" },
      { name: "Team Training", desc: "Knowledge transfer" }
    ],
    color: "orange",
    gradient: "from-orange-500 to-red-500"
  },
];

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(1);
  const active = services.find(s => s.id === activeService) || services[0];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 mb-6"
          >
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What I Do
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive services to bring your digital vision to life
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Service Tabs - Left Side */}
            <div className="lg:col-span-2 flex flex-col justify-between gap-3">
              {services.map((service, index) => (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveService(service.id)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 group relative overflow-hidden flex-1 ${
                    activeService === service.id
                      ? 'bg-gradient-to-br from-gray-900 to-gray-800 dark:from-blue-500/20 dark:to-purple-500/20 text-white shadow-xl scale-105'
                      : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {/* Active indicator */}
                  {activeService === service.id && (
                    <motion.div
                      layoutId="activeService"
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${service.gradient}`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="relative z-10 flex items-start gap-4">
                    {/* Icon */}
                    <motion.div
                      className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                        activeService === service.id
                          ? `bg-gradient-to-br ${service.gradient} text-white shadow-lg`
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {service.icon}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-lg mb-1 transition-colors ${
                        activeService === service.id ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}>
                        {service.title}
                      </h3>
                      <p className={`text-sm transition-colors ${
                        activeService === service.id ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {service.shortDesc}
                      </p>
                    </div>

                    {/* Arrow */}
                    <motion.svg
                      className={`w-5 h-5 transition-all ${
                        activeService === service.id ? 'text-white opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={activeService === service.id ? { x: [0, 5, 0] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Content Display - Right Side */}
            <div className="lg:col-span-3 flex">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-2xl w-full flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start gap-6 mb-8">
                    <motion.div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${active.gradient} flex items-center justify-center text-white shadow-xl`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {active.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {active.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                        {active.description}
                      </p>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="grid sm:grid-cols-2 gap-4 flex-1">
                    {active.features.map((feature, index) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative"
                      >
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg h-full">
                          {/* Dot */}
                          <motion.div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${active.gradient} mt-2 flex-shrink-0`}
                            whileHover={{ scale: 1.5 }}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {feature.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {feature.desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 flex gap-4 flex-shrink-0"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-xl bg-gradient-to-r ${active.gradient} text-white font-medium shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      Get Started
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    >
                      Learn More
                    </motion.button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
