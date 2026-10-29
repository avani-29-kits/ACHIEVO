
import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowDownRight, ArrowLeft, ArrowRight, Award, BookOpen,
  BriefcaseBusiness, Check, ChevronDown, Code2, ExternalLink,
  Github, GraduationCap, Linkedin, Mail, Medal, Menu, Search,
  Share2, Sparkles, Star, Trophy, X
} from "lucide-react";
import "./portfolio.css";

const students = [
  {
    id: "avani",
    name: "Avani",
    initials: "A",
    degree: "B.Tech · Computer Science",
    year: "3rd Year",
    location: "India",
    tagline: "Building things that make a difference.",
    bio: "A computer science student exploring software development, embedded systems, and creative technology. I enjoy turning ideas into useful projects and learning by building.",
    accent: "gold",
    category: "Development",
    email: "hello@example.com",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    skills: ["Java", "Python", "React", "JavaScript", "SQL", "Embedded Systems"],
    interests: ["Web Development", "Problem Solving", "IoT"],
    education: [
      { year: "2024 — Present", title: "B.Tech in Computer Science", detail: "Undergraduate studies · 3rd Year" },
      { year: "2024", title: "Started the journey", detail: "Exploring software, technology and problem solving" }
    ],
    achievements: [
      { icon: "trophy", title: "Project Showcase", detail: "Presented a technology project at a student expo", year: "2026" },
      { icon: "award", title: "DSA Practice", detail: "Building consistency through coding problems", year: "2026" },
      { icon: "star", title: "Learning in Public", detail: "Documenting projects and the student journey", year: "2026" }
    ],
    projects: [
      { number: "01", name: "Air Quality Monitor", type: "Embedded Systems", description: "A sensor-based monitoring node designed to track environmental conditions and display readings on a dashboard.", tags: ["ESP8266", "Sensors", "IoT"], link: "https://github.com/" },
      { number: "02", name: "Architecture Studio", type: "Web Development", description: "A modern, responsive architecture website with a cinematic visual style and polished layouts.", tags: ["React", "CSS", "Vite"], link: "https://github.com/" },
      { number: "03", name: "Student Achievement Portfolio", type: "Web Development", description: "A personal space to bring together projects, skills, education, and achievements in one place.", tags: ["React", "UI Design"], link: "https://github.com/" }
    ],
    certificates: [
      { title: "Technical Learning", issuer: "Add your certificate issuer", year: "2026" },
      { title: "Project Participation", issuer: "Add your event or organization", year: "2026" }
    ]
  },
  {
    id: "arjun",
    name: "Arjun Mehta",
    initials: "AM",
    degree: "B.Tech · Information Technology",
    year: "3rd Year",
    location: "India",
    tagline: "Curious mind. Thoughtful code.",
    bio: "An aspiring developer interested in full-stack applications, clean interfaces, and solving practical problems through technology.",
    accent: "blue",
    category: "Development",
    email: "arjun@example.com",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Git"],
    interests: ["Full Stack", "UI Engineering", "Open Source"],
    education: [
      { year: "2024 — Present", title: "B.Tech in Information Technology", detail: "Undergraduate studies · 3rd Year" },
      { year: "2024", title: "Started building projects", detail: "Learning modern web technologies" }
    ],
    achievements: [
      { icon: "trophy", title: "Team Project", detail: "Collaborative software development", year: "2026" },
      { icon: "star", title: "Developer Journey", detail: "Practising and building consistently", year: "2026" }
    ],
    projects: [
      { number: "01", name: "Campus Connect", type: "Web Development", description: "A concept for helping students discover campus events and connect with peers.", tags: ["React", "Node.js"], link: "https://github.com/" },
      { number: "02", name: "Task Space", type: "Productivity", description: "A clean task-management interface designed around simple workflows.", tags: ["JavaScript", "CSS"], link: "https://github.com/" }
    ],
    certificates: [
      { title: "Web Development", issuer: "Add certificate issuer", year: "2026" }
    ]
  },
  {
    id: "priya",
    name: "Priya Sharma",
    initials: "PS",
    degree: "B.Tech · Computer Science",
    year: "2nd Year",
    location: "India",
    tagline: "Designing with purpose, learning with curiosity.",
    bio: "A student exploring the intersection of technology and design, with a growing interest in accessible interfaces and creative problem solving.",
    accent: "rose",
    category: "Design",
    email: "priya@example.com",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    skills: ["Figma", "HTML", "CSS", "JavaScript", "UI Design"],
    interests: ["Product Design", "Accessibility", "Creative Coding"],
    education: [
      { year: "2025 — Present", title: "B.Tech in Computer Science", detail: "Undergraduate studies · 2nd Year" },
      { year: "2025", title: "Exploring interface design", detail: "Learning design tools and web fundamentals" }
    ],
    achievements: [
      { icon: "award", title: "Design Exploration", detail: "Creating interface concepts and prototypes", year: "2026" },
      { icon: "star", title: "Creative Practice", detail: "Developing a personal design portfolio", year: "2026" }
    ],
    projects: [
      { number: "01", name: "Mindful Minutes", type: "UI/UX Design", description: "A calm, accessible interface concept for a daily mindfulness habit.", tags: ["Figma", "UI Design"], link: "https://github.com/" },
      { number: "02", name: "Campus Guide", type: "Web Development", description: "A student-friendly concept for navigating campus resources.", tags: ["HTML", "CSS"], link: "https://github.com/" }
    ],
    certificates: [
      { title: "Design Fundamentals", issuer: "Add certificate issuer", year: "2026" }
    ]
  }
];

const categories = ["All students", "Development", "Design"];

function Mark({ small = false }) {
  return (
    <Link to="/portfolio" className={`portfolio-mark ${small ? "mark-small" : ""}`}>
      <span className="mark-symbol">a.</span>
      <span>ACHIEVO<span className="mark-period">.</span></span>
    </Link>
  );
}

function Header({ detail = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="portfolio-header">
      <Mark />
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav className={`portfolio-nav ${menuOpen ? "nav-open" : ""}`}>
        <Link to="/portfolio" onClick={() => setMenuOpen(false)}>Discover</Link>
        <a href="/#projects">Projects</a>
        <a href="/#about">About ACHIEVO</a>
        <Link className="nav-cta" to="/portfolio/avani" onClick={() => setMenuOpen(false)}>
          {detail ? "My Portfolio" : "View my portfolio"} <ArrowRight size={15} />
        </Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="portfolio-footer">
      <Mark small />
      <span>Made for the next generation of doers.</span>
      <a href="mailto:hello@example.com">Get in touch <ArrowRight size={14} /></a>
    </footer>
  );
}

function Avatar({ student, large = false }) {
  return (
    <div className={`portfolio-avatar avatar-${student.accent} ${large ? "avatar-large" : ""}`}>
      <span>{student.initials}</span>
      <span className="avatar-spark"><Sparkles size={large ? 17 : 13} /></span>
    </div>
  );
}

function Directory() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All students");

  const filteredStudents = useMemo(() => students.filter((student) => {
    const query = search.toLowerCase().trim();
    const matchesSearch = !query ||
      `${student.name} ${student.degree} ${student.skills.join(" ")} ${student.interests.join(" ")}`
        .toLowerCase().includes(query);
    const matchesCategory = activeCategory === "All students" || student.category === activeCategory;
    return matchesSearch && matchesCategory;
  }), [search, activeCategory]);

  return (
    <div className="portfolio-page">
      <Header />

      <main>
        <section className="directory-hero">
          <div className="directory-hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> THE STUDENT SHOWCASE</div>
            <h1>Potential is great.<br /><em>Proof is better.</em></h1>
            <p className="directory-intro">
              A space for ambitious students to make their work visible.
              Discover projects, skills, and the people building what comes next.
            </p>
            <a href="#discover" className="text-link">Meet the community <ArrowDownRight size={17} /></a>
          </div>

          <div className="hero-art" aria-label="Decorative portfolio illustration">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-paper">
              <div className="paper-top"><span>ACHIEVO / 2026</span><span>✳</span></div>
              <div className="paper-avatar">a.</div>
              <div className="paper-line paper-line-long" />
              <div className="paper-line paper-line-medium" />
              <div className="paper-mini-grid"><span /><span /><span /></div>
              <div className="paper-bottom">YOUR WORK, YOUR STORY.</div>
            </div>
            <div className="art-sticker sticker-top"><Sparkles size={16} /> MADE TO GROW</div>
            <div className="art-sticker sticker-bottom"><Star size={16} /> EVERY STEP COUNTS</div>
            <span className="art-doodle">✳</span>
          </div>
          <div className="hero-index">01 <span /> A PORTFOLIO FOR EVERY POSSIBILITY</div>
        </section>

        <section className="directory-section" id="discover">
          <div className="section-heading">
            <div>
              <div className="eyebrow">THE COMMUNITY</div>
              <h2>Meet the <em>doers.</em></h2>
            </div>
            <p>Every student has a story worth sharing.<br />Here's where those stories begin.</p>
          </div>

          <div className="directory-controls">
            <label className="portfolio-search">
              <Search size={18} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students, skills, interests..." />
              {search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={16} /></button>}
            </label>
            <div className="category-filters">
              {categories.map((category) => (
                <button key={category} className={activeCategory === category ? "filter-active" : ""} onClick={() => setActiveCategory(category)}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="student-grid">
            {filteredStudents.map((student, index) => (
              <article className="student-card" key={student.id} style={{ animationDelay: `${index * 80}ms` }}>
                <div className="student-card-top">
                  <span className="student-number">PROFILE / {String(index + 1).padStart(2, "0")}</span>
                  <span className="student-status"><span /> STUDENT</span>
                </div>
                <Avatar student={student} />
                <div className="student-card-copy">
                  <h3>{student.name}</h3>
                  <p className="student-degree">{student.degree}</p>
                  <p className="student-tagline">{student.tagline}</p>
                </div>
                <div className="student-skills">
                  {student.skills.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}
                  {student.skills.length > 3 && <span>+{student.skills.length - 3}</span>}
                </div>
                <div className="student-card-bottom">
                  <span>{student.year}</span>
                  <Link to={`/portfolio/${student.id}`} aria-label={`View ${student.name}'s portfolio`}><ArrowRight size={19} /></Link>
                </div>
              </article>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="empty-search">
              <Search size={28} />
              <h3>No portfolios found just yet.</h3>
              <p>Try another name, skill, or category.</p>
              <button onClick={() => { setSearch(""); setActiveCategory("All students"); }}>Clear filters</button>
            </div>
          )}
          <p className="demo-note">Showing example profiles. Replace the sample content with real student information when connecting the backend.</p>
        </section>

        <section className="portfolio-cta" id="about">
          <div className="cta-star"><Sparkles size={25} /></div>
          <div>
            <div className="eyebrow">YOUR STORY STARTS HERE</div>
            <h2>You've done the work.<br /><em>Let it be seen.</em></h2>
            <p>Make one place for your projects, progress, and everything you're proud of.</p>
          </div>
          <Link to="/portfolio/avani" className="gold-button">Explore my portfolio <ArrowRight size={17} /></Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function AchievementIcon({ type }) {
  if (type === "trophy") return <Trophy size={19} />;
  if (type === "award") return <Award size={19} />;
  return <Star size={19} />;
}

function StudentProfile() {
  const { id } = useParams();
  const student = students.find((item) => item.id === id);

  if (!student) {
    return (
      <div className="portfolio-page">
        <Header />
        <div className="profile-not-found">
          <Sparkles size={28} />
          <h1>This portfolio is still a blank page.</h1>
          <p>The profile may have moved, or the link might be incorrect.</p>
          <Link to="/portfolio" className="gold-button"><ArrowLeft size={16} /> Back to discover</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const [copied, setCopied] = useState(false);

  async function sharePortfolio() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy your portfolio link:", url);
    }
  }

  return (
    <div className="portfolio-page">
      <Header detail />

      <main className="profile-page">
        <Link to="/portfolio" className="back-link"><ArrowLeft size={16} /> All student portfolios</Link>

        <section className="profile-hero">
          <div className="profile-hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> STUDENT PORTFOLIO / 2026</div>
            <h1>Hey, I'm<br /><em>{student.name}.</em></h1>
            <p className="profile-tagline">{student.tagline}</p>
            <p className="profile-bio">{student.bio}</p>
            <div className="profile-meta">
              <span><GraduationCap size={16} /> {student.degree}</span>
              <span><BookOpen size={16} /> {student.year}</span>
            </div>
            <div className="profile-actions">
              <a className="gold-button" href={`mailto:${student.email}`}><Mail size={16} /> Get in touch</a>
              <button className="outline-button" onClick={sharePortfolio}>{copied ? <Check size={16} /> : <Share2 size={16} />}{copied ? " Link copied!" : " Share portfolio"}</button>
            </div>
            <div className="profile-socials">
              <a href={student.github} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ExternalLink size={12} /></a>
              <a href={student.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ExternalLink size={12} /></a>
            </div>
          </div>
          <div className="profile-hero-art">
            <div className="profile-circle circle-back" />
            <div className="profile-circle circle-front" />
            <Avatar student={student} large />
            <div className="profile-art-note"><Sparkles size={16} /> A WORK IN PROGRESS<br /><span>AND PROUD OF IT.</span></div>
            <span className="profile-art-star">✳</span>
            <span className="profile-art-caption">CURIOUS BY NATURE.</span>
          </div>
        </section>

        <section className="profile-stats">
          <div><span className="stat-number">{student.projects.length.toString().padStart(2, "0")}</span><span>PROJECTS</span></div>
          <div><span className="stat-number">{student.skills.length.toString().padStart(2, "0")}</span><span>SKILLS</span></div>
          <div><span className="stat-number">{student.achievements.length.toString().padStart(2, "0")}</span><span>MILESTONES</span></div>
          <div><span className="stat-number">{student.certificates.length.toString().padStart(2, "0")}</span><span>CERTIFICATES</span></div>
        </section>

        <section className="profile-section" id="projects">
          <div className="section-heading">
            <div><div className="eyebrow">SELECTED WORK</div><h2>Things I've <em>built.</em></h2></div>
            <span className="section-count">{String(student.projects.length).padStart(2, "0")} PROJECTS</span>
          </div>
          <div className="project-grid">
            {student.projects.map((project) => (
              <article className="project-card" key={project.number}>
                <div className="project-card-top"><span>{project.number} / SELECTED PROJECT</span><Code2 size={19} /></div>
                <div className="project-art">
                  <div className="project-art-ring" />
                  <span className="project-art-number">{project.number}</span>
                  <span className="project-art-spark">✳</span>
                </div>
                <div className="project-card-body">
                  <span className="project-type">{project.type}</span>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <a className="project-link" href={project.link} target="_blank" rel="noreferrer">Explore project <ArrowRight size={16} /></a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-section skills-education">
          <div className="skills-panel">
            <div className="eyebrow">THE TOOLKIT</div>
            <h2>Skills I'm <em>growing.</em></h2>
            <p className="panel-intro">Tools and technologies I'm exploring through coursework and hands-on projects.</p>
            <div className="skill-list">
              {student.skills.map((skill, index) => (
                <div className="skill-row" key={skill}><span className="skill-index">0{index + 1}</span><span>{skill}</span><ArrowRight size={15} /></div>
              ))}
            </div>
            <div className="interest-tags">{student.interests.map((interest) => <span key={interest}>{interest}</span>)}</div>
          </div>

          <div className="education-panel">
            <div className="eyebrow">THE JOURNEY</div>
            <h2>Still <em>becoming.</em></h2>
            <p className="panel-intro">Every chapter adds something new.</p>
            <div className="education-timeline">
              {student.education.map((item, index) => (
                <div className="timeline-item" key={item.title}>
                  <span className="timeline-dot">{index === 0 ? <GraduationCap size={15} /> : <Sparkles size={14} />}</span>
                  <div><span className="timeline-year">{item.year}</span><h3>{item.title}</h3><p>{item.detail}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="profile-section achievements-section">
          <div className="section-heading">
            <div><div className="eyebrow">LITTLE WINS, BIG MEANING</div><h2>Moments worth <em>keeping.</em></h2></div>
            <Trophy size={24} className="heading-icon" />
          </div>
          <div className="achievement-list">
            {student.achievements.map((achievement) => (
              <article className="achievement-row" key={achievement.title}>
                <div className="achievement-icon"><AchievementIcon type={achievement.icon} /></div>
                <div className="achievement-copy"><h3>{achievement.title}</h3><p>{achievement.detail}</p></div>
                <span className="achievement-year">{achievement.year}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-section certificates-section">
          <div className="section-heading">
            <div><div className="eyebrow">LEARNING, RECOGNISED</div><h2>Proof of <em>progress.</em></h2></div>
            <Medal size={24} className="heading-icon" />
          </div>
          <div className="certificate-grid">
            {student.certificates.map((certificate) => (
              <article className="certificate-card" key={certificate.title}>
                <div className="certificate-seal"><Award size={23} /></div>
                <div><h3>{certificate.title}</h3><p>{certificate.issuer}</p><span>{certificate.year}</span></div>
                <ChevronDown size={17} />
              </article>
            ))}
          </div>
          <p className="demo-note">This is sample content. Update project links, contact details, achievements, and certificates with verified information before sharing publicly.</p>
        </section>

        <section className="profile-bottom-cta">
          <Sparkles size={24} />
          <h2>Your next chapter<br /><em>is still unwritten.</em></h2>
          <p>Keep learning. Keep making. Keep showing up.</p>
          <Link to="/portfolio" className="gold-button">Discover other students <ArrowRight size={16} /></Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function Portfolio() {
  const { id } = useParams();
  return id ? <StudentProfile /> : <Directory />;
}
