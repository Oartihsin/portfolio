'use client'

import { motion } from 'framer-motion'
import { Building2, Shield, Cloud, Bot } from 'lucide-react'
import resumeData from '@/data/resume.json'

const highlights = [
  {
    icon: Building2,
    title: resumeData.meta.currentRole,
    subtitle: resumeData.meta.currentCompany,
  },
  {
    icon: Shield,
    title: resumeData.experiences[1]?.role || 'Sr. SRE',
    subtitle: resumeData.experiences[1]?.company || '',
  },
  {
    icon: Cloud,
    title: 'K8s + Terraform + AWS',
    subtitle: 'Core Stack',
  },
  {
    icon: Bot,
    title: 'AI-Powered DevOps',
    subtitle: 'LLM Tooling',
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.5 },
}

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left — text */}
        <motion.div {...fadeUp}>
          <p className="text-sm font-medium tracking-widest text-accent uppercase mb-4">
            About Me
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-6">
            Engineering Reliability,{' '}
            <span className="text-accent">Not Just Uptime</span>
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-6">
            I&apos;ve spent {resumeData.meta.yearsExperience}+ years making sure production doesn&apos;t ruin anyone&apos;s weekend.
            From migrating 7,000+ on-prem servers to automating Kafka provisioning with
            zero downtime — I build the boring infrastructure that makes exciting products possible.
          </p>
          <p className="text-muted text-lg leading-relaxed">
            At {resumeData.meta.currentCompany}, I build AI-powered debugging tools, automate Confluent Kafka at scale,
            and optimize cross-region traffic. Before that, I designed alerting schemas that cut
            noise by 80% and wrote RCAs under IPL-scale pressure.
          </p>
          <div className="mt-8 pl-4 border-l-2 border-accent">
            <p className="text-gray-800 italic">
              &ldquo;From on-prem migrations to AI-powered DevOps — I build systems that perform.&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Right — highlight cards */}
        <div className="grid grid-cols-2 gap-4">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <item.icon size={20} className="text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted">{item.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
