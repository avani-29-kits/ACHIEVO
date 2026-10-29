import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, Award, Bell, BookOpen, Check, ChevronDown,
  CircleHelp, Code2, Command, ExternalLink, Flame, FolderKanban, Gauge, Github,
  GraduationCap, LayoutDashboard, LogOut, Menu, Plus, Rocket, Search, ShieldCheck,
  Sparkles, Target, Trophy, UserRound, X, Zap
} from "lucide-react";
import { api } from "./api.js";

const initialAchievements = [
  { _id: "demo-a1", title: "Hackathon finalist", category: "Competition", issuer: "Campus Buildathon", date: "2026-09-12", description: "Built a prototype with a student team." },
  { _id: "demo-a2", title: "JavaScript essentials", category: "Certification", issuer: "Learning track", date: "2026-08-21", description: "Completed a practical JavaScript learning path." },
  { _id: "demo-a3", title: "Problem solver streak", category: "Milestone", issuer: "DSA practice", date: "2026-07-30", description: "Maintained a consistent coding routine." }
];
const initialProjects = [
  { _id: "demo-p1", title: "Campus Connect", description: "A student-first hub for discovering events and opportunities.", technologies: ["React", "CSS", "Node.js"], link: "" },
  { _id: "demo-p2", title: "Air Quality Node", description: "An embedded monitoring concept for urban micro-zones.", technologies: ["ESP8266", "IoT", "Sensors"], link: "" }
];

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("achievo_token") || "");
  const [authMode, setAuthMode] = useState("register");
  const [authOpen, setAuthOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [notice, setNotice] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [useDemo, setUseDemo] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState("");
  const [achievementForm, setAchievementForm] = useState({ title: "", category: "Certification", issuer: "", date: "", description: "" });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", technologies: "React, JavaScript", link: "" });
  const [mobileNav, setMobileNav] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    api("/auth/me", { token }).then(({ user }) => {
      setUser(user);
      return Promise.all([
        api("/achievements", { token }).then(setAchievements),
        api("/projects", { token }).then(setProjects)
      ]);
    }).then(() => setUseDemo(false)).catch(() => {
      localStorage.removeItem("achievo_token");
      setToken("");
      setUser(null);
    });
  }, [token]);

  const displayAchievements = useDemo && !user ? initialAchievements : achievements;
  const displayProjects = useDemo && !user ? initialProjects : projects;
  const allItems = displayAchievements.length + displayProjects.length;
  const filteredAchievements = useMemo(() => displayAchievements.filter(item =>
    `${item.title} ${item.category} ${item.issuer}`.toLowerCase().includes(query.toLowerCase())
  ), [displayAchievements, query]);
  const filteredProjects = useMemo(() => displayProjects.filter(item =>
    `${item.title} ${item.description} ${(item.technologies || []).join(" ")}`.toLowerCase().includes(query.toLowerCase())
  ), [displayProjects, query]);

  function openAuth(mode = "register") {
    setAuthMode(mode); setAuthError(""); setAuthOpen(true); setMobileNav(false);
  }
  async function submitAuth(event) {
    event.preventDefault(); setAuthBusy(true); setAuthError("");
    try {
      const endpoint = authMode === "register" ? "/auth/register" : "/auth/login";
      const result = await api(endpoint, { method: "POST", body: JSON.stringify(authForm) });
      localStorage.setItem("achievo_token", result.token);
      setToken(result.token); setUser(result.user); setAuthOpen(false); setUseDemo(false);
      setNotice(`Welcome ${result.user.name.split(" ")[0]} — your next level starts now.`);
      setAuthForm({ name: "", email: "", password: "" });
    } catch (error) { setAuthError(error.message); }
    finally { setAuthBusy(false); }
  }
  function logout() {
    localStorage.removeItem("achievo_token"); setToken(""); setUser(null);
    setAchievements([]); setProjects([]); setUseDemo(true); setActiveTab("Overview");
    setNotice("Signed out successfully.");
  }
  async function saveAchievement(event) {
    event.preventDefault();
    if (!user) { setModal(""); openAuth("register"); return; }
    setBusy(true);
    try {
      const item = await api("/achievements", { token, method: "POST", body: JSON.stringify(achievementForm) });
      setAchievements(items => [item, ...items]);
      setAchievementForm({ title: "", category: "Certification", issuer: "", date: "", description: "" });
      setModal(""); setNotice("Achievement added to your portfolio.");
    } catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  }
  async function saveProject(event) {
    event.preventDefault();
    if (!user) { setModal(""); openAuth("register"); return; }
    setBusy(true);
    try {
      const item = await api("/projects", { token, method: "POST", body: JSON.stringify({
        ...projectForm, technologies: projectForm.technologies.split(",").map(s => s.trim()).filter(Boolean)
      }) });
      setProjects(items => [item, ...items]);
      setProjectForm({ title: "", description: "", technologies: "React, JavaScript", link: "" });
      setModal(""); setNotice("Project added to your showcase.");
    } catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  }
  async function deleteItem(type, id) {
    if (!user) { setNotice("Create an account to manage saved portfolio items."); return; }
    try {
      await api(`/${type}/${id}`, { token, method: "DELETE" });
      if (type === "achievements") setAchievements(items => items.filter(x => x._id !== id));
      else setProjects(items => items.filter(x => x._id !== id));
      setNotice("Item removed.");
    } catch (error) { setNotice(error.message); }
  }

  const navItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Achievements", icon: Trophy },
    { label: "Projects", icon: FolderKanban },
    { label: "Skills", icon: Zap },
    { label: "Certificates", icon: Award }
  ];

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <a className="brand" href="#" onClick={() => setActiveTab("Overview")}>
        <span className="brand-mark"><Command size={22}/></span>
        <span>achievo<span className="brand-period">.</span><small>STUDENT HQ</small></span>
      </a>
      <div className="workspace-label">WORKSPACE <span>⌄</span></div>
      <div className="workspace"><div className="workspace-avatar">A</div><div><strong>{user?.name || "Your workspace"}</strong><small>{user ? "Personal portfolio" : "Demo environment"}</small></div><ChevronDown size={15}/></div>
      <div className="nav-caption">MENU</div>
      <nav className="nav-list">
        {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeTab === label ? "active" : ""}`} onClick={() => { setActiveTab(label); setMobileNav(false); }}>
          <Icon size={18}/><span>{label}</span>{label === "Achievements" && <span className="nav-count">{displayAchievements.length}</span>}
        </button>)}
      </nav>
      <div className="sidebar-promo">
        <div className="promo-icon"><Rocket size={19}/></div>
        <span className="eyebrow">YOUR NEXT LEVEL</span>
        <strong>Small wins.<br/>Big future.</strong>
        <p>Every skill you build is XP earned.</p>
        <div className="promo-track"><span style={{width: `${Math.min(100, allItems * 10)}%`}}/></div>
        <small>{allItems} portfolio items collected</small>
      </div>
      <div className="sidebar-bottom">
        <button className="nav-item" onClick={() => setNotice("Tip: add specific results and links to make each achievement stronger.")}><CircleHelp size={18}/> Help & tips</button>
        {user ? <button className="nav-item" onClick={logout}><LogOut size={18}/> Sign out</button> : <button className="nav-item" onClick={() => openAuth("login")}><UserRound size={18}/> Sign in</button>}
        <div className="profile-mini"><div className="avatar">{user?.name?.[0]?.toUpperCase() || "G"}</div><div className="profile-mini-text"><strong>{user?.name || "Guest player"}</strong><small>{user ? "LEVEL 01 · STUDENT" : "DEMO MODE"}</small></div><span className="online-dot"/></div>
      </div>
    </aside>

    <main className="main-content">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu"><Menu size={20}/></button>
        <div className="breadcrumb">Workspace <span>/</span> <strong>{activeTab}</strong></div>
        <div className="topbar-actions">
          <label className="search-box"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your portfolio..." /><kbd>⌘ K</kbd></label>
          <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice("You're all caught up. Go earn a new achievement!") }><Bell size={18}/><i/></button>
          {!user && <button className="button button-primary top-cta" onClick={() => openAuth("register")}>Get started <ArrowRight size={15}/></button>}
        </div>
      </header>

      <div className="page-wrap">
        {notice && <div className="toast"><Check size={16}/><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss"><X size={15}/></button></div>}
        <section className="welcome-row">
          <div><div className="eyebrow"><span className="pulse-dot"/> YOUR PROGRESS, UNLOCKED</div>
            <h1>{user ? <>Welcome back, <span className="neon-text">{user.name.split(" ")[0]}.</span></> : <>Build your <span className="neon-text">legacy.</span></>}</h1>
            <p className="welcome-copy">Your skills aren't just a list. They're your story in progress.</p>
          </div>
          <div className="welcome-actions"><button className="button button-ghost" onClick={() => setNotice("Portfolio sharing is on the roadmap. Add project links to share work today.")}><ExternalLink size={15}/> Preview portfolio</button><button className="button button-primary" onClick={() => setModal(activeTab === "Projects" ? "project" : "achievement")}><Plus size={17}/> Add new</button></div>
        </section>

        <section className="hero-banner">
          <div className="hero-grid-pattern"/>
          <div className="hero-content">
            <div className="hero-kicker"><span className="hero-kicker-icon"><Sparkles size={13}/></span> THE STUDENT ACHIEVEMENT HUB <span className="hero-line"/></div>
            <h2>Don't just learn it.<br/><span>Show the world.</span></h2>
            <p>One place for your wins, projects, certificates and the skills that set you apart.</p>
            <button className="button button-neon" onClick={() => user ? setModal("achievement") : openAuth("register")}>Start building <ArrowRight size={16}/></button>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/>
            <div className="trophy-core"><Trophy size={62} strokeWidth={1.2}/><span className="trophy-glint">✦</span></div>
            <div className="floating-tag tag-xp"><Zap size={14}/> +250 XP</div>
            <div className="floating-tag tag-rank"><Award size={15}/> ACHIEVER</div>
            <div className="floating-tag tag-streak"><Flame size={15}/> ON A ROLL</div>
          </div>
          <div className="hero-index">ACHIEVO / 001</div>
        </section>

        <div className="section-heading"><div><span className="eyebrow">PLAYER OVERVIEW</span><h2>Your dashboard<span className="neon-text">.</span></h2></div><button className="period-chip" onClick={() => setNotice("Stats reflect the items currently in your portfolio.")}><Activity size={14}/> ALL-TIME STATS <ChevronDown size={13}/></button></div>

        <section className="stats-grid">
          <StatCard icon={Trophy} label="Achievements" value={displayAchievements.length} change="Milestones collected" tone="lime" />
          <StatCard icon={FolderKanban} label="Projects built" value={displayProjects.length} change="Ideas made real" tone="purple" />
          <StatCard icon={Award} label="Certificates" value={displayAchievements.filter(a => /cert/i.test(a.category)).length} change="Proof of learning" tone="orange" />
          <StatCard icon={Target} label="Portfolio score" value={`${Math.min(99, allItems * 12 + 35)}%`} change="Based on items added" tone="blue" />
        </section>

        <section className="content-grid">
          <div className="panel achievements-panel">
            <div className="panel-heading"><div><span className="eyebrow">RECENT WINS</span><h3>{activeTab === "Certificates" ? "Certificates" : "Achievements"} <span className="muted-count">({filteredAchievements.length})</span></h3></div><button className="text-link" onClick={() => setActiveTab("Achievements")}>View all <ArrowRight size={14}/></button></div>
            {activeTab === "Skills" ? <div className="skills-list">{[["Frontend development", 76, "React · HTML · CSS"], ["Problem solving", 62, "DSA · Logical thinking"], ["Backend fundamentals", 48, "Node.js · APIs"], ["Database design", 42, "MongoDB · Data modeling"]].map(([name, value, detail]) => <div className="skill-row" key={name}><div className="skill-meta"><strong>{name}</strong><span>{value}%</span></div><div className="skill-track"><span style={{width: `${value}%`}}/></div><small>{detail}</small></div>)}</div> : <div className="achievement-list">{filteredAchievements.filter(a => activeTab !== "Certificates" || /cert/i.test(a.category)).slice(0, 4).map((item, i) => <div className="achievement-row" key={item._id}><div className={`achievement-icon icon-tone-${i % 4}`}><Award size={19}/></div><div className="achievement-detail"><strong>{item.title}</strong><span>{item.issuer || item.category}</span></div><div className="achievement-date">{item.date || "Recently added"}</div>{user && <button className="delete-button" title="Delete achievement" onClick={() => deleteItem("achievements", item._id)}><X size={14}/></button>}</div>)}
              {filteredAchievements.length === 0 && <EmptyState title="Your next win goes here" text="Add a certificate, competition result or personal milestone." onClick={() => setModal("achievement")}/>}
            </div>}
            <button className="panel-add" onClick={() => setModal("achievement")}><Plus size={16}/> Add achievement <span>+</span></button>
          </div>

          <div className="panel projects-panel">
            <div className="panel-heading"><div><span className="eyebrow">MADE BY YOU</span><h3>Featured projects <span className="muted-count">({filteredProjects.length})</span></h3></div><button className="text-link" onClick={() => setActiveTab("Projects")}>Explore <ArrowRight size={14}/></button></div>
            <div className="project-list">{filteredProjects.slice(0, 3).map((project, i) => <div className="project-card" key={project._id}><div className={`project-art project-art-${i % 3}`}><div className="project-art-grid"/>{i === 0 ? <Code2 size={29}/> : i === 1 ? <Gauge size={29}/> : <Rocket size={29}/>}<span className="project-number">0{i + 1}</span></div><div className="project-info"><div className="project-title-row"><strong>{project.title}</strong>{project.link && <a href={project.link} target="_blank" rel="noreferrer" aria-label="Open project"><ExternalLink size={14}/></a>}</div><p>{project.description}</p><div className="tech-tags">{(project.technologies || []).slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div></div>{user && <button className="delete-button project-delete" title="Delete project" onClick={() => deleteItem("projects", project._id)}><X size={14}/></button>}</div>)}
              {filteredProjects.length === 0 && <EmptyState title="An empty canvas" text="Add your first project and show what you can build." onClick={() => setModal("project")}/>}
            </div>
            <button className="panel-add" onClick={() => setModal("project")}><Plus size={16}/> Add a project <span>+</span></button>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="level-panel"><div className="level-badge"><GraduationCap size={25}/></div><div className="level-copy"><span className="eyebrow">YOUR JOURNEY</span><h3>Every step counts.</h3><p>Build a portfolio that grows with you.</p></div><div className="level-progress"><div><span>PORTFOLIO XP</span><strong>{allItems * 250} <small>/ 2500</small></strong></div><div className="xp-track"><span style={{width: `${Math.min(100, allItems * 10)}%`}}/></div><small>{Math.max(0, 10 - allItems)} items to next milestone</small></div></div>
          <div className="tip-panel"><div className="tip-icon"><Zap size={20}/></div><div><span className="eyebrow">PRO TIP / 01</span><h3>Show the outcome.</h3><p>Don't just list a project. Add what problem it solved, what you learned, and a live demo or repo link.</p></div><ArrowDownRight className="tip-arrow" size={22}/></div>
        </section>

        <footer className="footer"><a className="footer-brand" href="#"><Command size={16}/> ACHIEVO<span>.</span></a><span>BUILT FOR THE NEXT GENERATION OF DOERS.</span><span>© 2026 ACHIEVO</span></footer>
      </div>
    </main>

    {authOpen && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setAuthOpen(false); }}><div className="modal-card"><button className="modal-close" onClick={() => setAuthOpen(false)}><X size={18}/></button><div className="modal-brand"><span className="brand-mark"><Command size={21}/></span><span>achievo<span className="brand-period">.</span></span></div><span className="eyebrow">{authMode === "register" ? "CREATE YOUR PLAYER PROFILE" : "WELCOME BACK, PLAYER"}</span><h2>{authMode === "register" ? "Your story starts here." : "Ready for another level?"}</h2><p className="modal-subtitle">Save your wins. Build your proof. Own your progress.</p><form onSubmit={submitAuth} className="form-stack">
      {authMode === "register" && <label>Full name<input required minLength="2" value={authForm.name} onChange={e => setAuthForm({...authForm, name:e.target.value})} placeholder="Your name"/></label>}
      <label>Email address<input required type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email:e.target.value})} placeholder="you@college.edu"/></label>
      <label>Password<input required minLength="8" type="password" value={authForm.password} onChange={e => setAuthForm({...authForm, password:e.target.value})} placeholder="At least 8 characters"/></label>
      {authError && <div className="form-error">{authError}</div>}<button disabled={authBusy} className="button button-primary button-full">{authBusy ? "Please wait..." : authMode === "register" ? "Create account" : "Sign in"} <ArrowRight size={16}/></button>
    </form><p className="switch-auth">{authMode === "register" ? "Already have an account?" : "New to ACHIEVO?"} <button onClick={() => { setAuthMode(authMode === "register" ? "login" : "register"); setAuthError(""); }}>{authMode === "register" ? "Sign in" : "Create account"}</button></p><div className="secure-note"><ShieldCheck size={14}/> Your password is hashed before it is stored.</div></div></div>}

    {modal && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setModal(""); }}><div className="modal-card content-modal"><button className="modal-close" onClick={() => setModal("")}><X size={18}/></button><span className="eyebrow">{modal === "project" ? "SHOW WHAT YOU CAN BUILD" : "LOG A NEW WIN"}</span><h2>{modal === "project" ? "Add a project." : "Achievement unlocked."}</h2><p className="modal-subtitle">Make it specific. Your future self will thank you.</p>
      {modal === "project" ? <form className="form-stack" onSubmit={saveProject}><label>Project name<input required maxLength="120" value={projectForm.title} onChange={e => setProjectForm({...projectForm,title:e.target.value})} placeholder="e.g. Campus Connect"/></label><label>What does it do?<textarea rows="3" value={projectForm.description} onChange={e => setProjectForm({...projectForm,description:e.target.value})} placeholder="Problem, approach and impact..."/></label><label>Technologies <small>comma separated</small><input value={projectForm.technologies} onChange={e => setProjectForm({...projectForm,technologies:e.target.value})} placeholder="React, Node.js, MongoDB"/></label><label>Repository or live demo URL<input type="url" value={projectForm.link} onChange={e => setProjectForm({...projectForm,link:e.target.value})} placeholder="https://..."/></label><button disabled={busy} className="button button-primary button-full">{busy ? "Saving..." : "Save project"} <ArrowRight size={16}/></button></form>
      : <form className="form-stack" onSubmit={saveAchievement}><label>Achievement title<input required maxLength="120" value={achievementForm.title} onChange={e => setAchievementForm({...achievementForm,title:e.target.value})} placeholder="e.g. First hackathon finalist"/></label><div className="form-row"><label>Category<select value={achievementForm.category} onChange={e => setAchievementForm({...achievementForm,category:e.target.value})}><option>Certification</option><option>Competition</option><option>Academic</option><option>Internship</option><option>Milestone</option><option>Volunteering</option></select></label><label>Date<input type="date" value={achievementForm.date} onChange={e => setAchievementForm({...achievementForm,date:e.target.value})}/></label></div><label>Issued by<input value={achievementForm.issuer} onChange={e => setAchievementForm({...achievementForm,issuer:e.target.value})} placeholder="College, platform or organization"/></label><label>Details<textarea rows="3" value={achievementForm.description} onChange={e => setAchievementForm({...achievementForm,description:e.target.value})} placeholder="What did you achieve or learn?"/></label><button disabled={busy} className="button button-primary button-full">{busy ? "Saving..." : "Save achievement"} <ArrowRight size={16}/></button></form>}
    </div></div>}
  </div>;
}

function StatCard({ icon: Icon, label, value, change, tone }) {
  return <div className="stat-card"><div className={`stat-icon stat-${tone}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-change"><span><Check size={12}/></span>{change}</div><div className="stat-spark" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/></div></div>;
}
function EmptyState({ title, text, onClick }) {
  return <div className="empty-state"><div><Sparkles size={22}/></div><strong>{title}</strong><p>{text}</p><button className="button button-ghost" onClick={onClick}><Plus size={15}/> Add now</button></div>;
}
export default App;
