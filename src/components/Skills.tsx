'use client'

import { motion } from 'framer-motion'
import resumeData from '@/data/resume.json'

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-widest text-accent uppercase mb-4">
            Tech Stack
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Tools I <span className="text-accent">Work With</span>
          </h2>
        </motion.div>

        <div className="space-y-8">
          {resumeData.skillGroups.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <span className="text-sm font-medium text-muted w-48 shrink-0">
                {group.category}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-full bg-surface border border-border text-sm text-gray-800 hover:border-accent hover:text-accent transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
