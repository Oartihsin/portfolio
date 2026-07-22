import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import CaseStudies from '@/components/CaseStudies'
import Skills from '@/components/Skills'
import Certifications from '@/components/Certifications'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <CaseStudies />
      <Skills />
      <Certifications />
      <Contact />
    </main>
  )
}
