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

  const currentRole = experiences[0] || {};
  const yearsExp = new Date().getFullYear() - 2021;

  const resumeData = {
    contact,
    education,
    experiences,
    skills,
    skillGroups,
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
}

main().catch(e => { console.error(e); process.exit(1); });
