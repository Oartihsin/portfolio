'use client'

import { motion } from 'framer-motion'
import Marquee from 'react-fast-marquee'
import resumeData from '@/data/resume.json'

export default function CaseStudies() {
  return (
    <section id="case-studies" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
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
      </div>

      {/* Marquee — full bleed, no container max-width */}
      <Marquee
        speed={40}
        gradient={false}
        pauseOnHover={true}
        autoFill={true}
        className="py-4"
      >
        {resumeData.caseStudies.map((study, i) => (
          <div
            key={study.title + i}
            className="mx-4 w-[350px] md:w-[400px] bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow shrink-0"
          >
            {/* Gradient top bar */}
            <div className={`h-1.5 bg-gradient-to-r ${study.color}`} />

            <div className="p-6">
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-1 truncate">
                {study.title}
              </h3>
              <p className="text-xs font-medium text-accent mb-3">{study.company}</p>

              <p className="text-muted text-sm leading-relaxed mb-5 line-clamp-3">
                {study.description}
              </p>

              {/* Metrics */}
              <div className="flex gap-6 pt-4 border-t border-border">
                {study.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="font-heading text-xl font-bold text-accent">
                      {metric.value}
                    </div>
                    <div className="text-xs text-muted mt-0.5">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  )
}
