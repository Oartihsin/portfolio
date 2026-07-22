const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'resume.json');

async function findResumePdf() {
  const files = fs.readdirSync(PUBLIC_DIR);
  const pdf = files.find(f => f.toLowerCase().includes('resume') && f.endsWith('.pdf'));
  if (!pdf) throw new Error('No resume PDF found in public/');
  return path.join(PUBLIC_DIR, pdf);
}

function parseContact(lines) {
  const name = lines[0].trim();
  const infoLine = lines[1] || '';
  const parts = infoLine.split('|').map(s => s.trim());

  let phone = '', email = '', linkedin = '', github = '';
  for (const p of parts) {
    if (p.match(/^\+?\d[\d\s-]+$/)) phone = p;
    else if (p.includes('@')) email = p;
    else if (p.includes('linkedin')) linkedin = 'https://' + p.replace(/^https?:\/\//, '');
    else if (p.includes('github')) github = 'https://' + p.replace(/^https?:\/\//, '');
  }

  // Fix known typo in resume PDF
  github = github.replace('Oartishin', 'Oartihsin');

  return { name, phone, email, linkedin, github };
}

function parseEducation(section) {
  const lines = section.split('\n').filter(l => l.trim());
  const institution = lines[0] ? lines[0].replace(/Chennai.*$/, '').trim() : '';
  const location = lines[0] ? (lines[0].match(/(Chennai|[A-Z][a-z]+),?\s*IN/) || [])[0] || '' : '';
  const degree = lines[1] ? lines[1].replace(/[A-Z][a-z]+\.?\s*\d{4}.*$/, '').trim() : '';
  const period = lines[1] ? (lines[1].match(/[A-Z][a-z]+\.?\s*\d{4}\s*[–-]\s*[A-Z][a-z]+\.?\s*\d{4}/) || [])[0] || '' : '';

  return [{ institution, location, degree, period }];
}

function parseExperience(section) {
  const experiences = [];
  const lines = section.split('\n');

  let current = null;
  const periodRegex = /([A-Z][a-z]+\.?\s+\d{4})\s*[–-]\s*(Present|[A-Z][a-z]+\.?\s*\d{4})/;
  const locationRegex = /(Bengaluru|Chennai|Mumbai|Hyderabad|Delhi|Pune|Remote),?\s*IN$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const periodMatch = line.match(periodRegex);

    if (periodMatch) {
      if (current) experiences.push(current);

      const role = line.replace(periodRegex, '').trim();
      const period = periodMatch[0].trim();

      const nextLine = lines[i + 1] || '';
      let company = '', location = '';

      const locMatch = nextLine.match(locationRegex);
      if (locMatch) {
        location = locMatch[0].trim();
        company = nextLine.slice(0, locMatch.index).trim();
      } else {
        company = nextLine.trim();
      }

      current = { company, role, period, location, bullets: [] };
      i++;
    } else if (line.trim().startsWith('•')) {
      if (current) current.bullets.push(line.trim().replace(/^•\s*/, '').trim());
    } else if (current && current.bullets.length > 0 && line.trim()) {
      current.bullets[current.bullets.length - 1] = (current.bullets[current.bullets.length - 1] + ' ' + line.trim()).trim();
    }
  }
  if (current) experiences.push(current);

  return experiences;
}

function parseSkills(section) {
  const lines = section.split('\n').join(' ');

  const langMatch = lines.match(/Languages:\s*(.*?)(?=Tech:|Developer Tools:|$)/);
  const techMatch = lines.match(/Tech:\s*(.*?)(?=Developer Tools:|$)/);
  const toolsMatch = lines.match(/Developer Tools:\s*(.*?)$/);

  const splitSkills = (str) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

  return {
    languages: splitSkills(langMatch ? langMatch[1] : ''),
    tech: splitSkills(techMatch ? techMatch[1] : ''),
    tools: splitSkills(toolsMatch ? toolsMatch[1] : ''),
  };
}

function buildSkillGroups(skills) {
  const awsServices = skills.tech.filter(s => s.startsWith('AWS') || s.match(/^\(.*\)$/));
  const awsFlat = skills.tech
    .filter(s => s.startsWith('AWS'))
    .map(s => s.replace(/^AWS\(/, '').replace(/\)$/, ''))
    .join(',')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const infraTools = ['Terraform', 'Helm', 'Istio', 'Docker', 'Linux', 'ArgoCD'];
  const cicdTools = ['Jenkins', 'ArgoCD'];
  const observability = ['Prometheus', 'Grafana', 'CloudWatch'];
  const messaging = ['Kafka', 'SQS'];

  const allTech = [...skills.tech, ...skills.tools];

  return [
    {
      category: 'Cloud & Infrastructure',
      skills: ['AWS', ...infraTools.filter(t => allTech.some(s => s.includes(t)))],
    },
    {
      category: 'CI/CD & Automation',
      skills: cicdTools.filter(t => allTech.some(s => s.includes(t))).concat(skills.tools.filter(t => ['Git', 'Docker'].includes(t))),
    },
    {
      category: 'Observability',
      skills: observability.filter(t => allTech.some(s => s.includes(t))),
    },
    {
      category: 'Languages',
      skills: skills.languages,
    },
    {
      category: 'Data & Messaging',
      skills: messaging.filter(t => allTech.some(s => s.includes(t))).concat(
        skills.languages.includes('SQL (Postgres)') ? ['PostgreSQL'] : []
      ),
    },
    {
      category: 'Developer Tools',
      skills: skills.tools,
    },
  ];
}

function extractCaseStudies(experiences) {
  const colors = [
    'from-blue-500 to-cyan-400',
    'from-violet-500 to-purple-400',
    'from-emerald-500 to-teal-400',
    'from-orange-500 to-amber-400',
    'from-rose-500 to-pink-400',
    'from-indigo-500 to-blue-400',
  ];

  const studies = [];
  for (const exp of experiences) {
    for (const bullet of exp.bullets) {
      // Only pick bullets with measurable impact
      const hasMetric = bullet.match(/(\d+[\d,]*[%+x]?|\d+\.\d+%|zero\s+downtime|self-serve|MTTR)/i);
      if (!hasMetric) continue;

      // Extract a concise title from the bullet
      let title = '';
      const actionMatch = bullet.match(/^(Built|Migrated|Designed|Engineered|Operated|Deployed|Led|Maintained|Developed|Implemented)\s+(.+?)(?:\s+(?:using|enabling|saving|reducing|eliminating|with|to|for|via|—|,\s))/i);
      if (actionMatch) {
        title = actionMatch[2].trim();
        title = title.replace(/^(an?|the|and)\s+/i, '');
        title = title.charAt(0).toUpperCase() + title.slice(1);
        if (title.length > 50) title = title.substring(0, 47) + '...';
      } else {
        title = bullet.split(/\s+/).slice(0, 6).join(' ');
      }

      // Extract metrics from the bullet
      const metrics = [];
      const percentMatch = bullet.match(/(\d{1,2}%)/);
      if (percentMatch && !bullet.match(/99\.\d+%/)) metrics.push({ value: percentMatch[1], label: 'Improvement' });

      const countMatch = bullet.match(/(\d[\d,]*\+?)\s+(tickets|servers|clusters|accounts|Kafka)/i);
      if (countMatch) metrics.push({ value: countMatch[1], label: countMatch[2] });

      if (bullet.match(/zero\s+downtime/i)) metrics.push({ value: 'Zero', label: 'Downtime' });

      const mttrMatch = bullet.match(/MTTR\s+(?:from\s+)?(\d+\s*\w+)\s+to\s+(\w+)/i);
      if (mttrMatch) metrics.push({ value: mttrMatch[2], label: 'MTTR' });

      const latencyMatch = bullet.match(/(\d+ms)/i);
      if (latencyMatch) metrics.push({ value: latencyMatch[1], label: 'Latency Saved' });

      const multiplierMatch = bullet.match(/(\dx)\s/i);
      if (multiplierMatch) metrics.push({ value: multiplierMatch[1], label: 'Scale' });

      if (bullet.match(/99\.\d+%/)) metrics.push({ value: bullet.match(/99\.\d+%/)[0], label: 'Availability' });

      // Dedupe metrics
      const seenLabels = new Set();
      const dedupedMetrics = metrics.filter(m => {
        if (seenLabels.has(m.label)) return false;
        seenLabels.add(m.label);
        return true;
      }).slice(0, 3);

      if (dedupedMetrics.length === 0) continue;

      studies.push({
        title,
        company: exp.company,
        color: colors[studies.length % colors.length],
        description: bullet,
        metrics: dedupedMetrics,
      });
    }
  }

  return studies;
}

function extractImpactStats(experiences) {
  const stats = [];
  const allBullets = experiences.flatMap(e => e.bullets);

  for (const bullet of allBullets) {
    // Pattern: "reducing X by N%" or "reduced X by N%"
    const reductionMatch = bullet.match(/reduc\w+\s+(.+?)\s+by\s+(\d+%)/i);
    if (reductionMatch) {
      stats.push({ value: reductionMatch[2], label: `${reductionMatch[1]} Reduction` });
      continue;
    }

    // Pattern: "N+ servers/clusters/tickets"
    const scaleMatch = bullet.match(/(\d[\d,]*\+?)\s+(servers|clusters|tickets|on-prem|accounts)/i);
    if (scaleMatch) {
      const noun = scaleMatch[2].toLowerCase();
      const label = noun === 'on-prem' ? 'On-prem Servers Managed' : `${noun.charAt(0).toUpperCase() + noun.slice(1)} Managed`;
      stats.push({ value: scaleMatch[1], label });
      continue;
    }

    // Pattern: "99.X% availability"
    const availMatch = bullet.match(/(99\.\d+%)\s*availability/i);
    if (availMatch) {
      stats.push({ value: availMatch[1], label: 'Availability SLA' });
      continue;
    }

    // Pattern: "Nx normal traffic" or "Nx improvement"
    const multiplierMatch = bullet.match(/(\dx)\s+(normal\s+)?traffic/i);
    if (multiplierMatch) {
      stats.push({ value: '50K+', label: 'RPM Peak Traffic Handled' });
      continue;
    }

    // Pattern: "zero downtime" — count occurrences across all bullets
    if (bullet.match(/zero\s+downtime/i) && !stats.some(s => s.label.includes('Downtime'))) {
      const count = allBullets.filter(b => b.match(/zero\s+downtime/i)).length;
      stats.push({ value: `${count}`, label: 'Zero-Downtime Migrations' });
      continue;
    }

    // Pattern: "eliminating N tickets/month" or "saving cost of N"
    const elimMatch = bullet.match(/eliminat\w+\s+(\d+[\d,]*\+?)\s+(.+?)(?:\/|per)/i);
    if (elimMatch) {
      stats.push({ value: elimMatch[1] + '+', label: `${elimMatch[2].trim()} Eliminated/mo` });
      continue;
    }

    // Pattern: "improvement of Nms" — skip, not impactful enough
    const latencyMatch = bullet.match(/improvement\s+of\s+(\d+ms)/i);
    if (latencyMatch) {
      continue;
    }
  }

  // Deduplicate by label similarity and cap at 6
  const seen = new Set();
  return stats.filter(s => {
    const key = s.label.toLowerCase().replace(/[^a-z]/g, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6);
}

async function main() {
  const pdfPath = await findResumePdf();
  const buf = fs.readFileSync(pdfPath);
  const { text } = await pdfParse(buf);

  const sections = {};
  const sectionHeaders = ['Education', 'Experience', 'Projects', 'Technical Skills'];
  let currentSection = 'header';
  let currentContent = [];

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (sectionHeaders.includes(trimmed)) {
      sections[currentSection] = currentContent.join('\n');
      currentSection = trimmed;
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  sections[currentSection] = currentContent.join('\n');

  const contact = parseContact(sections.header.split('\n').filter(l => l.trim()));
  const education = parseEducation(sections['Education'] || '');
  const experiences = parseExperience(sections['Experience'] || '');
  const skills = parseSkills(sections['Technical Skills'] || '');
  const skillGroups = buildSkillGroups(skills);
  const impactStats = extractImpactStats(experiences);
  const caseStudies = extractCaseStudies(experiences);

  const currentRole = experiences[0] || {};
  const yearsExp = new Date().getFullYear() - 2021;

  const resumeData = {
    contact,
    education,
    experiences,
    skills,
    skillGroups,
    impactStats,
    caseStudies,
    meta: {
      currentRole: currentRole.role || '',
      currentCompany: currentRole.company || '',
      yearsExperience: yearsExp,
      companiesCount: [...new Set(experiences.map(e => e.company.split(' - ')[0].trim()))].length,
    },
    pdfFilename: path.basename(pdfPath),
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(resumeData, null, 2));
  console.log(`✓ Parsed resume → ${OUTPUT_PATH}`);
  console.log(`  Name: ${contact.name}`);
  console.log(`  Role: ${currentRole.role} @ ${currentRole.company}`);
  console.log(`  Experience entries: ${experiences.length}`);
  console.log(`  Skill groups: ${skillGroups.length}`);
  console.log(`  Impact stats: ${impactStats.length}`);
  impactStats.forEach(s => console.log(`    ${s.value} — ${s.label}`));
}

main().catch(e => { console.error(e); process.exit(1); });
