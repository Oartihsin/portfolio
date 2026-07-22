'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const certifications = [
  {
    title: 'Red Hat Certified Engineer',
    abbrev: 'RHCE',
    issuer: 'Red Hat',
    tech: 'Ansible 2.8, RHEL 8',
    date: 'September 2019',
    certId: '190-124-339',
    pdf: '/portfolio/certs/rhce.pdf',
    image: '/portfolio/certs/rhce.png',
  },
  {
    title: 'Red Hat Certified System Administrator',
    abbrev: 'RHCSA',
    issuer: 'Red Hat',
    tech: 'Red Hat Enterprise Linux 8',
    date: 'May 2019',
    certId: '190-124-339',
    pdf: '/portfolio/certs/rhcsa.pdf',
    image: '/portfolio/certs/rhcsa.png',
  },
  {
    title: 'Red Hat Certified Specialist in Ansible Automation',
    abbrev: 'Ansible Specialist',
    issuer: 'Red Hat',
    tech: 'Ansible 2.3',
    date: 'June 2019',
    certId: '190-124-339',
    pdf: '/portfolio/certs/ansible-specialist.pdf',
    image: '/portfolio/certs/ansible-specialist.png',
  },
]

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-widest text-accent uppercase mb-4">
            Certifications
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Industry <span className="text-accent">Recognized</span>
          </h2>
          <p className="text-muted mt-4 text-lg">
            Validated expertise from Red Hat
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {certifications.map((cert, i) => (
            <motion.a
              key={cert.abbrev}
              href={cert.pdf}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all"
            >
              {/* Certificate preview image */}
              <div className="relative overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                  <span className="text-xs font-medium text-accent flex items-center gap-1">
                    View Certificate <ExternalLink size={12} />
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">
                  {cert.abbrev}
                </h3>
                <p className="text-sm text-muted mb-3">{cert.title}</p>

                <div className="space-y-1 text-xs text-muted">
                  <p><span className="font-medium text-gray-700">Tech:</span> {cert.tech}</p>
                  <p><span className="font-medium text-gray-700">Issued:</span> {cert.date}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
