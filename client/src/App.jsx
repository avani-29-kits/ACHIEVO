
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, ArrowUpRight, Award, BookOpen, CalendarDays,
  Check, ChevronDown, LogIn, Medal, Menu, Palette, Plus,
  Share2, ShieldCheck, Sprout, Trophy, Users, X
} from "lucide-react";
import { api } from "./api.js";

const categories = [
  { name: "Academic", icon: BookOpen },
  { name: "Competition", icon: Trophy },
  { name: "Certificate", icon: Award },
  { name: "Arts", icon: Palette },
  { name: "Sports", icon: Medal },
  { name: "Leadership", icon: Users }
];

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("achievo_token") || ""
  );
  const [achievements, setAchievements] = useState([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("register");
  const [authForm, setAuthForm] = useState({
    name: "", email: "", password: ""
  });
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [modal, setModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All");
  const [achievementForm, setAchievementForm] = useState({
    title: "",
    category: "Academic",
    date: new Date().toISOString().slice(0, 10),
    issuer: "",
    description: ""
  });

  useEffect(() => {
    if (!token) return;

    api("/auth/me", { token })
      .then(({ user: currentUser }) => {
        setUser(currentUser);
        setPage("dashboard");
        return api("/achievements", { token }).then(setAchievements);
      })
      .catch(() => {
        localStorage.removeItem("achievo_token");
        setToken("");
        setUser(null);
      });
  }, [token]);

  const visibleAchievements = useMemo(
    () =>
      filter === "All"
        ? achievements
        : achievements.filter(
            item =>
              item.category?.toLowerCase() === filter.toLowerCase()
          ),
    [achievements, filter]
  );

  function openAuth(mode = "register") {
    setAuthMode(mode);
    setAuthError("");
    setAuthOpen(true);
  }

  async function submitAuth(event) {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError("");

    try {
      const result = await api(
        authMode === "register" ? "/auth/register" : "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(authForm)
        }
      );

      localStorage.setItem("achievo_token", result.token);
      setToken(result.token);
      setUser(result.user);
      setAuthOpen(false);
      setPage("dashboard");
      setNotice("Welcome! Your achievement record starts here.");
      setAuthForm({ name: "", email: "", password: "" });
    } catch (error) {
      setAuthError(
        error.message === "Failed to fetch"
          ? "Cannot reach the server. Start the backend and check MongoDB."
          : error.message
      );
    } finally {
      setAuthBusy(false);
    }
  }

  function signOut() {
    localStorage.removeItem("achievo_token");
    setToken("");
    setUser(null);
    setAchievements([]);
    setPage("home");
    setNotice("You have signed out.");
  }

  async function saveAchievement(event) {
    event.preventDefault();

    if (!user) {
      setModal(false);
      openAuth("register");
      return;
    }

    setBusy(true);

    try {
      const saved = await api("/achievements", {
        token,
        method: "POST",
        body: JSON.stringify(achievementForm)
      });

      setAchievements(items => [saved, ...items]);
      setModal(false);
      setAchievementForm({
        title: "",
        category: "Academic",
        date: new Date().toISOString().slice(0, 10),
        issuer: "",
        description: ""
      });
      setNotice("Achievement added to your record.");
    } catch (error) {
      setNotice(
        error.message === "Failed to fetch"
          ? "Cannot reach the server. Check the backend."
          : error.message
      );
    } finally {
      setBusy(false);
    }
  }

  async function removeAchievement(id) {
    try {
      await api(`/achievements/${id}`, {
        token,
        method: "DELETE"
      });

      setAchievements(items => items.filter(item => item._id !== id));
      setNotice("Achievement removed.");
    } catch (error) {
      setNotice(error.message);
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <button
          className="wordmark"
          onClick={() => setPage("home")}
          aria-label="Achievo home"
        >
          <span className="logo-mark"><Sprout size={21} /></span>
          <span>Achievo</span>
        </button>

        <nav className="header-nav">
          {user ? (
            <>
              <button
                className="nav-text"
                onClick={() => setPage("dashboard")}
              >
                My achievements
              </button>
              <button className="button button-soft" onClick={signOut}>
                <LogIn size={16} /> Sign out
              </button>
            </>
          ) : (
            <>
              <button
                className="nav-text"
                onClick={() =>
                  document.getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                How it works
              </button>
              <button className="nav-text" onClick={() => openAuth("login")}>
                Sign in
              </button>
              <button
                className="button button-soft"
                onClick={() => openAuth("register")}
              >
                Get started <ArrowRight size={15} />
              </button>
            </>
          )}
        </nav>

        <button
          className="mobile-menu"
          onClick={() => setPage(page === "home" ? "dashboard" : "home")}
          aria-label="Toggle page"
        >
          <Menu size={21} />
        </button>
      </header>

      {page === "home" ? (
        <>
          <main>
            <section className="hero-section">
              <div className="hero-copy">
                <p className="eyebrow">STUDENT ACHIEVEMENT PORTFOLIO</p>
                <h1>
                  Every win,<br />
                  <em>beautifully</em> on<br />
                  the record.
                </h1>
                <p className="hero-description">
                  Achievo keeps your awards, certificates, and milestones in
                  one place, so your hard work is never forgotten in a drawer.
                </p>
                <button
                  className="button button-primary hero-button"
                  onClick={() =>
                    user ? setPage("dashboard") : openAuth("register")
                  }
                >
                  Open my achievements <ArrowRight size={17} />
                </button>
                <div className="hero-proof">
                  <span className="proof-icon"><ShieldCheck size={16} /></span>
                  <span>A thoughtful home for everything you've earned.</span>
                </div>
              </div>

              <div className="hero-visual-wrap">
                <div className="hero-image-frame">
                  <img
                    className="hero-image"
                    src="https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85"
                    alt="Achievement and award display"
                  />
                  <div className="image-note">
                    <span className="note-medal"><Trophy size={19} /></span>
                    <span>
                      <strong>Your hard work, remembered.</strong>
                      <small>Every milestone has a place.</small>
                    </span>
                  </div>
                </div>
                <div className="hero-orbit orbit-one" />
                <div className="hero-orbit orbit-two" />
              </div>
            </section>

            <section className="category-strip" aria-label="Achievement categories">
              {categories.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => {
                    setFilter(name);
                    if (user) setPage("dashboard");
                    else openAuth("register");
                  }}
                >
                  <Icon size={20} />
                  <span>{name}</span>
                </button>
              ))}
            </section>

            <section className="story-section" id="how-it-works">
              <div className="story-heading">
                <p className="eyebrow">A LITTLE SPACE FOR YOUR BIG MOMENTS</p>
                <h2>Your record, kept<br />the way it deserves.</h2>
              </div>

              <div className="story-steps">
                <article>
                  <span>01</span>
                  <h3>Log it the day it happens</h3>
                  <p>
                    Add a certificate, competition, internship, or the small
                    milestone you're proud of.
                  </p>
                </article>
                <article>
                  <span>02</span>
                  <h3>See your story take shape</h3>
                  <p>
                    Keep the details together and look back at how far you've
                    come.
                  </p>
                </article>
                <article>
                  <span>03</span>
                  <h3>Be ready to share</h3>
                  <p>
                    Build a clearer picture of your progress for applications,
                    mentors, and interviews.
                  </p>
                </article>
              </div>
            </section>

            <section className="closing-banner">
              <div>
                <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
                <h2>Good work deserves<br />a place to live.</h2>
              </div>
              <button
                className="button button-light"
                onClick={() =>
                  user ? setPage("dashboard") : openAuth("register")
                }
              >
                Start your record <ArrowRight size={16} />
              </button>
            </section>
          </main>

          <footer className="site-footer">
            <button
              className="wordmark footer-wordmark"
              onClick={() => setPage("home")}
            >
              <span className="logo-mark"><Sprout size={18} /></span>
              <span>Achievo</span>
            </button>
            <span>© 2026 Achievo. Every achievement counts.</span>
          </footer>
        </>
      ) : (
        <main className="dashboard-main">
          <div className="dashboard-top">
            <div>
              <p className="eyebrow">ACHIEVEMENT LOG</p>
              <h1>
                {user ? `${user.name.split(" ")[0]}'s record` : "Your record"}
              </h1>
              <p className="dashboard-intro">
                All the moments that make your journey yours.
              </p>
            </div>
            <button
              className="button button-primary"
              onClick={() => user ? setModal(true) : openAuth("register")}
            >
              <Plus size={17} /> Add achievement
            </button>
          </div>

          <section className="share-banner">
            <div className="share-icon"><Share2 size={19} /></div>
            <div>
              <h2>Share your portfolio</h2>
              <p>
                Keep your achievements together and get ready to share your story.
              </p>
            </div>
            <button
              className="button button-light"
              onClick={() =>
                user
                  ? setNotice("Portfolio sharing will be available once the public profile is set up.")
                  : openAuth("register")
              }
            >
              Create my portfolio <ArrowUpRight size={15} />
            </button>
          </section>

          <div className="filter-row">
            <div className="filter-buttons">
              <button
                className={filter === "All" ? "filter-active" : ""}
                onClick={() => setFilter("All")}
              >
                All achievements <span>{achievements.length}</span>
              </button>
              {categories.map(({ name }) => (
                <button
                  key={name}
                  className={filter === name ? "filter-active" : ""}
                  onClick={() => setFilter(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            <button className="sort-button">
              <CalendarDays size={15} /> Most recent <ChevronDown size={14} />
            </button>
          </div>

          {visibleAchievements.length ? (
            <div className="achievement-grid">
              {visibleAchievements.map(item => (
                <article className="achievement-card" key={item._id}>
                  <div className="achievement-card-top">
                    <span className="achievement-card-icon">
                      <Award size={20} />
                    </span>
                    <span className="category-pill">
                      {item.category || "Milestone"}
                    </span>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.description || "A milestone worth remembering."}</p>
                  <div className="achievement-meta">
                    <span>{item.issuer || "Personal achievement"}</span>
                    <span>{item.date || "Date not set"}</span>
                  </div>
                  {user && (
                    <button
                      className="remove-achievement"
                      onClick={() => removeAchievement(item._id)}
                      aria-label={`Remove ${item.title}`}
                    >
                      <X size={15} />
                    </button>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <section className="empty-achievements">
              <div className="empty-icon"><Trophy size={25} /></div>
              <h2>Your first achievement awaits</h2>
              <p>Add an award, certificate, or milestone you're proud of.</p>
              <button
                className="button button-primary"
                onClick={() => user ? setModal(true) : openAuth("register")}
              >
                <Plus size={16} /> Add your first achievement
              </button>
            </section>
          )}

          <footer className="dashboard-footer">
            <button
              className="wordmark footer-wordmark"
              onClick={() => setPage("home")}
            >
              <span className="logo-mark"><Sprout size={18} /></span>
              <span>Achievo</span>
            </button>
            <span>© 2026 Achievo. Every achievement counts.</span>
          </footer>
        </main>
      )}

      {notice && (
        <div className="notice-toast" role="status">
          <Check size={16} />
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss notification">
            <X size={15} />
          </button>
        </div>
      )}

      {authOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setAuthOpen(false);
          }}
        >
          <section className="modal-card" role="dialog" aria-modal="true">
            <button
              className="modal-close"
              onClick={() => setAuthOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="modal-logo">
              <span className="logo-mark"><Sprout size={20} /></span>
              <span>Achievo</span>
            </div>
            <p className="eyebrow">
              {authMode === "register"
                ? "A PLACE FOR YOUR PROGRESS"
                : "GOOD TO HAVE YOU BACK"}
            </p>
            <h2>
              {authMode === "register" ? "Start your record." : "Welcome back."}
            </h2>
            <p className="modal-description">
              Your achievements deserve more than a forgotten folder.
            </p>

            <form className="form-stack" onSubmit={submitAuth}>
              {authMode === "register" && (
                <label>
                  Full name
                  <input
                    required
                    minLength="2"
                    value={authForm.name}
                    onChange={event =>
                      setAuthForm({ ...authForm, name: event.target.value })
                    }
                    placeholder="Your full name"
                  />
                </label>
              )}
              <label>
                Email address
                <input
                  required
                  type="email"
                  value={authForm.email}
                  onChange={event =>
                    setAuthForm({ ...authForm, email: event.target.value })
                  }
                  placeholder="you@college.edu"
                />
              </label>
              <label>
                Password
                <input
                  required
                  minLength="8"
                  type="password"
                  value={authForm.password}
                  onChange={event =>
                    setAuthForm({ ...authForm, password: event.target.value })
                  }
                  placeholder="At least 8 characters"
                />
              </label>
              {authError && <p className="form-error">{authError}</p>}
              <button
                className="button button-primary button-full"
                disabled={authBusy}
              >
                {authBusy
                  ? "Please wait…"
                  : authMode === "register"
                    ? "Create my account"
                    : "Sign in"}
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="auth-switch">
              {authMode === "register"
                ? "Already have an account?"
                : "New to Achievo?"}
              <button
                onClick={() => {
                  setAuthMode(authMode === "register" ? "login" : "register");
                  setAuthError("");
                }}
              >
                {authMode === "register" ? "Sign in" : "Create account"}
              </button>
            </p>
            <div className="privacy-note">
              <ShieldCheck size={14} /> Your account is private to you.
            </div>
          </section>
        </div>
      )}

      {modal && (
        <div
          className="modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setModal(false);
          }}
        >
          <section className="modal-card" role="dialog" aria-modal="true">
            <button
              className="modal-close"
              onClick={() => setModal(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <p className="eyebrow">KEEP THE MOMENT</p>
            <h2>New achievement</h2>
            <p className="modal-description">
              Record the details while they're fresh.
            </p>

            <form className="form-stack" onSubmit={saveAchievement}>
              <label>
                Title
                <input
                  required
                  maxLength="120"
                  value={achievementForm.title}
                  onChange={event =>
                    setAchievementForm({
                      ...achievementForm,
                      title: event.target.value
                    })
                  }
                  placeholder="1st place, Regional Science Fair"
                />
              </label>

              <div className="form-row">
                <label>
                  Category
                  <select
                    value={achievementForm.category}
                    onChange={event =>
                      setAchievementForm({
                        ...achievementForm,
                        category: event.target.value
                      })
                    }
                  >
                    {[
                      "Academic", "Competition", "Certificate", "Arts",
                      "Sports", "Leadership", "Internship", "Milestone",
                      "Volunteering"
                    ].map(item => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    value={achievementForm.date}
                    onChange={event =>
                      setAchievementForm({
                        ...achievementForm,
                        date: event.target.value
                      })
                    }
                  />
                </label>
              </div>

              <label>
                Awarded by <span className="optional-label">(optional)</span>
                <input
                  value={achievementForm.issuer}
                  onChange={event =>
                    setAchievementForm({
                      ...achievementForm,
                      issuer: event.target.value
                    })
                  }
                  placeholder="College, platform or organization"
                />
              </label>

              <label>
                Notes <span className="optional-label">(optional)</span>
                <textarea
                  rows="3"
                  value={achievementForm.description}
                  onChange={event =>
                    setAchievementForm({
                      ...achievementForm,
                      description: event.target.value
                    })
                  }
                  placeholder="What you did, what you learned, why it mattered"
                />
              </label>

              <button
                className="button button-primary button-full"
                disabled={busy}
              >
                {busy ? "Saving…" : "Add achievement"}
                <ArrowRight size={16} />
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
