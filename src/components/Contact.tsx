'use client'

import { motion } from 'framer-motion'
import { Mail, Linkedin, Github } from 'lucide-react'

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: 'nishitrao1011@gmail.com',
    href: 'mailto:nishitrao1011@gmail.com',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: '/in/nishitprao',
    href: 'https://www.linkedin.com/in/nishitprao/',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: '@Oartihsin',
    href: 'https://github.com/Oartihsin',
  },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium tracking-widest text-accent uppercase mb-4">
            Get In Touch
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Let&apos;s Build Reliable Systems{' '}
            <span className="text-accent">Together</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto mb-10">
            Looking for an SRE or DevOps engineer who treats infrastructure as a product?
            Let&apos;s talk.
          </p>

          <a
            href="mailto:nishitrao1011@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full font-medium hover:bg-accent-dark transition-colors mb-12"
          >
            Start a Conversation
            <Mail size={16} />
          </a>
        </motion.div>

        {/* Contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid sm:grid-cols-3 gap-4"
        >
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.label !== 'Email' ? '_blank' : undefined}
              rel={contact.label !== 'Email' ? 'noopener noreferrer' : undefined}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-md hover:border-accent/30 transition-all group"
            >
              <contact.icon
                size={24}
                className="text-muted group-hover:text-accent transition-colors mx-auto mb-3"
              />
              <p className="text-xs text-muted mb-1">{contact.label}</p>
              <p className="font-medium text-gray-900 text-sm">{contact.value}</p>
            </a>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-border">
          <p className="text-sm text-muted">
            &copy; 2026 Nishit Rao. Building infra that doesn&apos;t page you at 3am.
          </p>
        </div>
      </div>
    </section>
  )
}
