'use client'

import { motion } from 'framer-motion'
import { MapPin, ArrowDown, Download } from 'lucide-react'
import resumeData from '@/data/resume.json'

const stats = [
  { value: `${resumeData.meta.yearsExperience}+`, label: 'Years Experience' },
  { value: `${resumeData.meta.companiesCount}`, label: 'Companies Scaled' },
  { value: '80%', label: 'Alert Reduction' },
  { value: '0', label: 'Downtime Migrations' },
]

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto"
      >
        {/* Location badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border text-muted text-sm mb-8">
          <MapPin size={14} className="text-accent" />
          Bengaluru, India
        </div>

        {/* Name */}
        <h2 className="font-heading text-lg tracking-widest text-muted uppercase mb-2">
          {resumeData.contact.name}
        </h2>

        {/* Role badges */}
        <p className="text-sm tracking-wider text-muted/70 uppercase mb-8">
          {resumeData.meta.currentRole} · {resumeData.meta.currentCompany}
        </p>

        {/* Headline */}
        <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6">
          I Build Infra That{' '}
          <span className="text-accent">Doesn&apos;t Page You</span>{' '}
          at 3am
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          {resumeData.meta.currentRole} at {resumeData.meta.currentCompany}. Building resilient, automated infrastructure
          across Kubernetes, AWS, and Confluent Kafka — so your team ships fast and sleeps well.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#case-studies"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full font-medium hover:bg-accent-dark transition-colors"
          >
            View My Work
            <ArrowDown size={16} />
          </a>
          <a
            href={`/portfolio/${resumeData.pdfFilename}`}
            download
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-border text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors"
          >
            Download Resume
            <Download size={16} />
          </a>
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-2xl border border-border p-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl font-bold text-accent">
                {stat.value}
              </div>
              <div className="text-sm text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
