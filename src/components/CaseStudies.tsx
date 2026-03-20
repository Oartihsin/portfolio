'use client'

import { motion } from 'framer-motion'

const caseStudies = [
  {
    title: 'Kafka IaaC Migration',
    color: 'from-blue-500 to-cyan-400',
    problem: 'Manual Confluent Kafka provisioning — slow, error-prone, and risky with potential downtime on every change.',
    solution: [
      'Designed automated IaaC-based provisioning model',
      'Terraform modules for topic, ACL, and cluster config',
      'Zero-touch provisioning pipeline with validation gates',
    ],
    metrics: [
      { value: '0', label: 'Downtime' },
      { value: '100%', label: 'Automated' },
    ],
  },
  {
    title: 'Kafka Confluent MCP Server',
    color: 'from-violet-500 to-purple-400',
    problem: 'Kafka cluster debugging requires deep Confluent CLI expertise — consumer lag, topic inspection, and broker health checks are inaccessible to most engineers.',
    solution: [
      'Built an MCP server exposing Confluent Kafka operations via natural language through Claude Code',
      'Topic management, consumer group inspection, lag monitoring',
      'Self-serve debugging with zero Kafka CLI knowledge',
    ],
    metrics: [
      { value: '<2 min', label: 'Debug MTTR' },
      { value: 'Self-serve', label: 'Access Model' },
    ],
  },
]

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
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Gradient top bar */}
              <div className={`h-1.5 bg-gradient-to-r ${study.color}`} />

              <div className="p-8">
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-6">
                  {study.title}
                </h3>

                {/* Problem */}
                <div className="mb-6">
                  <p className="text-xs font-semibold tracking-widest text-red-500 uppercase mb-2">
                    Problem
                  </p>
                  <p className="text-muted text-sm leading-relaxed">
                    {study.problem}
                  </p>
                </div>

                {/* Solution */}
                <div className="mb-8">
                  <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-2">
                    Solution
                  </p>
                  <ul className="space-y-2 list-disc list-outside pl-5 marker:text-emerald-500">
                    {study.solution.map((point) => (
                      <li
                        key={point}
                        className="text-muted text-sm leading-relaxed"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics */}
                <div className="flex gap-8 pt-6 border-t border-border">
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
