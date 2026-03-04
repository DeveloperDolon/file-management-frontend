/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import "../qa.css";
import { Link } from "react-router-dom";

const qaData = [
  {
    category: "React.js / Frontend",
    color: "#00D9FF",
    questions: [
      {
        q: "Can you explain the difference between controlled and uncontrolled components in React?",
        a: "Controlled components have their state managed by React — the input value is always driven by state and updated via onChange handlers. Uncontrolled components store their own state internally in the DOM, and you use a ref to access the value when needed. Controlled components are preferred for most use cases since they give you full control over form data and make it easier to validate and manipulate values.",
      },
      {
        q: "What are React Hooks and why were they introduced? Name at least 3 commonly used hooks.",
        a: "Hooks were introduced in React 16.8 to let functional components use state and lifecycle features without writing class components. Commonly used hooks include: (1) useState — for local state management, (2) useEffect — to handle side effects like API calls or subscriptions, (3) useContext — to consume context without prop drilling, (4) useRef — to access DOM elements or persist values without re-renders, and (5) useMemo / useCallback — to optimize performance by memoizing values and functions.",
      },
      {
        q: "How do you optimize the performance of a React application?",
        a: "Performance can be optimized through: (1) React.memo to prevent unnecessary re-renders of components, (2) useMemo and useCallback to memoize expensive computations and functions, (3) Code splitting with React.lazy and Suspense for lazy loading, (4) Virtualization for large lists using libraries like react-window, (5) Avoiding anonymous functions in JSX, (6) Using the production build of React, and (7) Properly keying list items to help React efficiently reconcile the DOM.",
      },
      {
        q: "What is the Virtual DOM and how does React use it?",
        a: "The Virtual DOM is a lightweight in-memory representation of the real DOM. When state or props change, React creates a new Virtual DOM tree and diffs it against the previous one using a process called reconciliation. Only the parts of the real DOM that actually changed are updated, making rendering much more efficient than manipulating the DOM directly on every change.",
      },
      {
        q: "How would you manage global state in a React application?",
        a: "For lightweight global state, React Context API combined with useReducer can work well. For complex applications, dedicated state management libraries like Redux Toolkit, Zustand, or Jotai are better choices. The decision depends on app complexity — Context is great for theme/auth state, while Redux is better suited for frequent updates across many components or when you need time-travel debugging and middleware support.",
      },
      {
        q: "What is the difference between props and state in React?",
        a: "Props are read-only data passed from a parent to a child component — they are immutable from the child's perspective and used to configure the component. State is internal, mutable data managed by the component itself using useState or this.setState. When state changes, the component re-renders. When props change, the component also re-renders. Props flow downward (parent to child), while state is local to the component.",
      },
    ],
  },
  {
    category: "HTML / CSS / JS",
    color: "#FF6B35",
    questions: [
      {
        q: "What is the difference between == and === in JavaScript?",
        a: "== is the loose equality operator and performs type coercion before comparing, so '5' == 5 is true. === is the strict equality operator that checks both value and type without coercion, so '5' === 5 is false. It's best practice to always use === to avoid unexpected behavior caused by implicit type conversions.",
      },
      {
        q: "Explain CSS specificity and how conflicts between styles are resolved.",
        a: "CSS specificity determines which rule applies when multiple rules target the same element. It's calculated as a score: inline styles (1000) > ID selectors (100) > class/pseudo-class/attribute selectors (10) > element/pseudo-element selectors (1). When specificity is equal, the last declared rule wins (cascade). !important overrides all specificity, but should be used sparingly as it makes debugging harder.",
      },
      {
        q: "What is event delegation in JavaScript and why is it useful?",
        a: "Event delegation is attaching a single event listener to a parent element instead of individual children, leveraging event bubbling. When a child element is clicked, the event bubbles up to the parent listener. It's useful because it reduces memory usage (fewer listeners), works for dynamically added child elements, and simplifies code. For example, attaching one click listener to a <ul> to handle clicks on all its <li> items.",
      },
      {
        q: "What is the difference between 'let', 'const', and 'var' in JavaScript?",
        a: "'var' is function-scoped and is hoisted to the top of its scope (initialized as undefined). 'let' is block-scoped and not accessible before its declaration (temporal dead zone). 'const' is also block-scoped and must be initialized at declaration — its binding cannot be reassigned, though object properties can still be mutated. Best practice is to use const by default, let when reassignment is needed, and avoid var.",
      },
      {
        q: "How do you ensure a website is responsive and cross-browser compatible?",
        a: "For responsiveness: use a mobile-first approach, CSS Flexbox and Grid for layouts, relative units (%, rem, vw/vh), and media queries. For cross-browser compatibility: test on multiple browsers (Chrome, Firefox, Safari, Edge), use CSS resets or normalize.css, check caniuse.com for feature support, add vendor prefixes where needed (or use Autoprefixer), and avoid browser-specific APIs without polyfills.",
      },
    ],
  },
  {
    category: "Laravel / Backend",
    color: "#A855F7",
    questions: [
      {
        q: "What is the MVC pattern and how does Laravel implement it?",
        a: "MVC stands for Model-View-Controller, a design pattern that separates application logic. In Laravel: Models represent data and business logic (Eloquent ORM), Views handle presentation (Blade templates), and Controllers handle HTTP requests, interact with models, and return responses. Laravel routes map URLs to controller methods, and middleware can intercept requests for authentication, logging, and other concerns.",
      },
      {
        q: "Can you explain what Eloquent ORM is and give an example of a relationship?",
        a: "Eloquent is Laravel's built-in ORM (Object-Relational Mapper) that maps database tables to PHP classes (models). It makes database queries readable and expressive. For example, a User hasMany Posts relationship is defined in the User model as: public function posts() { return $this->hasMany(Post::class); }. Then you can access it as $user->posts. Other relationships include belongsTo, hasOne, belongsToMany (many-to-many), and hasManyThrough.",
      },
      {
        q: "How do you design and implement a RESTful API in Laravel?",
        a: "Define resourceful routes using Route::apiResource('users', UserController::class), which maps standard HTTP verbs to controller methods (index, store, show, update, destroy). Use Form Requests for validation, return JSON responses using response()->json() or API Resources for consistent structure. Implement authentication with Laravel Sanctum or Passport for token-based auth. Use proper HTTP status codes (200, 201, 404, 422, etc.) and version the API (e.g., /api/v1/).",
      },
      {
        q: "What is the difference between authentication and authorization in Laravel?",
        a: "Authentication verifies who the user is (login/identity). Laravel handles this via Auth::attempt(), Sanctum tokens, or Passport. Authorization determines what the authenticated user is allowed to do. Laravel uses Gates (closure-based, for simple checks) and Policies (class-based, for model-related permissions). For example, you might authorize whether a user can update a specific post with $this->authorize('update', $post) in a controller.",
      },
      {
        q: "How do you handle database migrations and why are they important?",
        a: "Migrations are version control for the database schema, defined as PHP classes using Laravel's Schema builder. You run php artisan make:migration to create one and php artisan migrate to apply it. They're important because: (1) the database structure is tracked in source control alongside code, (2) teams can sync schema changes easily, (3) you can roll back changes with php artisan migrate:rollback, and (4) they work across different database engines (MySQL, PostgreSQL, SQLite) without changing the syntax.",
      },
    ],
  },
  {
    category: "Git & Dev Workflow",
    color: "#22C55E",
    questions: [
      {
        q: "What is the difference between git merge and git rebase?",
        a: "git merge combines two branches by creating a new merge commit, preserving the full history of both branches. git rebase moves or replays your commits on top of another branch, creating a linear history. Rebase produces a cleaner history but rewrites commits, so it should never be used on shared/public branches. Merge is safer for collaboration; rebase is preferred for cleaning up local feature branches before merging.",
      },
      {
        q: "How do you handle a situation where you accidentally committed sensitive data (e.g., API keys) to a public repo?",
        a: "First, immediately revoke the exposed credentials and generate new ones. Then remove the sensitive data using git filter-branch or the BFG Repo-Cleaner to rewrite history. Force-push the cleaned history (git push --force). Inform the team since this rewrites shared history. Going forward, use .gitignore for .env files, environment variables for secrets, and tools like git-secrets or pre-commit hooks to prevent future leaks.",
      },
      {
        q: "Describe your workflow in an Agile development environment.",
        a: "In an Agile workflow, I work in sprints (typically 1–2 weeks), participate in daily standups to share progress and blockers, sprint planning to estimate and prioritize tasks, and retrospectives to improve processes. I use a ticketing system (Jira/Trello) to track tasks. For code: I create a feature branch, write code with regular commits, open a pull request for peer review, address feedback, then merge after approval. Continuous communication with designers and product managers ensures alignment throughout.",
      },
    ],
  },
  {
    category: "Behavioral / General",
    color: "#F59E0B",
    questions: [
      {
        q: "Tell me about yourself and your experience as a full stack developer.",
        a: "Structure your answer using the present-past-future method: Start with your current role and key skills (React, Laravel, etc.), briefly mention relevant past experience or projects that demonstrate your full stack ability, then connect to why you're excited about this role at KrazyIT. Highlight specific technologies mentioned in the job post (React, PHP/Laravel, MySQL, Git) and quantify impact where possible (e.g., 'Built a dashboard that reduced report generation time by 40%').",
      },
      {
        q: "Describe a challenging bug you encountered and how you resolved it.",
        a: "Use the STAR method: Situation (briefly describe the project/context), Task (what was the bug's impact), Action (your debugging process — reproducing the issue, checking logs, isolating the cause, writing a fix, testing), Result (what was resolved and what you learned). Mention specific tools: browser DevTools, Laravel Telescope, Xdebug, console.log, or unit tests. Demonstrating a systematic approach is more important than the complexity of the bug.",
      },
      {
        q: "How do you stay up to date with new frontend and backend technologies?",
        a: "I follow key resources like the official React and Laravel documentation changelogs, newsletters (JavaScript Weekly, Laravel News), YouTube channels, and communities on X/Twitter and Discord. I occasionally build small side projects to experiment with new features. I also read GitHub release notes for libraries I use in production to plan upgrades. For this role, I'd pay close attention to React ecosystem updates and any new Laravel major releases and their impact on API design.",
      },
      {
        q: "Why do you want to join this company and this role?",
        a: "Tailor your answer to KrazyIT specifically: mention the tech stack alignment (React + Laravel matches your expertise), the collaborative culture they describe, and the office location at Motijheel being accessible for you. You can also mention that the role's primary focus on frontend (React) with backend responsibility (Laravel) is exactly the kind of full stack ownership you enjoy. Show you've read the job post carefully by referencing specific responsibilities like building reusable components or implementing RESTful APIs.",
      },
    ],
  },
];

export default function KrazyITQA() {
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");

  const allCategories = ["All", ...qaData.map((c) => c.category)];

  const toggle = (catIdx: any, qIdx: any) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredData =
    activeCategory === "All"
      ? qaData
      : qaData.filter((c) => c.category === activeCategory);

  const totalQ = qaData.reduce((acc, c) => acc + c.questions.length, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
        color: "#E8E8F0",
        padding: "0",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(180deg, #0D0D1A 0%, #0A0A0F 100%)",
          borderBottom: "1px solid #1A1A2E",
          padding: "48px 24px 40px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="flex gap-5">
            <Link to="/krazyit-question">
              <div
                className="badge"
                style={{
                  background: "#00D9FF15",
                  color: "#00D9FF",
                  border: "1px solid #00D9FF30",
                  marginBottom: 20,
                }}
              >
                <span>◉</span> KrazyIT · Full Stack Developer
              </div>
            </Link>

            <Link to="/zoomit-question">
              <div
                className="badge"
                style={{
                  color: "#4ADE80",
                  marginBottom: 20,
                  background: "#4ADE8012",
                  border: "1px solid #4ADE8028",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    background: "#4ADE80",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
                ZOOM IT · Backend-Focused Full Stack Engineer (PERN)
              </div>
            </Link>
          </div>

          <h1 className="hero-title" style={{ marginBottom: 16 }}>
            Interview
            <br />
            <span style={{ color: "#00D9FF" }}>Q&A</span> Prep
          </h1>
          <p
            style={{
              color: "#5A5A7A",
              fontSize: 13,
              lineHeight: 1.7,
              maxWidth: 480,
              margin: "0 auto 32px",
            }}
          >
            Curated questions & answers tailored to this job post. React.js ·
            Laravel · Git · Behavioral.
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div className="stat-box">
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#00D9FF",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                {totalQ}
              </div>
              <div style={{ fontSize: 11, color: "#5A5A7A", marginTop: 2 }}>
                Questions
              </div>
            </div>
            <div className="stat-box">
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#FF6B35",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                {qaData.length}
              </div>
              <div style={{ fontSize: 11, color: "#5A5A7A", marginTop: 2 }}>
                Categories
              </div>
            </div>
            <div className="stat-box">
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#A855F7",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                1+
              </div>
              <div style={{ fontSize: 11, color: "#5A5A7A", marginTop: 2 }}>
                Yrs Required
              </div>
            </div>
            <div className="stat-box">
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#22C55E",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                2
              </div>
              <div style={{ fontSize: 11, color: "#5A5A7A", marginTop: 2 }}>
                Open Seats
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div
        style={{
          borderBottom: "1px solid #1A1A2E",
          padding: "16px 24px",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat;
          const catData = qaData.find((c) => c.category === cat);
          const color = catData ? catData.color : "#E8E8F0";
          return (
            <button
              key={cat}
              className="pill"
              onClick={() => setActiveCategory(cat)}
              style={{
                background: isActive
                  ? catData
                    ? `${color}20`
                    : "#E8E8F020"
                  : "transparent",
                color: isActive ? color : "#5A5A7A",
                borderColor: isActive ? `${color}50` : "#1E1E2E",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Q&A Sections */}
      <div
        style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px 80px" }}
      >
        {filteredData.map((category, catIdx) => {
          const realCatIdx = qaData.indexOf(category);
          return (
            <div key={catIdx} style={{ marginBottom: 40 }}>
              {/* Category Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 3,
                    height: 20,
                    background: category.color,
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
                <h2
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: category.color,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {category.category}
                </h2>
                <div style={{ flex: 1, height: 1, background: "#1A1A2E" }} />
                <span style={{ fontSize: 11, color: "#3A3A5A" }}>
                  {category.questions.length} questions
                </span>
              </div>

              {/* Questions */}
              {category.questions.map((item, qIdx) => {
                const key = `${realCatIdx}-${qIdx}`;
                const isOpen = !!openItems[key];
                return (
                  <div
                    key={qIdx}
                    className="qa-card"
                    style={{
                      borderColor: isOpen ? `${category.color}30` : undefined,
                    }}
                  >
                    <button
                      className="qa-question"
                      onClick={() => toggle(realCatIdx, qIdx)}
                      style={{ background: isOpen ? "#0C0C18" : undefined }}
                    >
                      <svg
                        className={`chevron ${isOpen ? "open" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={isOpen ? category.color : "#3A3A5A"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      <span style={{ color: isOpen ? "#E8E8F0" : "#B0B0C8" }}>
                        {item.q}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="qa-answer">
                        <div
                          style={{
                            borderLeft: `2px solid ${category.color}50`,
                            paddingLeft: 16,
                            marginTop: 4,
                          }}
                        >
                          {item.a}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Footer */}
        <div
          style={{
            marginTop: 48,
            padding: "24px",
            background: "#0D0D1A",
            border: "1px solid #1A1A2E",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#3A3A5A",
              marginBottom: 8,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Apply via email
          </div>
          <div style={{ fontSize: 13, color: "#00D9FF" }}>roy@krazyit.com</div>
          <div style={{ fontSize: 11, color: "#3A3A5A", marginTop: 8 }}>
            Subject: Applying for Senior Full-Stack Developer
          </div>
          <div style={{ fontSize: 11, color: "#2A2A3A", marginTop: 16 }}>
            Office: Motijheel, Dhaka · Sun–Thu, 9:30AM–6PM
          </div>
        </div>
      </div>
    </div>
  );
}
