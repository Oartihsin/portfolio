'use client'

import { motion } from 'framer-motion'

const experiences = [
  {
    company: 'Swiggy',
    role: 'DevOps Engineer III',
    period: 'Jan 2025 — Present',
    location: 'Bengaluru',
    bullets: [
      'Built AI-based CMR Enforcement tool using LLMs, AWS Lambda, and Python to automate change management',
      'Migrated manual Confluent Kafka provisioning to automated IaaC model with zero downtime',
      'Optimized cross-region traffic with Global Accelerators, reducing latency significantly',
    ],
  },
  {
    company: 'Direct I — Zeta Team',
    role: 'Sr. Site Reliability Engineer',
    period: 'Jun 2023 — Dec 2024',
    location: 'Bengaluru',
    bullets: [
      'Led enterprise-level automation for microservices saving cost of 1 FTE/month using Python, Jenkins, Helm',
      'Designed alerting schema reducing unwanted alerts by 80% using Prometheus, Grafana, and EKS',
      'Authored in-depth RCAs within SLA/SLO targets during IPL 2024 campaign ensuring production stability',
    ],
  },
  {
    company: 'Direct I — Titan Email Team',
    role: 'DevOps Engineer II',
    period: 'Sep 2022 — May 2023',
    location: 'Bengaluru',
    bullets: [
      'Deployed OpenDKIM as a Go service, eliminating excessive RAM consumption from legacy implementation',
      'Automated password rotation for improved security; built serverless mail delivery insights with AWS Lambda',
    ],
  },
  {
    company: 'Newfold Digital',
    role: 'Operations Engineer',
    period: 'Jun 2021 — Aug 2022',
    location: 'Bengaluru',
    bullets: [
      'Migrated 7,000+ on-prem servers to SaaS for email delivery and security',
      'Built an OpenShift operator for a highly available private RPM mirror using Golang',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-widest text-accent uppercase mb-4">
            Experience
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Where I&apos;ve <span className="text-accent">Shipped</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company + exp.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative pl-8 md:pl-20"
              >
                {/* Dot on timeline */}
                <div className="absolute left-0 md:left-8 top-2 w-2.5 h-2.5 rounded-full bg-accent -translate-x-1" />

                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-gray-900">
                      {exp.role}
                    </h3>
                    <p className="text-accent font-medium">{exp.company}</p>
                  </div>
                  <p className="text-sm text-muted mt-1 md:mt-0">
                    {exp.period} · {exp.location}
                  </p>
                </div>

                <ul className="mt-3 space-y-2 list-disc list-outside pl-5 marker:text-accent">
                  {exp.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-muted text-sm leading-relaxed"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
