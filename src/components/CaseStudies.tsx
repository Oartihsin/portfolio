'use client'

import { motion } from 'framer-motion'
import resumeData from '@/data/resume.json'

export default function CaseStudies() {
  return (
    <section id="case-studies" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-widest text-accent uppercase mb-4">
            Case Studies
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Impact <span className="text-accent">Delivered</span>
          </h2>
          <p className="text-muted mt-4 text-lg">
            Real projects with measurable outcomes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {resumeData.caseStudies.map((study, i) => (
            <motion.div
              key={study.title + i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Gradient top bar */}
              <div className={`h-1.5 bg-gradient-to-r ${study.color}`} />

              <div className="p-8">
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                  {study.title}
                </h3>
                <p className="text-xs font-medium text-accent mb-4">{study.company}</p>

                <p className="text-muted text-sm leading-relaxed mb-6">
                  {study.description}
                </p>

                {/* Metrics */}
                <div className="flex gap-8 pt-5 border-t border-border">
                  {study.metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="font-heading text-2xl font-bold text-accent">
                        {metric.value}
                      </div>
                      <div className="text-xs text-muted mt-1">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
